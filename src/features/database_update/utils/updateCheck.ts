import { DatabaseUpdateService } from '@services/index';
import { ALL_DATA_TABLES } from '@services/database/types';

export interface IUpdateNeeded {
  table: string;
  schemaVer: number;
  dataVer: number;
  oldSchemaVer?: number;
  oldDataVer?: number;
}

export interface IUpdateCheckResult {
  updatesNeeded: IUpdateNeeded[];
  isForceUpdate: boolean;
}

/**
 * 전체 데이터베이스 테이블을 검사하여 업데이트가 필요한 항목들의 목록과 강제 업데이트 여부를 반환합니다.
 * @returns 업데이트가 필요한 테이블 목록과 강제 업데이트 여부
 */
export const getRequiredDatabaseUpdates =
  async (): Promise<IUpdateCheckResult> => {
    console.log(
      '[UPDATE-CHECK] Starting database version check for all tables...',
    );

    const updatesNeeded: IUpdateNeeded[] = [];

    for (const table of ALL_DATA_TABLES) {
      const result = await DatabaseUpdateService.checkRequireTableUpdate(table);

      if (result.code === 'REQUIRE-UPDATE') {
        updatesNeeded.push({
          table,
          schemaVer: result.newSchemaVersion,
          dataVer: result.newDataVersion,
          oldSchemaVer: result.oldSchemaVersion,
          oldDataVer: result.oldDataVersion,
        });
      }
    }

    const isForceUpdate = updatesNeeded.length === ALL_DATA_TABLES.length;

    console.log(
      `[UPDATE-CHECK] Check completed. ${updatesNeeded.length} table(s) need updates. (Force update: ${isForceUpdate})`,
    );

    return { updatesNeeded, isForceUpdate };
  };
