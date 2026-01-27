import { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase } from './sqlite';
import { IConfig } from './types';

const CREATE_CONFIG_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS config (
  \`key\` VARCHAR(255) PRIMARY KEY NOT NULL,
  \`value\` TEXT NULL DEFAULT NULL
)`;

const DEFAULT_CONFIG: IConfig[] = [
  { key: 'pillDataSchemaVersion', value: 0 },
  { key: 'pillDataResourceVersion', value: 0 },
];

/**
 * 환경설정 테이블 초기화
 * @param db 데이터베이스
 */
const initConfigTable = async (db: SQLiteDatabase) => {
  await db.execAsync(CREATE_CONFIG_TABLE_SQL);

  const sql = `INSERT INTO config (\`key\`, \`value\`) VALUES
    ${DEFAULT_CONFIG.map(() => `(?, ?)`).join(', ')}`;

  await db.runAsync(
    sql,
    DEFAULT_CONFIG.flatMap(({ key, value }) => [key, value]),
  );
};

/**
 * 데이터베이스 초기화
 */
export const initDatabase = async () => {
  const db = await getDatabase();

  await initConfigTable(db);
};
