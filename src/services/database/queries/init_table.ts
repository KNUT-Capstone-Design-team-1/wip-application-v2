import logger from '@utils/logger';
import { getDatabase } from '../sqlite';
import { ITableColumnSchema, TDataTable, TResourceDataSchemas } from '../types';
import {
  getColumnPlaceholderForTableCreate,
  prepareRowForInsert,
} from '../util';

const INSERT_BATCH_SIZE = 50;

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
 * batch 데이터에서 INSERT 대상 column 목록을 추출한다.
 *
 * @param batch INSERT 대상 batch 데이터
 */
const getBatchColumns = (batch: Partial<TResourceDataSchemas>[]): string[] => {
  const columnSet = new Set<string>();

  for (const row of batch) {
    const preparedRow = prepareRowForInsert(row);

    Object.entries(preparedRow).forEach(([key, value]) => {
      if (value !== undefined) {
        columnSet.add(key);
      }
    });
  }

  return [...columnSet];
};

/**
 * INSERT SQL 문을 생성한다.
 * @param table INSERT 대상 테이블
 * @param columns INSERT 대상 column 목록
 */
const createInsertSql = (table: TDataTable, columns: string[]): string => {
  const escapedColumns = columns.map((column) => `"${column}"`);

  return `INSERT INTO ${table} (${escapedColumns.join(', ')}) 
          VALUES (${columns.map(() => '?').join(', ')})`;
};

/**
 * row 데이터를 SQL parameter 배열로 변환한다.
 * @param row INSERT 대상 row 데이터
 * @param columns INSERT 대상 column 목록
 */
const createInsertValues = (
  row: Partial<TResourceDataSchemas>,
  columns: string[],
) => {
  const preparedRow = prepareRowForInsert(row);

  return columns.map((column) => preparedRow[column] ?? null);
};

/**
 * prepared statement 를 안전하게 종료한다.
 * @param statement finalize 대상 statement
 */
const finalizeStatement = async (
  statement: Awaited<ReturnType<typeof getDatabase>>['prepareAsync'] extends (
    ...args: never[]
  ) => Promise<infer T>
    ? T | null
    : never,
) => {
  if (!statement) {
    return;
  }

  try {
    await statement.finalizeAsync();
  } catch (e) {
    logger.warn(`Failed to finalize statement. ${e.stack || e}`);
  }
};

/**
 * batch 데이터를 transaction 내부에서 INSERT 한다.
 * @param db SQLite database instance
 * @param sql INSERT SQL
 * @param columns INSERT 대상 column 목록
 * @param batch INSERT 대상 batch 데이터
 */
const executeBatchInsert = async (
  db: Awaited<ReturnType<typeof getDatabase>>,
  sql: string,
  columns: string[],
  batch: Partial<TResourceDataSchemas>[],
) => {
  let statement: Awaited<ReturnType<typeof db.prepareAsync>> | null = null;

  try {
    statement = await db.prepareAsync(sql);

    await db.withTransactionAsync(async () => {
      for (const row of batch) {
        const values = createInsertValues(row, columns);

        await statement!.executeAsync(values);
      }
    });
  } finally {
    await finalizeStatement(statement);
  }
};

/**
 * 대량 데이터를 batch 단위로 나누어 INSERT 한다.
 * @param table INSERT 대상 테이블
 * @param data INSERT 대상 데이터 목록
 */
export const insertData = async (
  table: TDataTable,
  data: Partial<TResourceDataSchemas>[],
) => {
  if (data.length === 0) {
    return;
  }

  const db = await getDatabase();

  for (let i = 0; i < data.length; i += INSERT_BATCH_SIZE) {
    const batch = data.slice(i, i + INSERT_BATCH_SIZE);

    const columns = getBatchColumns(batch);

    if (columns.length === 0) {
      continue;
    }

    const sql = createInsertSql(table, columns);

    await executeBatchInsert(db, sql, columns, batch);
  }
};
