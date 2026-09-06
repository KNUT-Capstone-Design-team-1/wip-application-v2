import { unifiedSearchRepository } from '../data/repositories/unified_search_repository';
import { IPillData } from '@services/database/types';
import logger from '@utils/logger';

export interface IUnifiedSearchResult {
  success: boolean;
  message?: string;
  totalDataCount: number;
  results: IPillData[];
}

export const unifiedSearchService = {
  /**
   * 통합 검색 키워드 기반 원격 검색 및 로컬 알약 데이터 조회 비즈니스 로직
   */
  async executeUnifiedSearch(
    keyword: string,
    limit: number = 50,
  ): Promise<IUnifiedSearchResult> {
    try {
      const trimmed = keyword.trim();
      if (!trimmed) {
        return { success: true, totalDataCount: 0, results: [] };
      }

      const keywords = trimmed.split(/\s+/);
      const searchResult = await unifiedSearchRepository.searchRemote(
        keywords,
        limit,
      );

      if (!searchResult.success) {
        return {
          success: false,
          message:
            searchResult.message ||
            '서버로부터 검색 결과를 받아오는 데 실패했습니다.\n나중에 다시 시도해 주세요.',
          totalDataCount: 0,
          results: [],
        };
      }

      const itemSeqs = searchResult.data?.results || [];
      if (itemSeqs.length === 0) {
        return {
          success: true,
          totalDataCount: 0,
          results: [],
        };
      }

      const { totalCount, pillDatas } =
        await unifiedSearchRepository.getPillDataWithCount(itemSeqs);

      return {
        success: true,
        totalDataCount: totalCount,
        results: pillDatas,
      };
    } catch (e) {
      logger.error(`[UNIFIED-SEARCH-SERVICE] Search failed: ${e}`);
      return {
        success: false,
        message: '통합 검색에 실패했습니다.\n나중에 다시 시도해 주세요.',
        totalDataCount: 0,
        results: [],
      };
    }
  },
};
