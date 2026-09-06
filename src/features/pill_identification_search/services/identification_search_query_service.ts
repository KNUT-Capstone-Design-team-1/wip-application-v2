import { identificationSearchRepository } from '@features/pill_identification_search/data/repositories/identification_search_repository';
import {
  ISearchPillData,
  IPillSearchQueryOption,
} from '@features/pill_identification_search/types/identification_domain_type';
import { buildSearchParam } from './identification_search_param_builder';
import { IPillData, TPillDataSearchParam } from '@services/database/types';
import logger from '@utils/logger';

// 식별 검색 쿼리 실행 비즈니스 서비스
export const identificationSearchQueryService = {
  // 폼 입력 데이터를 받아 파라미터 빌드 후 쿼리 및 카운트 병렬 실행
  async searchPills(
    rawParam: ISearchPillData,
    options: IPillSearchQueryOption = { page: 1, limit: 30 },
  ): Promise<{
    results: IPillData[];
    totalCount: number;
    searchParam: Partial<TPillDataSearchParam>;
  }> {
    try {
      const searchParam = buildSearchParam(rawParam);

      const [results, totalCount] = await Promise.all([
        identificationSearchRepository.searchPills(searchParam, options),
        identificationSearchRepository.countPills(searchParam),
      ]);

      return {
        results,
        totalCount,
        searchParam,
      };
    } catch (e) {
      logger.error(
        `[IDENTIFICATION-SEARCH-QUERY-SERVICE] Failed to search pills: ${e}`,
      );

      return {
        results: [],
        totalCount: 0,
        searchParam: {},
      };
    }
  },
};
