import { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase } from '@services/database/sqlite';
import { IPillSaveData } from '@features/pill_save/types/pill_save_type';
import { ISavedPillFolder } from '@services/database/types';
import logger from '@utils/logger';
import { useAppTrackStore } from '@store/app_track_store';

// 일관된 서비스 에러 로깅 헬퍼 함수
const logServiceError = (action: string, error: unknown) => {
  logger.error(`[PILL-SAVE-SERVICE] Failed to ${action}: ${error}`);
};

// SQL IN 절 파라미터용 플레이스홀더 문자열 생성 헬퍼 함수
const createPlaceholders = (count: number): string =>
  count > 0 ? new Array(count).fill('?').join(',') : '';

/**
 * 폴더별 프리뷰 이미지(최대 4개)를 가져오는 헬퍼 함수
 */
const getFolderPreviewImages = async (
  db: SQLiteDatabase,
  folderId: number,
): Promise<string[]> => {
  const selectImagesQuery = `
    SELECT p.ITEM_IMAGE 
    FROM saved_pills s 
    LEFT JOIN pill_data p ON s.item_seq = p.ITEM_SEQ 
    WHERE s.folder_id = ? AND p.ITEM_IMAGE IS NOT NULL AND p.ITEM_IMAGE != '' 
    ORDER BY s.idx DESC 
    LIMIT 4
  `;

  const images = await db.getAllAsync<{ ITEM_IMAGE: string }>(
    selectImagesQuery,
    [folderId],
  );

  return images.map((img) => img.ITEM_IMAGE).filter(Boolean);
};

// 이미 대상 폴더들에 저장되어 있는 (folder_id, item_seq) 조합 조회 헬퍼 함수
const getExistingFolderPillSet = async (
  db: SQLiteDatabase,
  folderIds: number[],
  itemSeqs: string[],
): Promise<Set<string>> => {
  if (folderIds.length === 0 || itemSeqs.length === 0) {
    return new Set();
  }

  const targetPlaceholders = createPlaceholders(folderIds.length);
  const itemPlaceholders = createPlaceholders(itemSeqs.length);

  const existingRows = await db.getAllAsync<{
    folder_id: number;
    item_seq: string;
  }>(
    `SELECT folder_id, item_seq FROM saved_pills WHERE folder_id IN (${targetPlaceholders}) AND item_seq IN (${itemPlaceholders})`,
    [...folderIds, ...itemSeqs],
  );

  return new Set(existingRows.map((r) => `${r.folder_id}_${r.item_seq}`));
};

// 알약-폴더 조합 목록을 DB에 일괄 삽입하는 헬퍼 함수
const insertPillCombinations = async (
  db: SQLiteDatabase,
  combinations: { item: { seq: string; name: string }; targetId: number }[],
): Promise<void> => {
  if (combinations.length === 0) {
    return;
  }

  const insertQuery = `INSERT INTO saved_pills (folder_id, item_seq, item_name) VALUES (?, ?, ?)`;
  for (const { item, targetId } of combinations) {
    await db.runAsync(insertQuery, [targetId, item.seq, item.name]);
  }
};

// 추가할 알약과 이미 존재하는 알약을 분리하는 헬퍼 함수
const processPillCombinations = async (
  db: SQLiteDatabase,
  items: { seq: string; name: string }[],
  targetFolderIds: number[],
) => {
  const itemSeqs = items.map((i) => i.seq);
  const existingSet = await getExistingFolderPillSet(
    db,
    targetFolderIds,
    itemSeqs,
  );

  const combinations = items
    .flatMap((item) => targetFolderIds.map((targetId) => ({ item, targetId })))
    .filter((c) => !existingSet.has(`${c.targetId}_${c.item.seq}`));

  const existingCombinations = items
    .flatMap((item) => targetFolderIds.map((targetId) => ({ item, targetId })))
    .filter((c) => existingSet.has(`${c.targetId}_${c.item.seq}`));

  const alreadyExistsItemsMap = new Map<
    string,
    { seq: string; name: string }
  >();
  existingCombinations.forEach((c) =>
    alreadyExistsItemsMap.set(c.item.seq, c.item),
  );

  return {
    itemSeqs,
    combinations,
    alreadyExistsItems: Array.from(alreadyExistsItemsMap.values()),
    alreadyExistsItemsMap,
  };
};

const runInTransaction = async (
  db: SQLiteDatabase,
  action: () => Promise<void>,
) => {
  if (typeof db.withTransactionAsync === 'function') {
    await db.withTransactionAsync(async () => {
      await action();
    });
  } else {
    await db.runAsync('BEGIN TRANSACTION');
    try {
      await action();
      await db.runAsync('COMMIT');
    } catch (e: unknown) {
      try {
        await db.runAsync('ROLLBACK');
      } catch (rollbackError) {
        logServiceError('rollback transaction', rollbackError);
      }
      throw e;
    }
  }
};

/**
 * 저장된 알약 폴더와 데이터를 SQLite 기반으로 관리하는 서비스
 */
export const pillSaveService = {
  /**
   * 폴더 목록 및 각 폴더별 알약 개수 가져오기
   */
  async getFolders(
    sortBy:
      | 'createdAt_asc'
      | 'createdAt_desc'
      | 'name_asc'
      | 'pillCount_desc' = 'name_asc',
  ): Promise<
    (ISavedPillFolder & { pill_count: number; preview_images?: string[] })[]
  > {
    try {
      const db = await getDatabase();

      let orderClause = 'f.created_at ASC';
      if (sortBy === 'createdAt_desc') {
        orderClause = 'f.created_at DESC';
      }
      if (sortBy === 'name_asc') {
        orderClause = 'f.name ASC';
      }
      if (sortBy === 'pillCount_desc') {
        orderClause = 'pill_count DESC, f.created_at DESC';
      }

      const selectFoldersQuery = `
        SELECT 
          f.*, 
          (SELECT COUNT(*) FROM saved_pills p WHERE p.folder_id = f.id) as pill_count 
        FROM saved_pill_folders f 
        ORDER BY f.is_default DESC, ${orderClause}
      `;

      const rows = await db.getAllAsync<
        ISavedPillFolder & { pill_count: number }
      >(selectFoldersQuery);

      const result = await Promise.all(
        rows.map(async (row) => {
          if (row.pill_count === 0) {
            return { ...row, preview_images: [] };
          }

          const previewImages = await getFolderPreviewImages(db, row.id);

          return {
            ...row,
            preview_images: previewImages,
          };
        }),
      );

      return result;
    } catch (e) {
      logServiceError('get folders', e);
      return [];
    }
  },

  /**
   * 새 폴더 생성
   */
  async createFolder(name: string): Promise<number | null> {
    try {
      if (!name.trim()) {
        return null;
      }

      const db = await getDatabase();
      const insertQuery = `INSERT INTO saved_pill_folders (name) VALUES (?)`;

      const result = await db.runAsync(insertQuery, [name]);

      return result.lastInsertRowId;
    } catch (e) {
      logServiceError('create folder', e);
      return null;
    }
  },

  /**
   * 폴더 이름 변경
   */
  async renameFolder(folderId: number, name: string): Promise<boolean> {
    try {
      if (!name.trim()) {
        return false;
      }

      const db = await getDatabase();
      const updateQuery = `UPDATE saved_pill_folders SET name = ? WHERE id = ?`;

      await db.runAsync(updateQuery, [name, folderId]);

      return true;
    } catch (e) {
      logServiceError('rename folder', e);
      return false;
    }
  },

  /**
   * 특정 폴더 삭제 (기본 폴더는 삭제 불가 처리를 UI에서 하더라도 DB단에서 한번 더 체크)
   */
  async deleteFolder(folderId: number): Promise<boolean> {
    try {
      const db = await getDatabase();

      const deleteQuery = `DELETE FROM saved_pill_folders WHERE id = ? AND is_default = 0`;
      await db.runAsync(deleteQuery, [folderId]);

      return true;
    } catch (e) {
      logServiceError('delete folder', e);
      return false;
    }
  },

  /**
   * 특정 폴더에서 여러 알약 삭제 (다중 삭제 최적화)
   */
  async deleteMultiplePillsFromFolder(
    itemSeqs: string[],
    folderId: number,
  ): Promise<boolean> {
    try {
      if (!itemSeqs || itemSeqs.length === 0) {
        return true;
      }

      const db = await getDatabase();
      const placeholders = createPlaceholders(itemSeqs.length);
      const query = `DELETE FROM saved_pills WHERE folder_id = ? AND item_seq IN (${placeholders})`;

      await db.runAsync(query, [folderId, ...itemSeqs]);

      return true;
    } catch (e) {
      logServiceError('delete multiple pills', e);
      return false;
    }
  },

  /**
   * 특정 알약이 저장되어 있는 폴더 ID 목록 가져오기
   */
  async getPillSavedFolderIds(itemSeq: string): Promise<number[]> {
    try {
      if (!itemSeq) {
        return [];
      }

      const db = await getDatabase();
      const selectQuery = `SELECT folder_id FROM saved_pills WHERE item_seq = ?`;

      const rows = await db.getAllAsync<{ folder_id: number }>(selectQuery, [
        itemSeq,
      ]);

      return rows.map((r) => r.folder_id);
    } catch (e) {
      logServiceError('get pill saved folders', e);
      return [];
    }
  },

  /**
   * 알약을 선택한 폴더들에 저장 (기존 저장 정보는 모두 덮어씀)
   */
  async savePillToFolders(
    itemSeq: string,
    itemName: string,
    folderIds: number[],
  ): Promise<void> {
    try {
      if (!itemSeq || !itemName) {
        return;
      }

      const db = await getDatabase();

      await runInTransaction(db, async () => {
        const deleteQuery = `DELETE FROM saved_pills WHERE item_seq = ?`;
        await db.runAsync(deleteQuery, [itemSeq]);

        if (folderIds.length === 0) {
          return;
        }

        const insertQuery = `INSERT INTO saved_pills (folder_id, item_seq, item_name) VALUES (?, ?, ?)`;
        for (const folderId of folderIds) {
          await db.runAsync(insertQuery, [folderId, itemSeq, itemName]);
        }
      });

      if (folderIds.length > 0) {
        useAppTrackStore.getState().increaseReviewActionCount('bookmarked');
      }
    } catch (e) {
      logServiceError('save pill to folders', e);
      throw e;
    }
  },

  /**
   * 알약 다중 이동 (특정 폴더에서 다른 폴더들로)
   */
  async movePillsToFolders(
    items: { seq: string; name: string }[],
    sourceFolderId: number,
    targetFolderIds: number[],
  ): Promise<{ alreadyExistsItems: { seq: string; name: string }[] }> {
    try {
      if (items.length === 0 || targetFolderIds.length === 0) {
        return { alreadyExistsItems: [] };
      }

      const db = await getDatabase();
      const {
        itemSeqs,
        combinations,
        alreadyExistsItems,
        alreadyExistsItemsMap,
      } = await processPillCombinations(db, items, targetFolderIds);

      const alreadyExistsSeqs = new Set(alreadyExistsItemsMap.keys());
      const seqsToDelete = itemSeqs.filter(
        (seq) => !alreadyExistsSeqs.has(seq),
      );

      await runInTransaction(db, async () => {
        if (seqsToDelete.length > 0) {
          const deletePlaceholders = createPlaceholders(seqsToDelete.length);
          const deleteQuery = `DELETE FROM saved_pills WHERE folder_id = ? AND item_seq IN (${deletePlaceholders})`;
          await db.runAsync(deleteQuery, [sourceFolderId, ...seqsToDelete]);
        }

        await insertPillCombinations(db, combinations);
      });

      return { alreadyExistsItems };
    } catch (e) {
      logServiceError('move pills', e);
      throw e;
    }
  },

  /**
   * 알약 다중 복사
   */
  async copyPillsToFolders(
    items: { seq: string; name: string }[],
    targetFolderIds: number[],
  ): Promise<{ alreadyExistsItems: { seq: string; name: string }[] }> {
    try {
      if (items.length === 0 || targetFolderIds.length === 0) {
        return { alreadyExistsItems: [] };
      }

      const db = await getDatabase();
      const { combinations, alreadyExistsItems } =
        await processPillCombinations(db, items, targetFolderIds);

      if (combinations.length > 0) {
        await runInTransaction(db, async () => {
          await insertPillCombinations(db, combinations);
        });
      }

      return { alreadyExistsItems };
    } catch (e) {
      logServiceError('copy pills', e);
      throw e;
    }
  },

  /**
   * 특정 폴더에서 특정 알약 삭제
   */
  async deletePillFromFolder(
    itemSeq: string,
    folderId: number,
  ): Promise<boolean> {
    try {
      if (!itemSeq) {
        return false;
      }

      const db = await getDatabase();
      const deleteQuery = `DELETE FROM saved_pills WHERE item_seq = ? AND folder_id = ?`;

      await db.runAsync(deleteQuery, [itemSeq, folderId]);

      return true;
    } catch (e) {
      logServiceError('delete pill from folder', e);
      return false;
    }
  },

  /**
   * 특정 폴더의 저장된 모든 알약 목록 가져오기 (pill_data와 JOIN)
   */
  async getPillsByFolder(folderId: number): Promise<IPillSaveData[]> {
    try {
      const db = await getDatabase();

      const selectPillsQuery = `
        SELECT 
          s.item_seq as ITEM_SEQ,
          COALESCE(p.ITEM_NAME, s.item_name, '정보가 없는 약') as ITEM_NAME,
          COALESCE(p.ENTP_NAME, '') as ENTP_NAME,
          COALESCE(p.CHART, '') as CHART,
          COALESCE(p.ITEM_IMAGE, '') as ITEM_IMAGE,
          COALESCE(p.CLASS_NAME, '') as CLASS_NAME,
          COALESCE(p.PRINT_FRONT, '') as PRINT_FRONT,
          COALESCE(p.PRINT_BACK, '') as PRINT_BACK
        FROM saved_pills s
        LEFT JOIN pill_data p ON s.item_seq = p.ITEM_SEQ
        WHERE s.folder_id = ?
        ORDER BY s.idx DESC
      `;

      const rows = await db.getAllAsync<IPillSaveData>(selectPillsQuery, [
        folderId,
      ]);

      return rows;
    } catch (e) {
      logServiceError('get pills by folder', e);
      return [];
    }
  },
};
