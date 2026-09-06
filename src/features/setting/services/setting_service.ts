import { settingRepository } from '../data/repositories/setting_repository';
import {
  TDataTable,
  TABLE_NAME_MAP,
  TABLE_CONFIG_KEYS_MAP,
} from '@services/database/types';
import { IDatabaseVersionInfo } from '../types/version_info';
import logger from '@utils/logger';

export const settingService = {
  // 앱 내 모든 데이터베이스 테이블의 버전 정보 목록 조회 및 매핑
  async getDatabaseVersions(): Promise<IDatabaseVersionInfo[]> {
    try {
      const allConfigs = await settingRepository.getAllConfig();

      if (!allConfigs || allConfigs.length === 0) {
        return [];
      }

      const configMap = new Map(allConfigs.map((c) => [c.key, c.value]));

      return Object.entries(TABLE_NAME_MAP).map(([tableKey, label]) => {
        const table = tableKey as TDataTable;
        const [schemaKey, dataKey] = TABLE_CONFIG_KEYS_MAP[table];

        const schemaVersion = configMap.get(schemaKey);
        const dataVersion = configMap.get(dataKey);

        return {
          table,
          label,
          schemaVersion:
            schemaVersion !== undefined ? String(schemaVersion) : '-',
          dataVersion: dataVersion !== undefined ? String(dataVersion) : '-',
        };
      });
    } catch (e) {
      logger.error(`[SETTING-SERVICE] Failed to get database versions: ${e}`);
      return [];
    }
  },
};
