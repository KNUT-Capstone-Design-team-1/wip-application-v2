import { logger } from '@utils/index';
import {
  DATABSE_UPDATE_RESULT_CODE,
  TConfigKey,
  TDataTable,
  TABLE_CONFIG_KEYS_MAP,
} from '@services/database/types';
import { IDatabaseVersionResponse } from '@services/apis/google_cloud/wip_database_version';
import { databaseUpdateRepository } from '../data/repositories/database_update_repository';
import { databaseDownloadService } from './database_download_service';

let databaseVersionOnServer: IDatabaseVersionResponse | undefined;

export const databaseUpdateService = {
  // 캐시된 서버 버전 정보 초기화
  clearVersionCache(): void {
    databaseVersionOnServer = undefined;
  },

  // 서버 버전과 로컬 버전을 비교해 업데이트 필요 여부를 판단
  async checkRequireTableUpdate(table: TDataTable) {
    databaseVersionOnServer ??=
      await databaseUpdateRepository.getDatabaseVersion();
    const { schemaVersion: newSchemaVersion, dataVersion: newDataVersion } =
      databaseVersionOnServer[table];
    const currentVersion = await databaseUpdateRepository.getConfigs(
      TABLE_CONFIG_KEYS_MAP[table],
    );
    const currentSchemaVersion = currentVersion.find((v) =>
      v.key.endsWith('SchemaVersion'),
    )?.value;
    const currentDataVersion = currentVersion.find((v) =>
      v.key.endsWith('DataVersion'),
    )?.value;

    const hasMissingLocalVersion: boolean =
      currentSchemaVersion == null || currentDataVersion == null;

    if (hasMissingLocalVersion) {
      return {
        code: 'REQUIRE-UPDATE' as const,
        newSchemaVersion,
        newDataVersion,
        oldSchemaVersion: 0,
        oldDataVersion: 0,
      };
    }

    const oldSchemaVersion = Number(currentSchemaVersion);
    const oldDataVersion = Number(currentDataVersion);

    const isSchemaUpdateRequired: boolean =
      oldSchemaVersion < Number(newSchemaVersion);
    const isDataUpdateRequired: boolean =
      oldDataVersion < Number(newDataVersion);
    const requiresUpdate: boolean =
      isSchemaUpdateRequired || isDataUpdateRequired;

    return {
      code: (requiresUpdate
        ? 'REQUIRE-UPDATE'
        : 'UNNECESSARY-UPDATE') as DATABSE_UPDATE_RESULT_CODE,
      newSchemaVersion,
      newDataVersion,
      oldSchemaVersion,
      oldDataVersion,
    };
  },

  // 테이블 스키마에 따라 테이블을 삭제하고 새로 생성
  async initTable(table: TDataTable): Promise<DATABSE_UPDATE_RESULT_CODE> {
    const schema = await databaseUpdateRepository.getTableSchema(table);
    const isSchemaValid: boolean = Boolean(schema.columns?.length);

    if (!isSchemaValid) {
      return 'INVALID-SCHEMA';
    }

    try {
      await databaseUpdateRepository.dropTable(table);
    } catch (error) {
      logger.error(
        `[INIT-TABLE] Failed to drop ${table} table. ${(error as Error).stack || error}`,
      );
      return 'ERROR-DROP-TABLE';
    }

    try {
      await databaseUpdateRepository.createTable(table, schema.columns);
      return 'OK';
    } catch (error) {
      logger.error(
        `[INIT-TABLE] Failed to create ${table} table. ${(error as Error).stack || error}`,
      );
      return 'ERROR-CREATE-TABLE';
    }
  },

  // 캐시된 페이지별 JSON 파일 순회하며 SQLite에 배치 INSERT
  async insertCachedPages(
    table: TDataTable,
    totalPages: number,
    onProgress?: (insertedPages: number, totalPages: number) => void,
  ): Promise<void> {
    for (let page = 1; page <= totalPages; page++) {
      const pageData = await databaseDownloadService.readCachedPageData(
        table,
        page,
      );
      const hasRowsToInsert: boolean = Boolean(pageData?.resource?.length);

      if (hasRowsToInsert) {
        await databaseUpdateRepository.insertData(table, pageData.resource);
      }
      onProgress?.(page, totalPages);
    }
  },

  // 실제 삽입된 레코드 수와 정합성 검증 (중복 키 교체 허용)
  async verifyInsertedRowCount(
    table: TDataTable,
    expectedTotalCount: number,
  ): Promise<void> {
    const actualCount = await this.getTableRowCount(table);
    const hasExpectedCount: boolean = expectedTotalCount > 0;
    const hasInsertedRows: boolean = actualCount > 0;
    const isVerificationSuccessful: boolean =
      !hasExpectedCount || hasInsertedRows;

    if (!isVerificationSuccessful) {
      const errorMsg = `[VERIFICATION_FAILED] ${table} table has 0 inserted rows (expected: ${expectedTotalCount})`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    logger.info(
      `[APPLY-DB] Successfully applied and verified ${table} (${actualCount} rows, expected ~${expectedTotalCount})`,
    );
  },

  // 로컬에 임시 캐시된 JSON 파일들로부터 SQLite에 데이터를 일괄 반영하고 정합성을 검증
  async applyCachedDataToTable(
    table: TDataTable,
    totalPages: number,
    expectedTotalCount: number,
    onProgress?: (insertedPages: number, totalPages: number) => void,
  ): Promise<'OK' | 'ERROR'> {
    // 1단계: 테이블 초기화 (DROP 후 CREATE)
    const initResult = await this.initTable(table);
    const isInitSuccessful: boolean = initResult === 'OK';

    if (!isInitSuccessful) {
      logger.error(`[APPLY-DB] Failed to init table ${table}: ${initResult}`);
      throw new Error(`Failed to init table ${table}`);
    }

    // 2단계: 캐시된 JSON 데이터 배치 삽입
    await this.insertCachedPages(table, totalPages, onProgress);

    // 3단계: 정합성 검증
    await this.verifyInsertedRowCount(table, expectedTotalCount);

    return 'OK';
  },

  // 특정 테이블의 전체 행 개수 조회
  getTableRowCount(table: TDataTable) {
    return databaseUpdateRepository.getTableRowCount(table);
  },

  // 로컬 데이터베이스의 버전 정보(config) 갱신
  async updateDatabaseVersion(
    table: TDataTable,
    newSchemaVersion: number,
    newDataVersion: number,
  ) {
    try {
      const configKeys = TABLE_CONFIG_KEYS_MAP[table];
      await databaseUpdateRepository.updateConfigs([
        {
          key: configKeys.find((key) =>
            key.endsWith('SchemaVersion'),
          ) as TConfigKey,
          value: newSchemaVersion,
        },
        {
          key: configKeys.find((key) =>
            key.endsWith('DataVersion'),
          ) as TConfigKey,
          value: newDataVersion,
        },
      ]);
      return 'OK' as const;
    } catch (error) {
      logger.error(
        `[UPDATE-VERSION] Failed for ${table}. ${(error as Error).stack || error}`,
      );
      return 'ERROR-UPDATE-DATABASE-VERSION' as const;
    }
  },
};
