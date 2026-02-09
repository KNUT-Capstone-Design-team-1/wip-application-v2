import { getDatabase } from '../sqlite';
import { ITableColumnSchema, TDataTable, TResourceDataSchemas } from '../types';
import { getColumnPlaceholderForTableCreate } from '../util';

/**
 * 테이블 유무 확인
 * !NOTICE: 서버리스 API를 통해 스키마를 관리하는 테이블에만 사용한다
 * @param table 테이블 이름
 * @returns
 */
export const checkTableExist = async (table: TDataTable) => {
  const db = await getDatabase();

  const sql = `SELECT EXISTS (
    SELECT 1
    FROM sqlite_master
    WHERE type = 'table'
      AND name = ?
  ) AS exists`;

  const result = await db.getFirstAsync<{ exists: 0 | 1 }>(sql, [table]);

  return result?.exists;
};

/**
 * 테이블 DROP
 * !NOTICE: 서버리스 API를 통해 스키마를 관리하는 테이블에만 사용한다
 * @param table 테이블 이름
 */
export const dropTable = async (table: TDataTable) => {
  const db = await getDatabase();

  await db.execAsync(`DROP TABLE IF EXISTS ${table}`);
};

/**
 * 테이블 CREATE
 * !NOTICE: 서버리스 API를 통해 스키마를 관리하는 테이블에만 사용한다
 * @param table 테이블 이름
 * @param columnData 스키마 컬럼 데이터
 */
export const createTable = async (
  table: TDataTable,
  columnData: ITableColumnSchema[],
) => {
  const db = await getDatabase();

  const columnDefs = getColumnPlaceholderForTableCreate(columnData);

  const sql = `CREATE TABLE IF NOT EXISTS ${table} (${columnDefs.join(',\n')})`;

  await db.execAsync(sql);
};

/**
 * 테이블에 데이터 INSERT
 * !NOTICE: 서버리스 API를 통해 스키마를 관리하는 테이블에만 사용한다
 * @param table 테이블 이름
 * @param data 삽입할 데이터
 */
export const insertData = async (
  table: TDataTable,
  data: Partial<TResourceDataSchemas>[],
) => {
  if (data.length === 0) {
    return;
  }

  const db = await getDatabase();

  const INSERT_BATCH_SIZE = 50;

  for (let i = 0; i < data.length; i += INSERT_BATCH_SIZE) {
    const batch = data.slice(i, i + INSERT_BATCH_SIZE);

    await db.withTransactionAsync(async () => {
      for (const row of batch) {
        const entries = Object.entries(row).filter(([, v]) => v !== undefined);

        if (!entries.length) {
          continue;
        }

        const columns = entries.map(([key]) => `"${key}"`);
        const values = entries.map(([, v]) => v);

        const sql = `INSERT INTO ${table} (${columns.join(', ')}) 
                     VALUES (${columns.map(() => '?').join(', ')})`;

        await db.runAsync(sql, values);
      }
    });
  }
};
