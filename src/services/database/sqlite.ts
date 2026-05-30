import * as SQLite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

const DATABASE_KEY_NAME = 'wip_database_encryption_key';

/**
 * 데이터베이스 암호화 키 반환 (랜덤 키 생성)
 * - 앱 삭제 시 복호화 불가
 * @returns
 */
const getDatabaseKey = async () => {
  let key = await SecureStore.getItemAsync(DATABASE_KEY_NAME);

  if (!key) {
    const bytes = Crypto.getRandomValues(new Uint8Array(32));

    key = Array.from(bytes)
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('');

    await SecureStore.setItemAsync(DATABASE_KEY_NAME, key);
  }

  return key;
};

/**
 * 데이터 베이스 반환
 * @returns
 */
export const getDatabase = async () => {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('app.db');

      const key = await getDatabaseKey();

      await db.execAsync(`
        PRAGMA key = '${key}';
        PRAGMA foreign_keys = ON;
      `);

      return db;
    })();
  }

  return dbPromise;
};
