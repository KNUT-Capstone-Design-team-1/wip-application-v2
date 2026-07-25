import { useState, useEffect } from 'react';
import { ConfigQuery } from '@services/database/queries';
import {
  TDataTable,
  TABLE_NAME_MAP,
  TABLE_CONFIG_KEYS_MAP,
} from '@services/database/types';
import logger from '@utils/logger';
import { IDatabaseVersionInfo } from '../types/version_info';

/** 앱 내 모든 데이터베이스 테이블의 버전 정보 목록을 가져오는 커스텀 훅 */
export const useDatabaseVersions = () => {
  const [versions, setVersions] = useState<IDatabaseVersionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setIsLoading(true);
        const allConfigs = await ConfigQuery.getAllConfig();

        if (!allConfigs || allConfigs.length === 0) {
          setVersions([]);
          setIsLoading(false);
          return;
        }

        const configMap = new Map(allConfigs.map((c) => [c.key, c.value]));

        const versionList: IDatabaseVersionInfo[] = Object.entries(
          TABLE_NAME_MAP,
        ).map(([tableKey, label]) => {
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

        setVersions(versionList);
      } catch (e) {
        logger.error(
          `Failed to fetch database versions: ${(e as Error).stack || e}`,
        );
        setVersions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersions();
  }, []);

  return { versions, isLoading };
};
