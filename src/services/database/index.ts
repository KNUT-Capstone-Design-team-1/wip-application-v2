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
      sort_order INTEGER NOT NULL DEFAULT 0,
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
 * 알약 복용 알림 테이블 초기화
 */
export const initPillReminderTables = async (db: SQLiteDatabase) => {
  // 복용 알림 일정 테이블 (folder_id, title, memo 포함 및 폴더 삭제 시 CASCADE)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS pill_reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      folder_id INTEGER NOT NULL DEFAULT 1,
      title TEXT NOT NULL DEFAULT '',
      memo TEXT NOT NULL DEFAULT '',
      time TEXT NOT NULL,
      days TEXT NOT NULL,
      is_enabled INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT (datetime('now', 'localtime')),
      updated_at DATETIME DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (folder_id) REFERENCES saved_pill_folders(id) ON DELETE CASCADE
    )
  `);

  // 복용 알림에 포함된 알약 매핑 테이블
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS pill_reminder_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reminder_id INTEGER NOT NULL,
      item_seq TEXT NOT NULL,
      item_name TEXT NOT NULL,
      dosage INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT (datetime('now', 'localtime')),
      UNIQUE(reminder_id, item_seq),
      FOREIGN KEY (reminder_id) REFERENCES pill_reminders(id) ON DELETE CASCADE
    )
  `);

  // 인덱스 생성
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_pill_reminders_folder_id ON pill_reminders(folder_id);
  `);
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_pill_reminder_items_item_seq ON pill_reminder_items(item_seq);
  `);
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_pill_reminder_items_reminder_id ON pill_reminder_items(reminder_id);
  `);

  // 보관함에서 알약(saved_pills) 삭제 시 해당 폴더의 복용 알림 항목도 CASCADE 삭제 및 빈 알림 정리 트리거
  await db.execAsync(`
    CREATE TRIGGER IF NOT EXISTS trigger_delete_saved_pill_cascade_reminder
    AFTER DELETE ON saved_pills
    BEGIN
      DELETE FROM pill_reminder_items 
      WHERE item_seq = OLD.item_seq 
        AND reminder_id IN (SELECT id FROM pill_reminders WHERE folder_id = OLD.folder_id);

      DELETE FROM pill_reminders 
      WHERE folder_id = OLD.folder_id 
        AND id NOT IN (SELECT DISTINCT reminder_id FROM pill_reminder_items);
    END;
  `);
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
    await initPillReminderTables(db);

    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error(`Database initialization failed: ${error}`);
    throw error;
  }
};
