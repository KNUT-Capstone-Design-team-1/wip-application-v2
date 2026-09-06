import { identificationSearchSqliteDataSource } from '@features/pill_identification_search/data/datasources/identification_search_sqlite_datasource';
import { IPillData, TPillDataSearchParam } from '@services/database/types';
import { IPillSearchQueryOption } from '@features/pill_identification_search/types/identification_domain_type';

// 식별 검색 리포지토리
export const identificationSearchRepository = {
  // 알약 식별 검색 조회
  async searchPills(
    params: Partial<TPillDataSearchParam>,
    options: IPillSearchQueryOption,
  ): Promise<IPillData[]> {
    return await identificationSearchSqliteDataSource.getPillDatas(
      params,
      options,
    );
  },

  // 알약 식별 검색 총 개수 조회
  async countPills(params: Partial<TPillDataSearchParam>): Promise<number> {
    return await identificationSearchSqliteDataSource.getPillDataCount(params);
  },
};
