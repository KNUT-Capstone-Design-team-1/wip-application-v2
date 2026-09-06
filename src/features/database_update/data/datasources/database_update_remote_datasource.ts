import { GoogleCloud } from '@services/apis';
import { IDatabaseVersionResponse } from '@services/apis/google_cloud/wip_database_version';
import {
  ITableColumnSchema,
  TDataTable,
  TResourceDataSchemas,
} from '@services/database/types';

export const databaseUpdateRemoteDataSource = {
  // 서버에서 데이터베이스 버전을 조회한다.
  getDatabaseVersion(): Promise<IDatabaseVersionResponse> {
    return GoogleCloud.DatabaseVersionAPI.requestDatabaseVersion();
  },

  // 서버에서 테이블 스키마를 조회한다.
  getTableSchema(
    table: TDataTable,
  ): Promise<{ columns: ITableColumnSchema[] }> {
    return GoogleCloud.TableSchemaAPI.requestTableSchema(table);
  },

  // 서버에서 페이지 단위 원천 데이터를 조회한다.
  getResourceData(
    table: TDataTable,
    page: number,
  ): Promise<
    GoogleCloud.ResourceDataAPI.IResourceDataResponse<TResourceDataSchemas>
  > {
    return GoogleCloud.ResourceDataAPI.requestResourceData(table, page);
  },
};
