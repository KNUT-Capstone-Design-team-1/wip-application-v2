import { databaseUpdateService } from '../services/database_update_service';
import { ALL_DATA_TABLES } from '@services/database/types';
import { IUpdateNeeded, IUpdateCheckResult } from '../types';

// 전체 데이터베이스 테이블을 검사하여 업데이트가 필요한 항목 목록과 강제 업데이트 여부를 반환
export const getRequiredDatabaseUpdates =
  async (): Promise<IUpdateCheckResult> => {
    console.log(
      '[UPDATE-CHECK] Starting database version check for all tables...',
    );

    const updatesNeeded: IUpdateNeeded[] = [];

    for (const table of ALL_DATA_TABLES) {
      const result = await databaseUpdateService.checkRequireTableUpdate(table);

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

    // 기존 설치에서도 새 건강기능식품 테이블이 없으면 필수 동기화한다.
    const isForceUpdate =
      updatesNeeded.length === ALL_DATA_TABLES.length ||
      updatesNeeded.some(
        (update) =>
          [
            'functional_food_classification',
            'health_functional_food_raw_material',
          ].includes(update.table) && Number(update.oldSchemaVer) === 0,
      );

    console.log(
      `[UPDATE-CHECK] Check completed. ${updatesNeeded.length} table(s) need updates. (Force update: ${isForceUpdate})`,
    );

    return { updatesNeeded, isForceUpdate };
  };
