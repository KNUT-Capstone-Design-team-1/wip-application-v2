import logger from '@utils/logger';
import { getDatabase } from '../sqlite';
import { ITableColumnSchema, TDataTable, TResourceDataSchemas } from '../types';
import {
  getColumnPlaceholderForTableCreate,
  prepareRowForInsert,
} from '../util';

const INSERT_BATCH_SIZE = 500;

// 테이블 유무 확인
// !NOTICE: 서버리스 API를 통해 스키마를 관리하는 테이블에만 사용한다
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

// 테이블 DROP
// !NOTICE: 서버리스 API를 통해 스키마를 관리하는 테이블에만 사용한다
export const dropTable = async (table: TDataTable) => {
  const db = await getDatabase();

  await db.execAsync(`DROP TABLE IF EXISTS ${table}`);
};

// 테이블 CREATE
// !NOTICE: 서버리스 API를 통해 스키마를 관리하는 테이블에만 사용한다
export const createTable = async (
  table: TDataTable,
  columnData: ITableColumnSchema[],
) => {
  const db = await getDatabase();

  const columnDefs = getColumnPlaceholderForTableCreate(columnData);

  const sql = `CREATE TABLE IF NOT EXISTS ${table} (${columnDefs.join(',\n')})`;

  await db.execAsync(sql);
};

// batch 데이터에서 INSERT 대상 column 목록을 추출한다.
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

// row 데이터를 SQL parameter 배열로 변환한다.
const createInsertValues = (
  row: Partial<TResourceDataSchemas>,
  columns: string[],
) => {
  const preparedRow = prepareRowForInsert(row);

  return columns.map((column) => preparedRow[column] ?? null);
};

// Multi-row INSERT SQL 문을 생성한다.
const createMultiRowInsertSql = (
  table: TDataTable,
  columns: string[],
  rowCount: number,
): string => {
  const escapedColumns = columns.map((column) => `"${column}"`);
  const singleRowPlaceholder = `(${columns.map(() => '?').join(', ')})`;
  const allRowPlaceholders = Array.from(
    { length: rowCount },
    () => singleRowPlaceholder,
  ).join(', ');

  return `INSERT OR REPLACE INTO ${table} (${escapedColumns.join(', ')}) 
          VALUES ${allRowPlaceholders}`;
};

// SQLite 파라미터 한도(999개)를 고려한 최적의 벌크 청크 크기 계산 (최대 50행)
const BULK_CHUNK_ROW_SIZE = 50;

// 대량 데이터를 multi-row bulk 단위 및 단일 트랜잭션으로 초고속 INSERT 한다.
export const insertData = async (
  table: TDataTable,
  data: Partial<TResourceDataSchemas>[],
) => {
  const hasNoData: boolean = data.length === 0;
  if (hasNoData) {
    return;
  }

  const columns = getBatchColumns(data);
  const hasNoColumns: boolean = columns.length === 0;
  if (hasNoColumns) {
    return;
  }

  // SQLite 최대 변수 한도(999개) 내에서 안전한 청크 크기 결정
  const maxRowsPerChunk = Math.max(
    1,
    Math.min(BULK_CHUNK_ROW_SIZE, Math.floor(900 / columns.length)),
  );

  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    for (let i = 0; i < data.length; i += maxRowsPerChunk) {
      const chunk = data.slice(i, i + maxRowsPerChunk);
      const sql = createMultiRowInsertSql(table, columns, chunk.length);

      const chunkParams: any[] = [];
      for (const row of chunk) {
        chunkParams.push(...createInsertValues(row, columns));
      }

      await db.runAsync(sql, chunkParams);
    }
  });
};

// 특정 테이블의 전체 행 개수(Row Count)를 조회한다.
export const getTableRowCount = async (table: TDataTable): Promise<number> => {
  const db = await getDatabase();
  const sql = `SELECT COUNT(*) as count FROM ${table}`;
  const result = await db.getAllAsync<{ count: number }>(sql);
  return result?.[0]?.count || 0;
};
