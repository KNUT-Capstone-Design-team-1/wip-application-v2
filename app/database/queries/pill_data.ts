import { getDatabase } from '../sqlite';
import { IPillData, ITTableColumnSchema } from '../types';
import {
  ALL_PILL_DATA_COLUMNS,
  getColumnPlaceholderForTableCreate,
  INSERT_BATCH_SIZE,
} from '../util';

/**
 * pill_data 테이블 유무 체크
 * @returns
 */
export const checkPillDataTableExist = async () => {
  const db = await getDatabase();

  const sql = `SELECT EXISTS (
    SELECT 1
    FROM sqlite_master
    WHERE type = 'table'
      AND name = ?
  ) AS exists`;

  const result = await db.getFirstAsync<{ exists: 0 | 1 }>(sql, ['pill_data']);

  return result?.exists;
};

/**
 * pill_data 테이블 삭제
 */
export const dropPillDataTable = async () => {
  const db = await getDatabase();

  await db.execAsync(`DROP TABLE IF EXISTS pill_data`);
};

/**
 * pill_data 테이블 생성
 * @param columnData 컬럼 정보
 */
export const createPillDataTable = async (
  columnData: ITTableColumnSchema[],
) => {
  const db = await getDatabase();

  const columnDefs = getColumnPlaceholderForTableCreate(columnData);

  const sql = `
    CREATE TABLE IF NOT EXISTS pill_data (
      ${columnDefs.join(',\n      ')}
    )`;

  await db.execAsync(sql);
};

/**
 * pill_data 테이블에 데이터 삽입
 * @param data 삽입할 데이터
 */
export const insertPillData = async (data: Partial<IPillData>[]) => {
  if (data.length === 0) {
    return;
  }

  const db = await getDatabase();

  for (let i = 0; i < data.length; i += INSERT_BATCH_SIZE) {
    const batch = data.slice(i, i + INSERT_BATCH_SIZE);

    await db.withTransactionAsync(async () => {
      for (const row of batch) {
        const entries = Object.entries(row).filter(([, v]) => v !== undefined);

        if (!entries.length) {
          continue;
        }

        const columns = entries.map(([key]) => key);
        const values = entries.map(([, v]) => v);
        const placeholders = columns.map(() => '?').join(', ');

        const sql = `INSERT INTO pill_data (${columns.join(', ')}) VALUES (${placeholders})`;

        await db.runAsync(sql, values);
      }
    });
  }
};

/**
 * ID 값인 ITEM_SEQ를 기준으로 pill_data를 조회
 * @param itemSeqs ITEM_SEQ 배열
 * @returns
 */
export const getPillDatasByItemSeq = async (itemSeqs: string[]) => {
  if (itemSeqs.length === 0) {
    return [];
  }

  const db = await getDatabase();

  const sql = `SELECT ${ALL_PILL_DATA_COLUMNS} FROM pill_data WHERE ITEM_SEQ IN (${itemSeqs.map(() => '?').join(', ')})`;

  const result = await db.getAllAsync<IPillData>(sql, itemSeqs);

  return result;
};
