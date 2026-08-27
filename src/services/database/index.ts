import { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase } from './sqlite';
import { IConfig } from './types';
import logger from '@utils/logger';

import { migrateAsyncStorageToSQLite } from './migrations/migration_saved_pills';

/**
 * 기본 config
 */
const DEFAULT_CONFIG: IConfig[] = [
  { key: 'pillDataSchemaVersion', value: 0 },
  { key: 'pillDataDataVersion', value: 0 },
  { key: 'markImagesSchemaVersion', value: 0 },
  { key: 'markImagesDataVersion', value: 0 },
  { key: 'nearbyPharmaciesSchemaVersion', value: 0 },
  { key: 'nearbyPharmaciesDataVersion', value: 0 },
  { key: 'cannabisSchemaVersion', value: 0 },
  { key: 'cannabisDataVersion', value: 0 },
  { key: 'narcoticsSchemaVersion', value: 0 },
  { key: 'narcoticsDataVersion', value: 0 },
  { key: 'psychotropicsSchemaVersion', value: 0 },
  { key: 'psychotropicsDataVersion', value: 0 },
  { key: 'prohibitedListSchemaVersion', value: 0 },
  { key: 'prohibitedListDataVersion', value: 0 },
] as const;

/**
 * 환경설정 테이블 초기화
 * @param db 데이터베이스
 */
export const initConfigTable = async (db: SQLiteDatabase) => {
  const createSQL = `
  CREATE TABLE IF NOT EXISTS config (
  \`key\` VARCHAR(255) PRIMARY KEY NOT NULL,
  \`value\` TEXT NULL DEFAULT NULL
  )`;

  await db.execAsync(createSQL);

  const insertSQL = `INSERT OR IGNORE INTO config (\`key\`, \`value\`) VALUES
    ${DEFAULT_CONFIG.map(() => `(?, ?)`).join(', ')}`;

  await db.runAsync(
    insertSQL,
    DEFAULT_CONFIG.flatMap(({ key, value }) => [key, value]),
  );
};

/**
 * 알약 보관함 테이블 초기화
 */
export const initSavedPillTables = async (db: SQLiteDatabase) => {
  // 폴더 테이블 생성
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS saved_pill_folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      is_default INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT (datetime('now', 'localtime'))
    )
  `);

  // 알약-폴더 매핑 테이블 생성 (item_seq, folder_id 중복 방지를 위한 UNIQUE 제약 조건 추가)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS saved_pills (
      idx INTEGER PRIMARY KEY AUTOINCREMENT,
      folder_id INTEGER NOT NULL,
      item_seq TEXT NOT NULL,
      item_name TEXT NOT NULL,
      created_at DATETIME DEFAULT (datetime('now', 'localtime')),
      UNIQUE(folder_id, item_seq),
      FOREIGN KEY (folder_id) REFERENCES saved_pill_folders(id) ON DELETE CASCADE
    )
  `);

  // item_seq로 조회 및 삭제 시 성능 향상을 위한 인덱스 추가
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_saved_pills_item_seq ON saved_pills(item_seq);
  `);

  // 외래키 제약조건 활성화
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // 기본 폴더가 없으면 하나 생성
  const defaultFolder = await db.getFirstAsync(
    `SELECT id FROM saved_pill_folders WHERE is_default = 1 LIMIT 1`,
  );

  if (!defaultFolder) {
    await db.runAsync(
      `INSERT INTO saved_pill_folders (name, is_default) VALUES (?, ?)`,
      ['기본', 1],
    );
  }

  // AsyncStorage 기반의 옛 데이터를 SQLite로 마이그레이션
  await migrateAsyncStorageToSQLite(db);
};

/**
 * 데이터베이스 초기화 (필수 테이블 초기화)
 * - 비필수 테이블들은 서버리스 API를 통해 스키마를 관리
 */
export const initDatabase = async () => {
  try {
    const db = await getDatabase();

    await initConfigTable(db);
    await initSavedPillTables(db);

    return true;
  } catch (e) {
    logger.error(`Failed to initialize database: ${e.stack || e}`);

    return false;
  }
};
