import { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase } from '@services/database/sqlite';
import { IPillSaveData } from '@features/pill_save/types/pill_save_type';
import { ISavedPillFolder } from '@services/database/types';
import logger from '@utils/logger';
import { useAppTrackStore } from '@store/app_track_store';

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

/**
 * 트랜잭션을 안전하게 실행하기 위한 헬퍼 함수
 */
const runInTransaction = async (
  db: SQLiteDatabase,
  action: () => Promise<void>,
) => {
  await db.runAsync('BEGIN TRANSACTION');

  try {
    await action();

    await db.runAsync('COMMIT');
  } catch (e: any) {
    try {
      await db.runAsync('ROLLBACK');
    } catch (rollbackError) {
      logger.error(
        `[PILL-SAVE-SERVICE] Failed to rollback transaction: ${rollbackError}`,
      );
    }

    throw e;
  }
};

/**
 * 저장된 알약 폴더와 데이터를 SQLite 기반으로 관리하는 서비스
 */
export const pillSaveService = {
  /**
   * 폴더 목록 및 각 폴더별 알약 개수 가져오기
   */
  async getFolders(): Promise<
    (ISavedPillFolder & { pill_count: number; preview_images?: string[] })[]
  > {
    try {
      const db = await getDatabase();

      const selectFoldersQuery = `
        SELECT 
          f.*, 
          (SELECT COUNT(*) FROM saved_pills p WHERE p.folder_id = f.id) as pill_count 
        FROM saved_pill_folders f 
        ORDER BY f.sort_order ASC, f.is_default DESC, f.created_at ASC
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
          return { ...row, preview_images: previewImages };
        }),
      );

      return result;
    } catch (e: any) {
      logger.error(`[PILL-SAVE-SERVICE] Failed to get folders: ${e}`);
      return [];
    }
  },

  /**
   * 새 폴더 생성
   */
  async createFolder(name: string): Promise<number | null> {
    try {
      if (!name.trim()) return null;

      const db = await getDatabase();
      const insertQuery = `INSERT INTO saved_pill_folders (name) VALUES (?)`;

      const result = await db.runAsync(insertQuery, [name]);

      return result.lastInsertRowId;
    } catch (e: any) {
      logger.error(`[PILL-SAVE-SERVICE] Failed to create folder: ${e}`);
      return null;
    }
  },

  /**
   * 폴더 이름 변경
   */
  async renameFolder(folderId: number, name: string): Promise<boolean> {
    try {
      if (!name.trim()) return false;

      const db = await getDatabase();
      const updateQuery = `UPDATE saved_pill_folders SET name = ? WHERE id = ?`;

      await db.runAsync(updateQuery, [name, folderId]);

      return true;
    } catch (e: any) {
      logger.error(`[PILL-SAVE-SERVICE] Failed to rename folder: ${e}`);
      return false;
    }
  },

  /**
   * 폴더 순서 일괄 업데이트
   */
  async updateFoldersOrder(folderIds: number[]): Promise<boolean> {
    try {
      if (!folderIds || folderIds.length === 0) return true;

      const db = await getDatabase();
      const updateQuery = `UPDATE saved_pill_folders SET sort_order = ? WHERE id = ?`;

      await runInTransaction(db, async () => {
        for (let i = 0; i < folderIds.length; i++) {
          await db.runAsync(updateQuery, [i, folderIds[i]]);
        }
      });

      return true;
    } catch (e: any) {
      logger.error(`[PILL-SAVE-SERVICE] Failed to update folders order: ${e}`);
      return false;
    }
  },

  /**
   * 특정 폴더 삭제 (기본 폴더는 삭제 불가 처리를 UI에서 하더라도 DB단에서 한번 더 체크)
   */
  async deleteFolder(folderId: number): Promise<boolean> {
    try {
      const db = await getDatabase();

      // CASCADE 제약조건이 있으므로 폴더 삭제 시 saved_pills도 삭제됨
      const deleteQuery = `DELETE FROM saved_pill_folders WHERE id = ? AND is_default = 0`;
      await db.runAsync(deleteQuery, [folderId]);

      return true;
    } catch (e: any) {
      logger.error(`[PILL-SAVE-SERVICE] Failed to delete folder: ${e}`);
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
      if (!itemSeqs || itemSeqs.length === 0) return true;

      const db = await getDatabase();

      const placeholders = itemSeqs.map(() => '?').join(',');
      const query = `DELETE FROM saved_pills WHERE folder_id = ? AND item_seq IN (${placeholders})`;

      await db.runAsync(query, [folderId, ...itemSeqs]);

      return true;
    } catch (e: any) {
      logger.error(`[PILL-SAVE-SERVICE] Failed to delete multiple pills: ${e}`);
      return false;
    }
  },

  /**
   * 특정 알약이 저장되어 있는 폴더 ID 목록 가져오기
   */
  async getPillSavedFolderIds(itemSeq: string): Promise<number[]> {
    try {
      if (!itemSeq) return [];

      const db = await getDatabase();
      const selectQuery = `SELECT folder_id FROM saved_pills WHERE item_seq = ?`;

      const rows = await db.getAllAsync<{ folder_id: number }>(selectQuery, [
        itemSeq,
      ]);

      return rows.map((r) => r.folder_id);
    } catch (e: any) {
      logger.error(
        `[PILL-SAVE-SERVICE] Failed to get pill saved folders: ${e}`,
      );
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
      if (!itemSeq || !itemName) return;

      const db = await getDatabase();

      await runInTransaction(db, async () => {
        const deleteQuery = `DELETE FROM saved_pills WHERE item_seq = ?`;
        await db.runAsync(deleteQuery, [itemSeq]);

        if (folderIds.length === 0) return;

        const insertQuery = `INSERT INTO saved_pills (folder_id, item_seq, item_name) VALUES (?, ?, ?)`;
        for (const folderId of folderIds) {
          await db.runAsync(insertQuery, [folderId, itemSeq, itemName]);
        }
      });

      if (folderIds.length > 0) {
        useAppTrackStore.getState().increaseReviewActionCount('bookmarked');
      }
    } catch (e: any) {
      logger.error(`[PILL-SAVE-SERVICE] Failed to save pill to folders: ${e}`);
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
  ): Promise<void> {
    try {
      if (items.length === 0 || targetFolderIds.length === 0) return;

      const db = await getDatabase();

      const itemSeqs = items.map((i) => i.seq);
      const placeholders = itemSeqs.map(() => '?').join(',');

      const deleteQuery = `DELETE FROM saved_pills WHERE folder_id = ? AND item_seq IN (${placeholders})`;
      const insertQuery = `INSERT OR IGNORE INTO saved_pills (folder_id, item_seq, item_name) VALUES (?, ?, ?)`;

      const combinations = items.flatMap((item) =>
        targetFolderIds.map((targetId) => ({ item, targetId })),
      );

      await runInTransaction(db, async () => {
        // 기존 폴더에서 일괄 삭제
        await db.runAsync(deleteQuery, [sourceFolderId, ...itemSeqs]);

        // 대상 폴더들에 순차적으로 삽입
        for (const { item, targetId } of combinations) {
          await db.runAsync(insertQuery, [targetId, item.seq, item.name]);
        }
      });
    } catch (e: any) {
      logger.error(`[PILL-SAVE-SERVICE] Failed to move pills: ${e}`);
      throw e;
    }
  },

  /**
   * 알약 다중 복사
   */
  async copyPillsToFolders(
    items: { seq: string; name: string }[],
    targetFolderIds: number[],
  ): Promise<void> {
    try {
      if (items.length === 0 || targetFolderIds.length === 0) return;

      const db = await getDatabase();
      const insertQuery = `INSERT OR IGNORE INTO saved_pills (folder_id, item_seq, item_name) VALUES (?, ?, ?)`;

      const combinations = items.flatMap((item) =>
        targetFolderIds.map((targetId) => ({ item, targetId })),
      );

      await runInTransaction(db, async () => {
        for (const { item, targetId } of combinations) {
          await db.runAsync(insertQuery, [targetId, item.seq, item.name]);
        }
      });
    } catch (e: any) {
      logger.error(`[PILL-SAVE-SERVICE] Failed to copy pills: ${e}`);
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
      if (!itemSeq) return false;

      const db = await getDatabase();
      const deleteQuery = `DELETE FROM saved_pills WHERE item_seq = ? AND folder_id = ?`;

      await db.runAsync(deleteQuery, [itemSeq, folderId]);

      return true;
    } catch (e: any) {
      logger.error(
        `[PILL-SAVE-SERVICE] Failed to delete pill from folder: ${e}`,
      );
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
    } catch (e: any) {
      logger.error(`[PILL-SAVE-SERVICE] Failed to get pills by folder: ${e}`);
      return [];
    }
  },
};
