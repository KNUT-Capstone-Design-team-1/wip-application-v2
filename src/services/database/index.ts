import { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase } from './sqlite';
import { IConfig } from './types';

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
 * 데이터베이스 초기화 (필수 테이블 초기화)
 * - config 테이블만 초기화한다
 * - 그 외 테이블들은 서버리스 API를 통해 스키마를 관리한다
 */
export const initDatabase = async () => {
  const db = await getDatabase();

  await initConfigTable(db);

  return true;
};
