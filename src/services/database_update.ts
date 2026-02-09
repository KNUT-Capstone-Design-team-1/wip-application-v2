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
): Promise<DATABSE_UPDATE_RESULT_CODE> => {
  const currentVersion = await ConfigQuery.getSpecificConfigs(
    TABLE_CONFIG_KEYS_MAP[table],
  );

  if (!currentVersion?.length) {
    return 'REQUIRE-UPDATE';
  }

  const currentSchemaVersion = currentVersion.find((v) =>
    v.key.endsWith('SchemaVersion'),
  )?.value;

  const currentDataVersion = currentVersion.find((v) =>
    v.key.endsWith('DataVersion'),
  )?.value;

  if (!currentSchemaVersion || !currentDataVersion) {
    return 'REQUIRE-UPDATE';
  }

  // API 호출을 최소화하기 위해 싱글턴 패턴으로 처리
  if (!DATABASE_VERSION_ON_SERVER) {
    DATABASE_VERSION_ON_SERVER =
      await GoogleCloud.DatabaseVersionAPI.requestDatabaseVersion();
  }

  const { schemaVersion, dataVersion } = DATABASE_VERSION_ON_SERVER[table];

  const isOldSchema = Number(currentSchemaVersion) < Number(schemaVersion);
  if (isOldSchema) {
    return 'REQUIRE-UPDATE';
  }

  const isOldData = Number(currentDataVersion) < Number(dataVersion);
  if (isOldData) {
    return 'REQUIRE-UPDATE';
  }

  return 'UNNECESSARY-UPDATE';
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
      `[INIT-PILL-DATA-TABLE] Error occurred from drop pill_data table. ${(e as Error).stack || e}`,
    );

    return 'ERROR-DROP-TABLE';
  }

  try {
    await InitTableQuery.createTable(table, schema.columns);
  } catch (e) {
    logger.error(
      `[INIT-PILL-DATA-TABLE] Error occurred from create pill_data table. ${(e as Error).stack || e}`,
    );

    return 'ERROR-CREATE-TABLE';
  }

  return 'OK';
};

/**
 * 테이블에 최신 데이터 반영
 * @param table 테이블 이름
 * @returns
 */
export const insertData = async (
  table: TDataTable,
): Promise<DATABSE_UPDATE_RESULT_CODE> => {
  let currentPage = 1;
  let totalPages = 1;
  let code: DATABSE_UPDATE_RESULT_CODE = 'OK';

  do {
    let response: GoogleCloud.ResourceDataAPI.IResourceDataResponse<TResourceDataSchemas>;

    // 최신 데이터 요청
    try {
      response = await GoogleCloud.ResourceDataAPI.requestResourceData(
        table,
        currentPage,
      );

      if (!response?.resource?.length || !response?.totalPage) {
        code = 'ERROR-NO-RESOURCE-DATA';
        break;
      }
    } catch (e) {
      logger.error(
        `[INSERT-PILL-DATA] Error Occurred from request pill data resource. ${(e as Error).stack || e}`,
      );
      code = 'ERROR-GET-RESOURCE';
      break;
    }

    const { totalPage, resource } = response;

    // 테이블에 INSERT
    try {
      await InitTableQuery.insertData(table, resource);
    } catch (e) {
      logger.error(
        `[INSERT-PILL-DATA] Error Occurred from insert pill data resource. ${(e as Error).stack || e}`,
      );
      code = 'ERROR-INSERT-TABLE';
      break;
    }

    totalPages = totalPage;
    currentPage++;
  } while (currentPage <= totalPages);

  return code;
};
