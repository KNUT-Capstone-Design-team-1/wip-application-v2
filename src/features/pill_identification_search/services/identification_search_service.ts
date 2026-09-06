import { identificationSearchRepository } from '@features/pill_identification_search/data/repositories/identification_search_repository';
import {
  ISearchPillData,
  IPillSearchQueryOption,
} from '@features/pill_identification_search/types/identification_domain_type';
import { buildSearchParam } from './identification_search_param_builder';
import { IPillData, TPillDataSearchParam } from '@services/database/types';
import { useAppTrackStore } from '@store/app_track_store';
import logger from '@utils/logger';

// 식별 검색 비즈니스 로직 서비스
export const identificationSearchService = {
  // 폼 입력 데이터로 식별 검색 실행
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
        `[IDENTIFICATION-SEARCH-SERVICE] Failed to search pills: ${e}`,
      );

      return {
        results: [],
        totalCount: 0,
        searchParam: {},
      };
    }
  },

  // 검색 코어 액션 카운트 기록
  recordSearchAction(): void {
    useAppTrackStore
      .getState()
      .increaseCoreActionCount('identification_search');
  },
};
