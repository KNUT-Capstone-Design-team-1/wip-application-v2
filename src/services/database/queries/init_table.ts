import type {
  SQLiteDatabase,
  SQLiteStatement,
  SQLiteBindValue,
} from 'expo-sqlite';
import { runDatabaseTransaction } from '@services/database/transaction';
import { initPillSearchIndexes } from './pill_search_indexes';
import { initResourceQueryIndexes } from './resource_query_indexes';
import { invalidateClassificationCatalog } from './classification_catalog';
import { getDatabase } from '../sqlite';
import { ITableColumnSchema, TDataTable, TResourceDataSchemas } from '../types';
import {
  getColumnPlaceholderForTableCreate,
  prepareRowForInsert,
} from '../util';

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
  invalidateClassificationCatalog(table);
};

// 테이블 CREATE
// !NOTICE: 서버리스 API를 통해 스키마를 관리하는 테이블에만 사용한다
export const createTable = async (
  table: TDataTable,
  columnData: ITableColumnSchema[],
  { deferIndexes = false }: { deferIndexes?: boolean } = {},
) => {
  const db = await getDatabase();

  const columnDefs = getColumnPlaceholderForTableCreate(columnData);

  const sql = `CREATE TABLE IF NOT EXISTS ${table} (${columnDefs.join(',\n')})`;

  await db.execAsync(sql);
  if (!deferIndexes) await initTableIndexes(table);
};

// 전체 교체 시에는 데이터 삽입 후 검색 인덱스를 한 번에 생성한다.
export const initTableIndexes = async (table: TDataTable) => {
  const db = await getDatabase();
  await initResourceQueryIndexes(db, table);
  if (table === 'pill_data') {
    await initPillSearchIndexes(db);
  }
};

// batch 데이터에서 INSERT 대상 column 목록을 추출한다.
const getBatchColumns = (batch: Partial<TResourceDataSchemas>[]): string[] => {
  const columnSet = new Set<string>();

  for (const row of batch) {
    Object.entries(row).forEach(([key, value]) => {
      const hasValue = value !== undefined;

      if (hasValue) {
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

// 파라미터 한도를 알 수 없는 빌드에서는 기존의 안전한 900개 제한을 사용한다.
const BULK_CHUNK_ROW_SIZE = 200;
const variableLimits = new WeakMap<SQLiteDatabase, Promise<number>>();
const jsonSupport = new WeakMap<SQLiteDatabase, Promise<boolean>>();
const supportsJsonInsert = (db: SQLiteDatabase): Promise<boolean> => {
  let supported = jsonSupport.get(db);
  if (!supported) {
    supported = db
      .getFirstAsync<{ valid: number }>("SELECT json_valid('[]') AS valid")
      .then((result) => result?.valid === 1)
      .catch(() => false);
    jsonSupport.set(db, supported);
  }
  return supported;
};

// JSON을 한 번만 바인딩하고 SQLite 내부에서 행을 펼친다.
// 이미지 BLOB은 기존 디코딩/바인딩 경로를 사용한다.
const insertJsonData = async (
  db: SQLiteDatabase,
  table: TDataTable,
  columns: string[],
  data: Partial<TResourceDataSchemas>[],
): Promise<void> => {
  const names = columns.map((column) => `"${column.replace(/"/g, '""')}"`);
  const values = columns.map((column) => {
    const path = `$.${JSON.stringify(column)}`.replace(/'/g, "''");
    return `json_extract(value, '${path}')`;
  });
  await runDatabaseTransaction(db, async () => {
    const statement = await db.prepareAsync(
      `INSERT OR REPLACE INTO ${table} (${names.join(', ')}) SELECT ${values.join(', ')} FROM json_each(?)`,
    );
    try {
      for (let i = 0; i < data.length; i += BULK_CHUNK_ROW_SIZE) {
        await statement.executeAsync([
          JSON.stringify(data.slice(i, i + BULK_CHUNK_ROW_SIZE)),
        ]);
      }
    } finally {
      await statement.finalizeAsync();
    }
  });
};

const getVariableLimit = (db: SQLiteDatabase): Promise<number> => {
  let limit = variableLimits.get(db);
  if (!limit) {
    limit = db
      .getAllAsync<{ compile_options: string }>('PRAGMA compile_options')
      .then((options) => {
        const option = options.find((row) =>
          row.compile_options.startsWith('MAX_VARIABLE_NUMBER='),
        );
        const compiledLimit = Number(option?.compile_options.split('=')[1]);
        return compiledLimit > 0 ? Math.min(compiledLimit, 8000) : 900;
      })
      .catch(() => 900);
    variableLimits.set(db, limit);
  }
  return limit;
};

// 페이지 단위 트랜잭션에서 같은 크기의 INSERT 문을 재사용한다.
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

  // 기기의 빌드 한도를 확인하고, 브리지에 한 번에 넘기는 데이터도 제한한다.
  const db = await getDatabase();
  if (!columns.includes('base64') && (await supportsJsonInsert(db))) {
    try {
      await insertJsonData(db, table, columns, data);
    } finally {
      invalidateClassificationCatalog(table);
    }
    return;
  }
  const variableLimit = await getVariableLimit(db);
  const maxRowsPerChunk = Math.max(
    1,
    Math.min(BULK_CHUNK_ROW_SIZE, Math.floor(variableLimit / columns.length)),
  );

  try {
    await runDatabaseTransaction(db, async () => {
      const statements = new Map<number, SQLiteStatement>();
      try {
        for (let i = 0; i < data.length; i += maxRowsPerChunk) {
          const rowCount = Math.min(maxRowsPerChunk, data.length - i);
          let statement = statements.get(rowCount);
          if (!statement) {
            statement = await db.prepareAsync(
              createMultiRowInsertSql(table, columns, rowCount),
            );
            statements.set(rowCount, statement);
          }

          const chunkParams: SQLiteBindValue[] = [];
          for (let j = i; j < i + rowCount; j++) {
            chunkParams.push(...createInsertValues(data[j], columns));
          }
          await statement.executeAsync(chunkParams);
        }
      } finally {
        for (const statement of statements.values()) {
          await statement.finalizeAsync();
        }
      }
    });
  } finally {
    invalidateClassificationCatalog(table);
  }
};

// 특정 테이블의 전체 행 개수(Row Count)를 조회한다.
export const getTableRowCount = async (table: TDataTable): Promise<number> => {
  const db = await getDatabase();
  const sql = `SELECT COUNT(*) as count FROM ${table}`;
  const result = await db.getAllAsync<{ count: number }>(sql);

  return result?.[0]?.count || 0;
};
