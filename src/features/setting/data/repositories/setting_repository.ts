import { settingSqliteDataSource } from '../datasources/setting_sqlite_datasource';
import { IConfig } from '@services/database/types';

export const settingRepository = {
  // DB config 전체 목록 조회
  async getAllConfig(): Promise<IConfig[]> {
    return await settingSqliteDataSource.getAllConfig();
  },
};
