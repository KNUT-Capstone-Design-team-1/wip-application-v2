import { getDatabase } from '../sqlite';
import { ITableColumnSchema, TDataTable, TResourceDataSchemas } from '../types';
import {
  getColumnPlaceholderForTableCreate,
  prepareRowForInsert,
} from '../util';

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

  const insertBatchSize = 50;

  for (let i = 0; i < data.length; i += insertBatchSize) {
    const batch = data.slice(i, i + insertBatchSize);

    // Identify columns from the first row of the batch to create a prepared statement
    const firstRow = prepareRowForInsert(batch[0]);
    const entries = Object.entries(firstRow).filter(([, v]) => v !== undefined);

    if (!entries.length) {
      continue;
    }

    const columns = entries.map(([key]) => `"${key}"`);
    const sql = `INSERT INTO ${table} (${columns.join(', ')}) 
                 VALUES (${columns.map(() => '?').join(', ')})`;

    await db.withTransactionAsync(async () => {
      const statement = await db.prepareAsync(sql);
      try {
        for (const row of batch) {
          const preparedRow = prepareRowForInsert(row);
          const values = entries.map(([key]) => preparedRow[key]);

          await statement.executeAsync(values);
        }
      } finally {
        await statement.finalizeAsync();
      }
    });
  }
};
