import { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase } from './sqlite';

const CREATE_CONFIG_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS config (
  key VARCHAR(255) PRIMARY KEY NOT NULL,
  value TEXT NULL DEFAULT NULL
);
`;

/**
 * 환경설정 테이블 초기화
 * @param db 데이터베이스
 */
async function initConfigTable(db: SQLiteDatabase) {
  await db.execAsync(CREATE_CONFIG_TABLE_SQL);

  await db.execAsync(`
    INSERT OR IGNORE INTO config (key, value) VALUES
      ('theme', 'light'),
      ('language', 'ko'),
      ('first_launch', 'true');
  `);
}

/**
 * 데이터베이스 초기화
 */
export async function initDatabase() {
  const db = await getDatabase();

  await initConfigTable(db);
}
