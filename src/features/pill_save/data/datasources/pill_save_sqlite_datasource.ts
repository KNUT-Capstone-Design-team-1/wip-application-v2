import { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase } from '@services/database/sqlite';
import { IPillSaveData } from '@features/pill_save/types/pill_save_item_type';
import { ISavedPillFolder } from '@services/database/types';
import {
  IPillSaveOperationItem,
  IPillSaveOperationResult,
  ISavedFolderWithPillCount,
} from '@features/pill_save/types/pill_save_folder_type';
import { FolderSortOption } from '@features/pill_save/constants/pill_save_constant';
import logger from '@utils/logger';

// 일관된 데이터소스 에러 로깅 헬퍼 함수
const logDataSourceError = (action: string, error: unknown) => {
  logger.error(`[PILL-SAVE-DATASOURCE] Failed to ${action}: ${error}`);
};

// SQL IN 절 파라미터용 플레이스홀더 문자열 생성 헬퍼 함수
const createPlaceholders = (count: number): string =>
  count > 0 ? new Array(count).fill('?').join(',') : '';

// 트랜잭션 실행 헬퍼 함수
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
        logDataSourceError('rollback transaction', rollbackError);
      }

      throw e;
    }
  }
};

// 알약 보관함 SQLite 데이터 소스 인터페이스
export interface IPillSaveDataSource {
  getFolders(sortBy: FolderSortOption): Promise<ISavedFolderWithPillCount[]>;

  getFolderPreviewImages(folderId: number): Promise<string[]>;

  createFolder(name: string): Promise<number | null>;

  renameFolder(folderId: number, name: string): Promise<boolean>;

  deleteFolder(folderId: number): Promise<boolean>;

  deleteMultiplePills(itemSeqs: string[], folderId: number): Promise<boolean>;

  getPillSavedFolderIds(itemSeq: string): Promise<number[]>;

  savePillToFolders(
    itemSeq: string,
    itemName: string,
    folderIds: number[],
  ): Promise<void>;

  movePillsToFolders(
    items: IPillSaveOperationItem[],
    sourceFolderId: number,
    targetFolderIds: number[],
  ): Promise<IPillSaveOperationResult>;

  copyPillsToFolders(
    items: IPillSaveOperationItem[],
    targetFolderIds: number[],
  ): Promise<IPillSaveOperationResult>;

  deletePillFromFolder(itemSeq: string, folderId: number): Promise<boolean>;

  getPillsByFolder(folderId: number): Promise<IPillSaveData[]>;
}

// SQLite 기반 알약 보관함 데이터 소스 구현체
export const pillSaveSqliteDataSource: IPillSaveDataSource = {
  // 폴더 목록 및 각 폴더별 알약 개수 조회
  async getFolders(sortBy: FolderSortOption) {
    try {
      const db = await getDatabase();

      await db.runAsync(
        `
        INSERT INTO saved_pill_folders (name, is_default, sort_order)
        SELECT ?, 1, 0
        WHERE NOT EXISTS (
          SELECT 1 FROM saved_pill_folders WHERE is_default = 1
        )
      `,
        ['기본'],
      );

      const orderBySql: Record<FolderSortOption, string> = {
        createdAt_desc: 'f.created_at DESC',
        createdAt_asc: 'f.created_at ASC',
        name_asc: 'f.name ASC',
        pillCount_desc: 'pill_count DESC, f.created_at DESC',
      };

      const selectFoldersQuery = `
        SELECT 
          f.*, 
          (SELECT COUNT(*) FROM saved_pills p WHERE p.folder_id = f.id) as pill_count 
        FROM saved_pill_folders f 
        ORDER BY f.is_default DESC, ${orderBySql[sortBy]}
      `;

      return await db.getAllAsync<ISavedFolderWithPillCount>(
        selectFoldersQuery,
      );
    } catch (e) {
      logDataSourceError('get folders', e);
      return [];
    }
  },

  // 특정 폴더의 최근 저장 알약 프리뷰 이미지 목록 조회
  async getFolderPreviewImages(folderId: number): Promise<string[]> {
    try {
      const db = await getDatabase();

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
    } catch (e) {
      logDataSourceError('get folder preview images', e);
      return [];
    }
  },

  // 새 보관함 폴더 레코드 삽입
  async createFolder(name: string): Promise<number | null> {
    try {
      const db = await getDatabase();

      const insertQuery = `INSERT INTO saved_pill_folders (name) VALUES (?)`;

      const result = await db.runAsync(insertQuery, [name]);

      return result.lastInsertRowId;
    } catch (e) {
      logDataSourceError('create folder', e);
      return null;
    }
  },

  // 폴더 이름 수정
  async renameFolder(folderId: number, name: string): Promise<boolean> {
    try {
      const db = await getDatabase();

      const updateQuery = `UPDATE saved_pill_folders SET name = ? WHERE id = ?`;

      await db.runAsync(updateQuery, [name, folderId]);

      return true;
    } catch (e) {
      logDataSourceError('rename folder', e);
      return false;
    }
  },

  // 특정 폴더 삭제 (기본 폴더 제외)
  async deleteFolder(folderId: number): Promise<boolean> {
    try {
      const db = await getDatabase();

      const deleteQuery = `DELETE FROM saved_pill_folders WHERE id = ? AND is_default = 0`;

      await db.runAsync(deleteQuery, [folderId]);

      return true;
    } catch (e) {
      logDataSourceError('delete folder', e);
      return false;
    }
  },

  // 특정 폴더 내 다중 알약 삭제
  async deleteMultiplePills(
    itemSeqs: string[],
    folderId: number,
  ): Promise<boolean> {
    try {
      if (!itemSeqs || itemSeqs.length === 0) {
        return true;
      }

      const db = await getDatabase();
      const placeholders = createPlaceholders(itemSeqs.length);

      const deletePillsQuery = `
        DELETE FROM saved_pills 
        WHERE folder_id = ? AND item_seq IN (${placeholders})
      `;

      await db.runAsync(deletePillsQuery, [folderId, ...itemSeqs]);

      return true;
    } catch (e) {
      logDataSourceError('delete multiple pills', e);
      return false;
    }
  },

  // 특정 알약이 저장되어 있는 폴더 ID 목록 조회
  async getPillSavedFolderIds(itemSeq: string): Promise<number[]> {
    try {
      const db = await getDatabase();

      const selectSavedFoldersQuery = `
        SELECT folder_id 
        FROM saved_pills 
        WHERE item_seq = ?
      `;

      const rows = await db.getAllAsync<{ folder_id: number }>(
        selectSavedFoldersQuery,
        [itemSeq],
      );

      return rows.map((r) => r.folder_id);
    } catch (e) {
      logDataSourceError('get pill saved folders', e);
      return [];
    }
  },

  // 특정 알약을 대상 폴더들에 일괄 저장 (기존 저장 정보 덮어쓰기)
  async savePillToFolders(
    itemSeq: string,
    itemName: string,
    folderIds: number[],
  ): Promise<void> {
    try {
      const db = await getDatabase();

      await runInTransaction(db, async () => {
        const deleteQuery = `DELETE FROM saved_pills WHERE item_seq = ?`;

        await db.runAsync(deleteQuery, [itemSeq]);

        if (folderIds.length === 0) {
          return;
        }

        const insertQuery = `
          INSERT INTO saved_pills (folder_id, item_seq, item_name) 
          VALUES (?, ?, ?)
        `;

        for (const folderId of folderIds) {
          await db.runAsync(insertQuery, [folderId, itemSeq, itemName]);
        }
      });
    } catch (e) {
      logDataSourceError('save pill to folders', e);
      throw e;
    }
  },

  // 알약 다중 이동 처리
  async movePillsToFolders(
    items: IPillSaveOperationItem[],
    sourceFolderId: number,
    targetFolderIds: number[],
  ): Promise<IPillSaveOperationResult> {
    try {
      if (items.length === 0 || targetFolderIds.length === 0) {
        return { alreadyExistsItems: [] };
      }

      const db = await getDatabase();
      const itemSeqs = items.map((i) => i.seq);

      const targetPlaceholders = createPlaceholders(targetFolderIds.length);
      const itemPlaceholders = createPlaceholders(itemSeqs.length);

      const selectExistingPillsQuery = `
        SELECT folder_id, item_seq 
        FROM saved_pills 
        WHERE folder_id IN (${targetPlaceholders}) 
          AND item_seq IN (${itemPlaceholders})
      `;

      const existingRows = await db.getAllAsync<{
        folder_id: number;
        item_seq: string;
      }>(selectExistingPillsQuery, [...targetFolderIds, ...itemSeqs]);

      const existingSet = new Set(
        existingRows.map((r) => `${r.folder_id}_${r.item_seq}`),
      );

      const combinations = items
        .flatMap((item) =>
          targetFolderIds.map((targetId) => ({ item, targetId })),
        )
        .filter((c) => !existingSet.has(`${c.targetId}_${c.item.seq}`));

      const existingCombinations = items
        .flatMap((item) =>
          targetFolderIds.map((targetId) => ({ item, targetId })),
        )
        .filter((c) => existingSet.has(`${c.targetId}_${c.item.seq}`));

      const alreadyExistsItemsMap = new Map<string, IPillSaveOperationItem>();

      existingCombinations.forEach((c) =>
        alreadyExistsItemsMap.set(c.item.seq, c.item),
      );

      const alreadyExistsSeqs = new Set(alreadyExistsItemsMap.keys());

      const seqsToDelete = itemSeqs.filter(
        (seq) => !alreadyExistsSeqs.has(seq),
      );

      await runInTransaction(db, async () => {
        if (seqsToDelete.length > 0) {
          const deletePlaceholders = createPlaceholders(seqsToDelete.length);

          const deleteFromSourceQuery = `
            DELETE FROM saved_pills 
            WHERE folder_id = ? AND item_seq IN (${deletePlaceholders})
          `;

          await db.runAsync(deleteFromSourceQuery, [
            sourceFolderId,
            ...seqsToDelete,
          ]);
        }

        if (combinations.length > 0) {
          const insertToTargetQuery = `
            INSERT INTO saved_pills (folder_id, item_seq, item_name) 
            VALUES (?, ?, ?)
          `;

          for (const { item, targetId } of combinations) {
            await db.runAsync(insertToTargetQuery, [
              targetId,
              item.seq,
              item.name,
            ]);
          }
        }
      });

      return {
        alreadyExistsItems: Array.from(alreadyExistsItemsMap.values()),
      };
    } catch (e) {
      logDataSourceError('move pills', e);
      throw e;
    }
  },

  // 알약 다중 복사 처리
  async copyPillsToFolders(
    items: IPillSaveOperationItem[],
    targetFolderIds: number[],
  ): Promise<IPillSaveOperationResult> {
    try {
      if (items.length === 0 || targetFolderIds.length === 0) {
        return { alreadyExistsItems: [] };
      }

      const db = await getDatabase();
      const itemSeqs = items.map((i) => i.seq);

      const targetPlaceholders = createPlaceholders(targetFolderIds.length);
      const itemPlaceholders = createPlaceholders(itemSeqs.length);

      const selectExistingPillsQuery = `
        SELECT folder_id, item_seq 
        FROM saved_pills 
        WHERE folder_id IN (${targetPlaceholders}) 
          AND item_seq IN (${itemPlaceholders})
      `;

      const existingRows = await db.getAllAsync<{
        folder_id: number;
        item_seq: string;
      }>(selectExistingPillsQuery, [...targetFolderIds, ...itemSeqs]);

      const existingSet = new Set(
        existingRows.map((r) => `${r.folder_id}_${r.item_seq}`),
      );

      const combinations = items
        .flatMap((item) =>
          targetFolderIds.map((targetId) => ({ item, targetId })),
        )
        .filter((c) => !existingSet.has(`${c.targetId}_${c.item.seq}`));

      const existingCombinations = items
        .flatMap((item) =>
          targetFolderIds.map((targetId) => ({ item, targetId })),
        )
        .filter((c) => existingSet.has(`${c.targetId}_${c.item.seq}`));

      const alreadyExistsItemsMap = new Map<string, IPillSaveOperationItem>();

      existingCombinations.forEach((c) =>
        alreadyExistsItemsMap.set(c.item.seq, c.item),
      );

      if (combinations.length > 0) {
        await runInTransaction(db, async () => {
          const insertPillsQuery = `
            INSERT INTO saved_pills (folder_id, item_seq, item_name) 
            VALUES (?, ?, ?)
          `;

          for (const { item, targetId } of combinations) {
            await db.runAsync(insertPillsQuery, [
              targetId,
              item.seq,
              item.name,
            ]);
          }
        });
      }

      return {
        alreadyExistsItems: Array.from(alreadyExistsItemsMap.values()),
      };
    } catch (e) {
      logDataSourceError('copy pills', e);
      throw e;
    }
  },

  // 특정 폴더에서 특정 알약 단일 삭제
  async deletePillFromFolder(
    itemSeq: string,
    folderId: number,
  ): Promise<boolean> {
    try {
      const db = await getDatabase();

      const deletePillQuery = `
        DELETE FROM saved_pills 
        WHERE item_seq = ? AND folder_id = ?
      `;

      await db.runAsync(deletePillQuery, [itemSeq, folderId]);

      return true;
    } catch (e) {
      logDataSourceError('delete pill from folder', e);
      return false;
    }
  },

  // 특정 폴더의 저장된 모든 알약 목록 조회 (pill_data와 JOIN)
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

      return await db.getAllAsync<IPillSaveData>(selectPillsQuery, [folderId]);
    } catch (e) {
      logDataSourceError('get pills by folder', e);
      return [];
    }
  },
};
