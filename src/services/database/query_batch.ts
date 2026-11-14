import type { SQLiteDatabase } from 'expo-sqlite';

// 구형 SQLite 빌드의 999개 바인딩 한도에도 여유를 둔다.
export const SQLITE_BIND_BATCH_SIZE = 900;

export const splitQueryValues = <T>(
  values: T[],
  reservedBindings = 0,
): T[][] => {
  const size = SQLITE_BIND_BATCH_SIZE - reservedBindings;
  if (size <= 0) throw new Error('Too many reserved SQLite bindings');
  const chunks: T[][] = [];
  for (let start = 0; start < values.length; start += size) {
    chunks.push(values.slice(start, start + size));
  }
  return chunks;
};

export const queryRowsInBatches = async <T>(
  db: SQLiteDatabase,
  values: (string | number)[],
  buildQuery: (placeholders: string) => string,
): Promise<T[]> => {
  const rows: T[] = [];
  for (const chunk of splitQueryValues([...new Set(values)])) {
    rows.push(
      ...(await db.getAllAsync<T>(
        buildQuery(chunk.map(() => '?').join(',')),
        chunk,
      )),
    );
  }
  return rows;
};
