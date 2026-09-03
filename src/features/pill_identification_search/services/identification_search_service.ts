import {
  ISearchPillData,
  IPillSearchQueryOption,
} from '@features/pill_identification_search/types/identification_domain_type';
import {
  IIdentificationSearchQueryService,
  identificationSearchQueryService,
} from './identification_search_query_service';
import {
  IIdentificationSearchAnalyticsService,
  identificationSearchAnalyticsService,
} from './identification_search_analytics_service';
import { IPillData, TPillDataSearchParam } from '@services/database/types';

// 식별 검색 통합 비즈니스 파사드 서비스 인터페이스
export interface IIdentificationSearchService {
  searchPills(
    rawParam: ISearchPillData,
    options?: IPillSearchQueryOption,
  ): Promise<{
    results: IPillData[];
    totalCount: number;
    searchParam: Partial<TPillDataSearchParam>;
  }>;

  recordSearchAction(): void;
}

// 식별 검색 통합 비즈니스 파사드 서비스 구현체
export class IdentificationSearchService implements IIdentificationSearchService {
  constructor(
    private readonly queryService: IIdentificationSearchQueryService = identificationSearchQueryService,
    private readonly analyticsService: IIdentificationSearchAnalyticsService = identificationSearchAnalyticsService,
  ) {}

  // 폼 입력 데이터로 식별 검색 실행
  async searchPills(
    rawParam: ISearchPillData,
    options?: IPillSearchQueryOption,
  ): Promise<{
    results: IPillData[];
    totalCount: number;
    searchParam: Partial<TPillDataSearchParam>;
  }> {
    return await this.queryService.searchPills(rawParam, options);
  }

  // 검색 코어 액션 카운트 기록
  recordSearchAction(): void {
    this.analyticsService.recordSearchAction();
  }
}

// 식별 검색 통합 비즈니스 서비스 싱글톤 인스턴스
export const identificationSearchService = new IdentificationSearchService();
