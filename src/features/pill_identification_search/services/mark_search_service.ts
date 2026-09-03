import {
  IMarkSearchRepository,
  markSearchRepository,
} from '@features/pill_identification_search/data/repositories/mark_search_repository';
import { MarkData } from '@features/pill_identification_search/types/identification_mark_type';
import { INITIAL_LOAD_COUNT } from '@features/pill_identification_search/constants/identification_pagination_constant';
import {
  IMarkPaginationService,
  markPaginationService,
} from './mark_pagination_service';
import logger from '@utils/logger';

// 식별 마크 검색 비즈니스 로직 서비스 인터페이스
export interface IMarkSearchService {
  getMarks(
    keyword: string,
    batchPage?: number,
    limit?: number,
  ): Promise<MarkData[]>;

  calculateTotalPages(loadedCount: number): number;
}

// 식별 마크 검색 비즈니스 로직 서비스 구현체
export class MarkSearchService implements IMarkSearchService {
  constructor(
    private readonly repository: IMarkSearchRepository = markSearchRepository,
    private readonly paginationService: IMarkPaginationService = markPaginationService,
  ) {}

  // 마크 이미지 검색 (키워드 및 배치 페이지)
  async getMarks(
    keyword: string,
    batchPage: number = 1,
    limit: number = INITIAL_LOAD_COUNT,
  ): Promise<MarkData[]> {
    try {
      const searchParams = keyword.trim() ? { title: keyword.trim() } : {};
      const queryOption = { page: batchPage, limit };

      return await this.repository.getMarks(searchParams, queryOption);
    } catch (e) {
      logger.error(`[MARK-SEARCH-SERVICE] Failed to get marks: ${e}`);
      return [];
    }
  }

  // 총 페이지 수 계산 위임
  calculateTotalPages(loadedCount: number): number {
    return this.paginationService.calculateTotalPages(loadedCount);
  }
}

// 식별 마크 검색 서비스 싱글톤 인스턴스
export const markSearchService = new MarkSearchService();
