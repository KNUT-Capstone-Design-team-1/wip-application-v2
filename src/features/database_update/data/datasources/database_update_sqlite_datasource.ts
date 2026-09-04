import { ConfigQuery, InitTableQuery } from '@services/database/queries';
import {
  IConfig,
  TConfigKey,
  TDataTable,
  TResourceDataSchemas,
} from '@services/database/types';

export interface IDatabaseUpdateSqliteDataSource {
  getConfigs(keys: TConfigKey[]): Promise<IConfig[]>;
  dropTable(table: TDataTable): Promise<void>;
  createTable(
    table: TDataTable,
    columns: Parameters<typeof InitTableQuery.createTable>[1],
  ): Promise<void>;
  insertData(
    table: TDataTable,
    data: Partial<TResourceDataSchemas>[],
  ): Promise<void>;
  getTableRowCount(table: TDataTable): Promise<number>;
  updateConfigs(configs: IConfig[]): Promise<unknown>;
}

export class DatabaseUpdateSqliteDataSource implements IDatabaseUpdateSqliteDataSource {
  // 로컬 데이터베이스의 테이블 버전을 조회한다.
  getConfigs(keys: TConfigKey[]) {
    return ConfigQuery.getSpecificConfigs(keys);
  }

  // 로컬 테이블을 삭제한다.
  async dropTable(table: TDataTable) {
    await InitTableQuery.dropTable(table);
  }

  // 로컬 테이블을 생성한다.
  async createTable(
    table: TDataTable,
    columns: Parameters<typeof InitTableQuery.createTable>[1],
  ) {
    await InitTableQuery.createTable(table, columns);
  }

  // 페이지 데이터를 로컬 테이블에 저장한다.
  async insertData(table: TDataTable, data: Partial<TResourceDataSchemas>[]) {
    await InitTableQuery.insertData(table, data);
  }

  // 로컬 테이블의 행 개수를 조회한다.
  getTableRowCount(table: TDataTable) {
    return InitTableQuery.getTableRowCount(table);
  }

  // 로컬 데이터베이스 버전을 저장한다.
  updateConfigs(configs: IConfig[]) {
    return ConfigQuery.updateConfigs(configs);
  }
}

export const databaseUpdateSqliteDataSource =
  new DatabaseUpdateSqliteDataSource();
