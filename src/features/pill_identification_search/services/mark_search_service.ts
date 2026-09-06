import { markSearchRepository } from '@features/pill_identification_search/data/repositories/mark_search_repository';
import { MarkData } from '@features/pill_identification_search/types/identification_mark_type';
import { INITIAL_LOAD_COUNT } from '@features/pill_identification_search/constants/identification_pagination_constant';
import { markPaginationService } from './mark_pagination_service';
import logger from '@utils/logger';

// 식별 마크 검색 비즈니스 로직 서비스
export const markSearchService = {
  // 마크 이미지 검색 (키워드 및 배치 페이지)
  async getMarks(
    keyword: string,
    batchPage: number = 1,
    limit: number = INITIAL_LOAD_COUNT,
  ): Promise<MarkData[]> {
    try {
      const searchParams = keyword.trim() ? { title: keyword.trim() } : {};
      const queryOption = { page: batchPage, limit };

      return await markSearchRepository.getMarks(searchParams, queryOption);
    } catch (e) {
      logger.error(`[MARK-SEARCH-SERVICE] Failed to get marks: ${e}`);
      return [];
    }
  },

  // 총 페이지 수 계산 위임
  calculateTotalPages(loadedCount: number): number {
    return markPaginationService.calculateTotalPages(loadedCount);
  },
};
