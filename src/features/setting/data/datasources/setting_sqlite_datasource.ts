import { ConfigQuery } from '@services/database/queries';
import { IConfig } from '@services/database/types';

export const settingSqliteDataSource = {
  // SQLite config 테이블의 모든 설정 조회
  async getAllConfig(): Promise<IConfig[]> {
    return await ConfigQuery.getAllConfig();
  },
};
