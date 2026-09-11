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

    // 2단계: 캐시된 페이지별 JSON 파일 순회하며 SQLite에 배치 INSERT
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

    // 3단계: 정합성 검증 (실제 삽입된 행 개수 vs API 전체 개수 비교)
    const actualCount = await this.getTableRowCount(table);
    const isCountMatching: boolean = actualCount === expectedTotalCount;

    if (!isCountMatching) {
      const errorMsg = `[VERIFICATION_FAILED] ${table} count mismatch (expected: ${expectedTotalCount}, actual: ${actualCount})`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    logger.info(
      `[APPLY-DB] Successfully applied and verified ${table} (${actualCount} rows)`,
    );
    return 'OK';
  },

  // 호환성을 위한 alias
  async installTableFromFiles(
    table: TDataTable,
    totalPages: number,
    expectedTotalCount: number,
    onProgress?: (insertedPages: number, totalPages: number) => void,
  ): Promise<'OK' | 'ERROR'> {
    return this.applyCachedDataToTable(
      table,
      totalPages,
      expectedTotalCount,
      onProgress,
    );
  },

  // 페이지 단위 데이터를 조회하여 로컬 테이블에 직접 삽입 (직접 호출 시)
  async insertData(currentPage: number, table: TDataTable) {
    let response: Awaited<
      ReturnType<(typeof databaseUpdateRepository)['getResourceData']>
    >;

    try {
      response = await databaseUpdateRepository.getResourceData(
        table,
        currentPage,
      );
      const hasValidResponse: boolean = Boolean(
        response?.resource?.length && response?.totalPage,
      );

      if (!hasValidResponse) {
        return {
          code: 'ERROR-NO-RESOURCE-DATA' as const,
          totalPage: 0,
          total: 0,
        };
      }
    } catch (error) {
      logger.error(
        `[INSERT-DATA] Failed to update ${table} table. ${(error as Error).stack || error}`,
      );
      return { code: 'ERROR-GET-RESOURCE' as const, totalPage: 0, total: 0 };
    }

    try {
      await databaseUpdateRepository.insertData(table, response.resource);
      return {
        code: 'OK' as const,
        totalPage: response.totalPage,
        total: response.total,
      };
    } catch (error) {
      logger.error(
        `[INSERT-DATA] Failed to insert ${table} table. ${(error as Error).stack || error}`,
      );
      return {
        code: 'ERROR-INSERT-TABLE' as const,
        totalPage: response.totalPage,
        total: response.total,
      };
    }
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
