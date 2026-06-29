import { ConfigQuery, InitTableQuery } from './database/queries';
import { GoogleCloud } from './apis';
import {
  DATABSE_UPDATE_RESULT_CODE,
  TConfigKey,
  TDataTable,
  TResourceDataSchemas,
} from './database/types';
import { IDatabaseVersionResponse } from './apis/google_cloud/wip_database_version';
import { logger } from '../utils';

/**
 * 테이블 별 config 속성 맵
 */
const TABLE_CONFIG_KEYS_MAP: Record<TDataTable, TConfigKey[]> = {
  pill_data: ['pillDataSchemaVersion', 'pillDataDataVersion'],
  mark_images: ['markImagesSchemaVersion', 'markImagesDataVersion'],
  nearby_pharmacies: [
    'nearbyPharmaciesSchemaVersion',
    'nearbyPharmaciesDataVersion',
  ],
  cannabis: ['cannabisSchemaVersion', 'cannabisDataVersion'],
  narcotics: ['narcoticsSchemaVersion', 'narcoticsDataVersion'],
  psychotropics: ['psychotropicsSchemaVersion', 'psychotropicsDataVersion'],
  prohibited_list: ['prohibitedListSchemaVersion', 'prohibitedListDataVersion'],
} as const;

/**
 * 서버 상에 있는 데이터 베이스 버전
 */
let DATABASE_VERSION_ON_SERVER: IDatabaseVersionResponse =
  undefined as unknown as IDatabaseVersionResponse;

/**
 * 테이블 업데이트가 필요한지 확인
 * @param table 테이블 이름
 * @returns
 */
export const checkRequireTableUpdate = async (
  table: TDataTable,
): Promise<{
  code: DATABSE_UPDATE_RESULT_CODE;
  newSchemaVersion: number;
  newDataVersion: number;
}> => {
  // API 호출을 최소화하기 위해 싱글턴 패턴으로 처리
  if (!DATABASE_VERSION_ON_SERVER) {
    DATABASE_VERSION_ON_SERVER =
      await GoogleCloud.DatabaseVersionAPI.requestDatabaseVersion();
  }

  const { schemaVersion: newSchemaVersion, dataVersion: newDataVersion } =
    DATABASE_VERSION_ON_SERVER[table];

  const currentVersion = await ConfigQuery.getSpecificConfigs(
    TABLE_CONFIG_KEYS_MAP[table],
  );

  if (!currentVersion?.length) {
    return { code: 'REQUIRE-UPDATE', newSchemaVersion, newDataVersion };
  }

  const currentSchemaVersion = currentVersion.find((v) =>
    v.key.endsWith('SchemaVersion'),
  )?.value;

  const currentDataVersion = currentVersion.find((v) =>
    v.key.endsWith('DataVersion'),
  )?.value;

  if (currentSchemaVersion == null || currentDataVersion == null) {
    return { code: 'REQUIRE-UPDATE', newSchemaVersion, newDataVersion };
  }

  const isOldSchema = Number(currentSchemaVersion) < Number(newSchemaVersion);
  if (isOldSchema) {
    return { code: 'REQUIRE-UPDATE', newSchemaVersion, newDataVersion };
  }

  const isOldData = Number(currentDataVersion) < Number(newDataVersion);
  if (isOldData) {
    return { code: 'REQUIRE-UPDATE', newSchemaVersion, newDataVersion };
  }

  return { code: 'UNNECESSARY-UPDATE', newSchemaVersion, newDataVersion };
};

/**
 * 테이블 초기화
 * @param table 테이블 이름
 * @returns
 */
export const initTable = async (
  table: TDataTable,
): Promise<DATABSE_UPDATE_RESULT_CODE> => {
  const schema = await GoogleCloud.TableSchemaAPI.requestTableSchema(table);

  if (!schema.columns?.length) {
    return 'INVALID-SCHEMA';
  }

  try {
    await InitTableQuery.dropTable(table);
  } catch (e) {
    logger.error(
      `[INIT-PILL-DATA-TABLE] Error occurred from drop ${table} table. ${(e as Error).stack || e}`,
    );

    return 'ERROR-DROP-TABLE';
  }

  try {
    await InitTableQuery.createTable(table, schema.columns);
  } catch (e) {
    logger.error(
      `[INIT-PILL-DATA-TABLE] Error occurred from create ${table} table. ${(e as Error).stack || e}`,
    );

    return 'ERROR-CREATE-TABLE';
  }

  return 'OK';
};

/**
 * 테이블에 최신 데이터 반영
 * @param currentPage 최근 페이지
 * @param table 테이블 이름
 * @returns
 */
export const insertData = async (
  currentPage: number,
  table: TDataTable,
): Promise<{
  code: DATABSE_UPDATE_RESULT_CODE;
  totalPage: number;
  total: number;
}> => {
  let response: GoogleCloud.ResourceDataAPI.IResourceDataResponse<TResourceDataSchemas>;

  try {
    response = await GoogleCloud.ResourceDataAPI.requestResourceData(
      table,
      currentPage,
    );

    if (!response?.resource?.length || !response?.totalPage) {
      return { code: 'ERROR-NO-RESOURCE-DATA', totalPage: 0, total: 0 };
    }
  } catch (e) {
    logger.error(
      `[INSERT-DATA] Error Occurred from request ${table} table resource. ${(e as Error).stack || e}`,
    );

    return { code: 'ERROR-GET-RESOURCE', totalPage: 0, total: 0 };
  }

  const { totalPage, total, resource } = response;

  try {
    await InitTableQuery.insertData(table, resource);
  } catch (e) {
    logger.error(
      `[INSERT-DATA] Error Occurred from insert ${table} table resource. ${(e as Error).stack || e}`,
    );

    return { code: 'ERROR-INSERT-TABLE', totalPage, total };
  }

  return { code: 'OK', totalPage, total };
};

/**
 * 특정 테이블의 전체 행 개수(Row Count)를 조회한다.
 * @param table 데이터 테이블
 */
export const getTableRowCount = async (table: TDataTable): Promise<number> => {
  return await InitTableQuery.getTableRowCount(table);
};

/**
 * 다음 업데이트가 진행되지 않게 데이터베이스 버전 업데이트
 * @param table 테이블 이름
 * @param newSchemaVersion 최신 스키마 버전
 * @param newDataVersion 최신 데이터 버전
 */
export const updateDatabaseVersion = async (
  table: TDataTable,
  newSchemaVersion: number,
  newDataVersion: number,
): Promise<DATABSE_UPDATE_RESULT_CODE> => {
  try {
    const configKeys = TABLE_CONFIG_KEYS_MAP[table];

    const schemaVersionConfigKey = configKeys.find((key) =>
      key.endsWith('SchemaVersion'),
    );

    const dataVersionConfigKey = configKeys.find((key) =>
      key.endsWith('DataVersion'),
    );

    await ConfigQuery.updateConfigs([
      { key: schemaVersionConfigKey as TConfigKey, value: newSchemaVersion },
      { key: dataVersionConfigKey as TConfigKey, value: newDataVersion },
    ]);

    return 'OK';
  } catch (e) {
    logger.error(
      `Error occurred from update database version. table: ${table}. newSchemaVersion: ${newSchemaVersion}, newDataVersion: ${newDataVersion}. ${(e as Error).stack || e}`,
    );

    return 'ERROR-UPDATE-DATABASE-VERSION';
  }
};
