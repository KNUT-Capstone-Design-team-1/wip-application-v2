import * as SQLite from 'expo-sqlite';

let database: Promise<SQLite.SQLiteDatabase> | null = null;

// 병렬 조회도 같은 연결 준비를 기다린다. 열기에 실패한 경우 다음 호출에서 재시도한다.
export const getDatabase = (): Promise<SQLite.SQLiteDatabase> => {
  database ??= SQLite.openDatabaseAsync('app.db').catch((error) => {
    database = null;
    throw error;
  });
  return database;
};
