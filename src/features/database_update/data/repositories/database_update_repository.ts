import { databaseUpdateRemoteDataSource } from '../datasources/database_update_remote_datasource';
import { databaseUpdateSqliteDataSource } from '../datasources/database_update_sqlite_datasource';
import {
  IConfig,
  ITableColumnSchema,
  TConfigKey,
  TDataTable,
  TResourceDataSchemas,
} from '@services/database/types';
import { IDatabaseVersionResponse } from '@services/apis/google_cloud/wip_database_version';

export const databaseUpdateRepository = {
  // 원격 데이터소스에서 서버 버전을 가져온다.
  getDatabaseVersion(): Promise<IDatabaseVersionResponse> {
    return databaseUpdateRemoteDataSource.getDatabaseVersion();
  },

  // 원격 데이터소스에서 테이블 스키마를 가져온다.
  getTableSchema(
    table: TDataTable,
  ): Promise<{ columns: ITableColumnSchema[] }> {
    return databaseUpdateRemoteDataSource.getTableSchema(table);
  },

  // SQLite 데이터소스에서 로컬 버전을 가져온다.
  getConfigs(keys: TConfigKey[]): Promise<IConfig[]> {
    return databaseUpdateSqliteDataSource.getConfigs(keys);
  },

  // SQLite 데이터소스에서 테이블을 삭제한다.
  dropTable(table: TDataTable): Promise<void> {
    return databaseUpdateSqliteDataSource.dropTable(table);
  },

  // SQLite 데이터소스에서 테이블을 생성한다.
  createTable(table: TDataTable, columns: ITableColumnSchema[]): Promise<void> {
    return databaseUpdateSqliteDataSource.createTable(table, columns);
  },

  // SQLite 데이터소스에 페이지 데이터를 삽입한다.
  insertData(
    table: TDataTable,
    data: Partial<TResourceDataSchemas>[],
  ): Promise<void> {
    return databaseUpdateSqliteDataSource.insertData(table, data);
  },

  // SQLite 데이터소스에서 테이블 행 개수를 조회한다.
  getTableRowCount(table: TDataTable): Promise<number> {
    return databaseUpdateSqliteDataSource.getTableRowCount(table);
  },

  // SQLite 데이터소스에 로컬 버전을 저장한다.
  updateConfigs(configs: IConfig[]): Promise<unknown> {
    return databaseUpdateSqliteDataSource.updateConfigs(configs);
  },
};
