import { logger } from '@utils/index';
import {
  DATABSE_UPDATE_RESULT_CODE,
  TConfigKey,
  TDataTable,
  TABLE_CONFIG_KEYS_MAP,
} from '@services/database/types';
import { IDatabaseVersionResponse } from '@services/apis/google_cloud/wip_database_version';
import {
  IDatabaseUpdateRepository,
  databaseUpdateRepository,
} from '../data/repositories/database_update_repository';

export class DatabaseUpdateService {
  private databaseVersionOnServer?: IDatabaseVersionResponse;

  constructor(
    private readonly repository: IDatabaseUpdateRepository = databaseUpdateRepository,
  ) {}

  // 서버 버전과 로컬 버전을 비교해 업데이트 필요 여부를 판단한다.
  async checkRequireTableUpdate(table: TDataTable) {
    this.databaseVersionOnServer ??= await this.repository.getDatabaseVersion();
    const { schemaVersion: newSchemaVersion, dataVersion: newDataVersion } =
      this.databaseVersionOnServer[table];
    const currentVersion = await this.repository.getConfigs(
      TABLE_CONFIG_KEYS_MAP[table],
    );
    const currentSchemaVersion = currentVersion.find((v) =>
      v.key.endsWith('SchemaVersion'),
    )?.value;
    const currentDataVersion = currentVersion.find((v) =>
      v.key.endsWith('DataVersion'),
    )?.value;

    if (currentSchemaVersion == null || currentDataVersion == null) {
      return {
        code: 'REQUIRE-UPDATE' as const,
        newSchemaVersion,
        newDataVersion,
      };
    }

    const oldSchemaVersion = Number(currentSchemaVersion);
    const oldDataVersion = Number(currentDataVersion);
    const requiresUpdate =
      oldSchemaVersion < Number(newSchemaVersion) ||
      oldDataVersion < Number(newDataVersion);

    return {
      code: (requiresUpdate
        ? 'REQUIRE-UPDATE'
        : 'UNNECESSARY-UPDATE') as DATABSE_UPDATE_RESULT_CODE,
      newSchemaVersion,
      newDataVersion,
      oldSchemaVersion,
      oldDataVersion,
    };
  }

  async initTable(table: TDataTable): Promise<DATABSE_UPDATE_RESULT_CODE> {
    const schema = await this.repository.getTableSchema(table);
    if (!schema.columns?.length) {
      return 'INVALID-SCHEMA';
    }

    try {
      await this.repository.dropTable(table);
    } catch (error) {
      logger.error(
        `[INIT-TABLE] Failed to drop ${table} table. ${(error as Error).stack || error}`,
      );
      return 'ERROR-DROP-TABLE';
    }

    try {
      await this.repository.createTable(table, schema.columns);
      return 'OK';
    } catch (error) {
      logger.error(
        `[INIT-TABLE] Failed to create ${table} table. ${(error as Error).stack || error}`,
      );
      return 'ERROR-CREATE-TABLE';
    }
  }

  async insertData(currentPage: number, table: TDataTable) {
    let response: Awaited<
      ReturnType<IDatabaseUpdateRepository['getResourceData']>
    >;

    try {
      response = await this.repository.getResourceData(table, currentPage);
      if (!response?.resource?.length || !response?.totalPage) {
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
      await this.repository.insertData(table, response.resource);
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
  }

  getTableRowCount(table: TDataTable) {
    return this.repository.getTableRowCount(table);
  }

  async updateDatabaseVersion(
    table: TDataTable,
    newSchemaVersion: number,
    newDataVersion: number,
  ) {
    try {
      const configKeys = TABLE_CONFIG_KEYS_MAP[table];
      await this.repository.updateConfigs([
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
  }
}

export const databaseUpdateService = new DatabaseUpdateService();
