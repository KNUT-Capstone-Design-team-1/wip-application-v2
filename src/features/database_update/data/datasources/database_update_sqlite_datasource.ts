import { ConfigQuery, InitTableQuery } from '@services/database/queries';
import {
  IConfig,
  TConfigKey,
  TDataTable,
  TResourceDataSchemas,
} from '@services/database/types';

export const databaseUpdateSqliteDataSource = {
  // 로컬 데이터베이스의 테이블 버전을 조회한다.
  getConfigs(keys: TConfigKey[]): Promise<IConfig[]> {
    return ConfigQuery.getSpecificConfigs(keys);
  },

  // 로컬 테이블을 삭제한다.
  async dropTable(table: TDataTable): Promise<void> {
    await InitTableQuery.dropTable(table);
  },

  // 로컬 테이블을 생성한다.
  async createTable(
    table: TDataTable,
    columns: Parameters<typeof InitTableQuery.createTable>[1],
  ): Promise<void> {
    await InitTableQuery.createTable(table, columns);
  },

  // 페이지 데이터를 로컬 테이블에 저장한다.
  async insertData(
    table: TDataTable,
    data: Partial<TResourceDataSchemas>[],
  ): Promise<void> {
    await InitTableQuery.insertData(table, data);
  },

  // 로컬 테이블의 행 개수를 조회한다.
  getTableRowCount(table: TDataTable): Promise<number> {
    return InitTableQuery.getTableRowCount(table);
  },

  // 로컬 데이터베이스 버전을 저장한다.
  updateConfigs(configs: IConfig[]): Promise<unknown> {
    return ConfigQuery.updateConfigs(configs);
  },
};
