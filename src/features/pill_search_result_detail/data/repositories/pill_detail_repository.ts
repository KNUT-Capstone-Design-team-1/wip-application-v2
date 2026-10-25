import { getClassificationCatalog } from '@services/database/queries/classification_catalog';
import { pillDetailRemoteDataSource } from '../datasources/pill_detail_remote_datasource';
import { pillDetailSqliteDataSource } from '../datasources/pill_detail_sqlite_datasource';

// 상세 조회에 필요한 로컬·원격 데이터 접근 연결.
export const pillDetailRepository = {
  getClassificationCatalog,
  getPillData: pillDetailSqliteDataSource.getPillData,
  getPillDetail: pillDetailRemoteDataSource.getPillDetail,
};
