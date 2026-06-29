import { getDatabase } from '../sqlite';
import { IConfig, TConfigKey } from '../types';

/**
 * 모든 환경설정 조회
 * @returns
 */
export const getAllConfig = async () => {
  const db = await getDatabase();

  const result = await db.getAllAsync<IConfig>(`SELECT * FROM config`);

  return result;
};

/**
 * 특정 환경설정을 조회
 * @param key 환경설정 키
 * @returns
 */
export const getSpecificConfig = async (key: string) => {
  const db = await getDatabase();

  const result = await db.getFirstAsync<IConfig>(
    `SELECT * FROM config WHERE \`key\` = ?`,
    [key],
  );

  return result;
};

/**
 * 특정한 여러 개의 환경설정을 조회
 * @param keys 환경설정 키 목록
 * @returns
 */
export const getSpecificConfigs = async (keys: TConfigKey[]) => {
  const db = await getDatabase();

  const result = await db.getAllAsync<IConfig>(
    `SELECT * FROM config WHERE \`key\` IN (${keys.map(() => '?').join(', ')})`,
    keys,
  );

  return result;
};

/**
 * 특정 환경 설정 업데이트
 * @param key 환경설정 키
 * @param value 값
 * @returns
 */
export const updateSpecificConfig = async (
  key: string,
  value: string | number,
) => {
  const db = await getDatabase();

  const result = await db.runAsync(
    `UPDATE config SET \`value\` = ? WHERE \`key\` = ?`,
    [value, key],
  );

  return result;
};

/**
 * 여러 환경설정을 업데이트
 * @param updateDatas 업데이트 데이터
 * @returns
 */
export const updateConfigs = async (updateDatas: IConfig[]) => {
  const db = await getDatabase();

  const configKeys = updateDatas.map((v) => v.key);
  const configValues = updateDatas.map((v) => v.value);

  const result = await db.runAsync(
    `UPDATE config SET \`value\` = CASE \`key\`
     ${configKeys.map((key) => `WHEN '${key}' THEN ?`).join(' ')}
     END
     WHERE \`key\` IN (${configKeys.map(() => '?').join(', ')})
    `,
    [...configValues, ...configKeys],
  );

  return result;
};
