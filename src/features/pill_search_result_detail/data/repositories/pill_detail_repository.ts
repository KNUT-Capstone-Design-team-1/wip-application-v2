import { IPillData } from '@services/database/types';
import { pillDetailRemoteDataSource } from '../datasources/pill_detail_remote_datasource';
import { pillDetailSqliteDataSource } from '../datasources/pill_detail_sqlite_datasource';

export const pillDetailRepository = {
  // 로컬 기본 정보를 조회한다.
  getPillData(itemSeq: string): Promise<IPillData | null> {
    return pillDetailSqliteDataSource.getPillData(itemSeq);
  },

  // 원격 상세 정보를 조회한다.
  getPillDetail(
    itemSeq: string,
  ): ReturnType<(typeof pillDetailRemoteDataSource)['getPillDetail']> {
    return pillDetailRemoteDataSource.getPillDetail(itemSeq);
  },

  // 분류별 성분을 조회한다.
  searchNarcotics(params: unknown): Promise<any[]> {
    return pillDetailSqliteDataSource.searchNarcotics(params);
  },

  // 대마 성분을 조회한다.
  searchCannabis(params: unknown): Promise<any[]> {
    return pillDetailSqliteDataSource.searchCannabis(params);
  },

  // 향정신성 성분을 조회한다.
  searchPsychotropics(params: unknown): Promise<any[]> {
    return pillDetailSqliteDataSource.searchPsychotropics(params);
  },

  // 금지 성분을 조회한다.
  searchProhibitedList(params: unknown): Promise<any[]> {
    return pillDetailSqliteDataSource.searchProhibitedList(params);
  },
};
