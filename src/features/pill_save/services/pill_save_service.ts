import { getDatabase } from '@services/database/sqlite';
import { IPillSaveData } from '@features/pill_save/types/pill_save_type';
import { ISavedPillFolder } from '@services/database/types';
import logger from '@utils/logger';
import { useAppTrackStore } from '@store/app_track_store';

/**
 * 저장된 알약 폴더와 데이터를 SQLite 기반으로 관리하는 서비스
 */
export const pillSaveService = {
  /**
   * 폴더 목록 및 각 폴더별 알약 개수 가져오기
   */
  async getFolders(): Promise<(ISavedPillFolder & { pill_count: number })[]> {
    try {
      const db = await getDatabase();
      const rows = await db.getAllAsync<
        ISavedPillFolder & { pill_count: number }
      >(`
        SELECT 
          f.*, 
          (SELECT COUNT(*) FROM saved_pills p WHERE p.folder_id = f.id) as pill_count 
        FROM saved_pill_folders f 
        ORDER BY f.is_default DESC, f.created_at ASC
      `);
      return rows;
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
      const db = await getDatabase();
      const result = await db.runAsync(
        `INSERT INTO saved_pill_folders (name) VALUES (?)`,
        [name],
      );
      return result.lastInsertRowId;
    } catch (e: any) {
      logger.error(`[PILL-SAVE-SERVICE] Failed to create folder: ${e}`);
      return null;
    }
  },

  /**
   * 특정 폴더 삭제 (기본 폴더는 삭제 불가 처리를 UI에서 하더라도 DB단에서 한번 더 체크)
   */
  async deleteFolder(folderId: number): Promise<boolean> {
    try {
      const db = await getDatabase();
      // CASCADE 제약조건이 있으므로 폴더 삭제 시 saved_pills도 삭제됨
      await db.runAsync(
        `DELETE FROM saved_pill_folders WHERE id = ? AND is_default = 0`,
        [folderId],
      );
      return true;
    } catch (e: any) {
      logger.error(`[PILL-SAVE-SERVICE] Failed to delete folder: ${e}`);
      return false;
    }
  },

  /**
   * 특정 알약이 저장되어 있는 폴더 ID 목록 가져오기
   */
  async getPillSavedFolderIds(itemSeq: string): Promise<number[]> {
    try {
      const db = await getDatabase();
      const rows = await db.getAllAsync<{ folder_id: number }>(
        `SELECT folder_id FROM saved_pills WHERE item_seq = ?`,
        [itemSeq],
      );
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
      const db = await getDatabase();

      // 트랜잭션 시작 (간이 구현)
      await db.runAsync('BEGIN TRANSACTION');

      // 기존 해당 알약의 모든 폴더 매핑 삭제
      await db.runAsync(`DELETE FROM saved_pills WHERE item_seq = ?`, [
        itemSeq,
      ]);

      // 새로 매핑
      for (const folderId of folderIds) {
        await db.runAsync(
          `INSERT INTO saved_pills (folder_id, item_seq, item_name) VALUES (?, ?, ?)`,
          [folderId, itemSeq, itemName],
        );
      }

      await db.runAsync('COMMIT');

      // 트래킹
      if (folderIds.length > 0) {
        useAppTrackStore.getState().increaseReviewActionCount('bookmarked');
      }
    } catch (e: any) {
      const db = await getDatabase();
      await db.runAsync('ROLLBACK');
      logger.error(`[PILL-SAVE-SERVICE] Failed to save pill to folders: ${e}`);
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
      const db = await getDatabase();
      await db.runAsync(
        `DELETE FROM saved_pills WHERE item_seq = ? AND folder_id = ?`,
        [itemSeq, folderId],
      );
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
      const rows = await db.getAllAsync<IPillSaveData>(
        `
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
      `,
        [folderId],
      );

      return rows;
    } catch (e: any) {
      logger.error(`[PILL-SAVE-SERVICE] Failed to get pills by folder: ${e}`);
      return [];
    }
  },
};
