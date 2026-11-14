import { buildSavedItemMetadata } from '@services/database/queries/saved_item_metadata';
import { transferSavedPills } from './pill_save_transfer';
import { runDatabaseTransaction } from '@services/database/transaction';
import { splitQueryValues } from '@services/database/query_batch';
import { getDatabase } from '@services/database/sqlite';
import { IPillSaveData } from '@features/pill_save/types/pill_save_item_type';
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

const savedMetadata = buildSavedItemMetadata('s', 'p');

// SQLite 기반 알약 보관함 데이터 소스 구현체
export const pillSaveSqliteDataSource = {
  // 폴더 목록 및 각 폴더별 알약 개수 조회
  async getFolders(
    sortBy: FolderSortOption,
  ): Promise<ISavedFolderWithPillCount[]> {
    try {
      const db = await getDatabase();

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

  // 폴더마다 브리지를 왕복하지 않고, 각 폴더의 최근 이미지 4개만 읽는다.
  async getFolderPreviewImagesByIds(
    folderIds: number[],
  ): Promise<Record<number, string[]>> {
    if (folderIds.length === 0) return {};
    try {
      const db = await getDatabase();
      const rows = await db.getAllAsync<{
        folder_id: number;
        images: string;
      }>(
        `SELECT f.id AS folder_id, (
          SELECT json_group_array(ITEM_IMAGE) FROM (
            SELECT p.ITEM_IMAGE
            FROM saved_pills s
            JOIN pill_data p ON s.item_seq = p.ITEM_SEQ
            WHERE s.folder_id = f.id
              AND p.ITEM_IMAGE IS NOT NULL AND p.ITEM_IMAGE != ''
            ORDER BY s.idx DESC LIMIT 4
          )
        ) AS images
        FROM saved_pill_folders f
        WHERE f.id IN (${createPlaceholders(folderIds.length)})`,
        folderIds,
      );
      return Object.fromEntries(
        rows.map((row) => [row.folder_id, JSON.parse(row.images)]),
      );
    } catch (e) {
      logDataSourceError('get folder preview images in batch', e);
      return {};
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

      const result = await db.runAsync(updateQuery, [name, folderId]);

      return result.changes > 0;
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

      const result = await db.runAsync(deleteQuery, [folderId]);

      return result.changes > 0;
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
      let changes = 0;
      await runDatabaseTransaction(db, async () => {
        for (const chunk of splitQueryValues([...new Set(itemSeqs)], 1)) {
          const result = await db.runAsync(
            `DELETE FROM saved_pills WHERE folder_id = ?
             AND item_seq IN (${createPlaceholders(chunk.length)})`,
            [folderId, ...chunk],
          );
          changes += result.changes;
        }
      });
      return changes > 0;
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
  ): Promise<boolean> {
    try {
      const db = await getDatabase();
      let removedFolders = false;

      await runDatabaseTransaction(db, async () => {
        const targets = [...new Set(folderIds)];
        // 유지하는 폴더는 삭제하지 않아 생성 순서와 연결된 복용 알림을 보존한다.
        const deletion = await db.runAsync(
          `DELETE FROM saved_pills WHERE item_seq = ?${
            targets.length
              ? ` AND folder_id NOT IN (${createPlaceholders(targets.length)})`
              : ''
          }`,
          [itemSeq, ...targets],
        );
        removedFolders = deletion.changes > 0;
        for (let start = 0; start < targets.length; start += 300) {
          const chunk = targets.slice(start, start + 300);
          await db.runAsync(
            `INSERT INTO saved_pills (folder_id, item_seq, item_name)
             VALUES ${chunk.map(() => '(?, ?, ?)').join(',')}
             ON CONFLICT(folder_id, item_seq) DO UPDATE SET item_name = excluded.item_name`,
            chunk.flatMap((folderId) => [folderId, itemSeq, itemName]),
          );
        }
      });
      return removedFolders;
    } catch (e) {
      logDataSourceError('save pill to folders', e);
      throw e;
    }
  },

  async movePillsToFolders(
    items: IPillSaveOperationItem[],
    sourceFolderId: number,
    targetFolderIds: number[],
  ): Promise<IPillSaveOperationResult> {
    try {
      return await transferSavedPills(
        await getDatabase(),
        items,
        targetFolderIds,
        sourceFolderId,
      );
    } catch (error) {
      logDataSourceError('move pills', error);
      throw error;
    }
  },

  async copyPillsToFolders(
    items: IPillSaveOperationItem[],
    targetFolderIds: number[],
  ): Promise<IPillSaveOperationResult> {
    try {
      return await transferSavedPills(
        await getDatabase(),
        items,
        targetFolderIds,
      );
    } catch (error) {
      logDataSourceError('copy pills', error);
      throw error;
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

      const result = await db.runAsync(deletePillQuery, [itemSeq, folderId]);

      return result.changes > 0;
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
          ${savedMetadata.itemName} as ITEM_NAME,
          ${savedMetadata.manufacturer} as ENTP_NAME,
          COALESCE(p.CHART, '') as CHART,
          COALESCE(p.ITEM_IMAGE, '') as ITEM_IMAGE,
          ${savedMetadata.className} as CLASS_NAME,
          COALESCE(p.PRINT_FRONT, '') as PRINT_FRONT,
          COALESCE(p.PRINT_BACK, '') as PRINT_BACK
        FROM saved_pills s
        ${savedMetadata.joins}
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
