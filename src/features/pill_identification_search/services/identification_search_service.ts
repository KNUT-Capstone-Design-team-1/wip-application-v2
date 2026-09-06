import {
  ISearchPillData,
  IPillSearchQueryOption,
} from '@features/pill_identification_search/types/identification_domain_type';
import { identificationSearchQueryService } from './identification_search_query_service';
import { identificationSearchAnalyticsService } from './identification_search_analytics_service';
import { IPillData, TPillDataSearchParam } from '@services/database/types';

// 식별 검색 통합 비즈니스 서비스
export const identificationSearchService = {
  // 폼 입력 데이터로 식별 검색 실행
  async searchPills(
    rawParam: ISearchPillData,
    options?: IPillSearchQueryOption,
  ): Promise<{
    results: IPillData[];
    totalCount: number;
    searchParam: Partial<TPillDataSearchParam>;
  }> {
    return await identificationSearchQueryService.searchPills(
      rawParam,
      options,
    );
  },

  // 검색 코어 액션 카운트 기록
  recordSearchAction(): void {
    identificationSearchAnalyticsService.recordSearchAction();
  },
};
