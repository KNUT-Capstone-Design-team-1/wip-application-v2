import {
  IDatabaseUpdateRemoteDataSource,
  databaseUpdateRemoteDataSource,
} from '../datasources/database_update_remote_datasource';
import {
  IDatabaseUpdateSqliteDataSource,
  databaseUpdateSqliteDataSource,
} from '../datasources/database_update_sqlite_datasource';
import {
  IConfig,
  ITableColumnSchema,
  TConfigKey,
  TDataTable,
  TResourceDataSchemas,
} from '@services/database/types';

export interface IDatabaseUpdateRepository {
  getDatabaseVersion(): ReturnType<
    IDatabaseUpdateRemoteDataSource['getDatabaseVersion']
  >;
  getTableSchema(table: TDataTable): Promise<{ columns: ITableColumnSchema[] }>;
  getResourceData(
    table: TDataTable,
    page: number,
  ): ReturnType<IDatabaseUpdateRemoteDataSource['getResourceData']>;
  getConfigs(keys: TConfigKey[]): Promise<IConfig[]>;
  dropTable(table: TDataTable): Promise<void>;
  createTable(table: TDataTable, columns: ITableColumnSchema[]): Promise<void>;
  insertData(
    table: TDataTable,
    data: Partial<TResourceDataSchemas>[],
  ): Promise<void>;
  getTableRowCount(table: TDataTable): Promise<number>;
  updateConfigs(configs: IConfig[]): Promise<unknown>;
}

export class DatabaseUpdateRepository implements IDatabaseUpdateRepository {
  constructor(
    private readonly remoteDataSource: IDatabaseUpdateRemoteDataSource = databaseUpdateRemoteDataSource,
    private readonly sqliteDataSource: IDatabaseUpdateSqliteDataSource = databaseUpdateSqliteDataSource,
  ) {}

  // 원격 데이터소스에서 서버 버전을 가져온다.
  getDatabaseVersion() {
    return this.remoteDataSource.getDatabaseVersion();
  }

  // 원격 데이터소스에서 테이블 스키마를 가져온다.
  getTableSchema(table: TDataTable) {
    return this.remoteDataSource.getTableSchema(table);
  }

  // 원격 데이터소스에서 페이지 데이터를 가져온다.
  getResourceData(table: TDataTable, page: number) {
    return this.remoteDataSource.getResourceData(table, page);
  }

  // SQLite 데이터소스에서 로컬 버전을 가져온다.
  getConfigs(keys: TConfigKey[]) {
    return this.sqliteDataSource.getConfigs(keys);
  }

  // SQLite 데이터소스에서 테이블을 삭제한다.
  async dropTable(table: TDataTable) {
    await this.sqliteDataSource.dropTable(table);
  }

  // SQLite 데이터소스에서 테이블을 생성한다.
  async createTable(table: TDataTable, columns: ITableColumnSchema[]) {
    await this.sqliteDataSource.createTable(table, columns);
  }

  // SQLite 데이터소스에 페이지 데이터를 저장한다.
  insertData(table: TDataTable, data: Partial<TResourceDataSchemas>[]) {
    return this.sqliteDataSource.insertData(table, data);
  }

  // SQLite 테이블의 행 개수를 조회한다.
  getTableRowCount(table: TDataTable) {
    return this.sqliteDataSource.getTableRowCount(table);
  }

  // SQLite에 새 버전을 저장한다.
  updateConfigs(configs: IConfig[]) {
    return this.sqliteDataSource.updateConfigs(configs);
  }
}

export const databaseUpdateRepository = new DatabaseUpdateRepository();
