import { useState, useCallback } from 'react';
import { unifiedSearchService } from '../services/unifiedSearchService';
import { logger } from '@utils/index';
import {
  getPillDataCountByItemSeq,
  getPillDatasByItemSeq,
} from '@services/database/queries/pill_data';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import { useRouter, usePathname } from 'expo-router';
import { useToast } from '@hooks/use_toast';
import { requestReview } from '@utils/store_review';

export const useUnifiedSearch = () => {
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const {
    setSearchResultData,
    setIsLoading,
    setSearchParam,
    setTotalDataCount,
  } = useSearchResultListStore();

  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = useCallback(() => {
    // 홈 화면('/')에서 검색하면 결과 화면으로 이동 (뒤로가기 시 홈으로 오게 push 사용)
    if (pathname === '/') {
      router.push('/pill-search-result-list');
      return;
    }

    if (pathname !== '/pill-search-result-list') {
      router.replace('/pill-search-result-list');
    }
  }, [pathname, router]);

  const search = useCallback(
    async (keyword: string) => {
      const trimmedKeyword = keyword.trim();

      if (!trimmedKeyword) {
        return;
      }

      setLoading(true);
      setIsLoading(true);

      try {
        const keywords = trimmedKeyword.split(/\s+/);
        const searchResult = await unifiedSearchService.search(keywords);

        if (!searchResult.success) {
          showToast({
            type: 'error',
            message:
              searchResult.message ||
              '서버로부터 검색 결과를 받아오는 데 실패했습니다.\n나중에 다시 시도해 주세요.',
          });
          return;
        }

        const results = searchResult.data?.results || [];
        if (results.length === 0) {
          showToast({
            type: 'default',
            message: '입력하신 키워드와 일치하는 약 정보가 없습니다.',
          });
          return;
        }

        const totalDataCount = await getPillDataCountByItemSeq(results);
        const pillDatas = await getPillDatasByItemSeq(results);

        // 검색 조건 및 결과 저장
        setSearchParam({ KEYWORD: trimmedKeyword });
        setTotalDataCount(totalDataCount);
        setSearchResultData(pillDatas);

        handleNavigation();

        // 화면 전환 애니메이션을 고려하여 리뷰 요청 지연 (500ms)
        setTimeout(() => {
          requestReview(); // 검색 성공 시 리뷰 요청 (내부 로직에 따라 노출 여부 결정됨)
        }, 500);
      } catch (e) {
        logger.error(`UnifiedSearch search Failed: ${e.stack || e}`);

        showToast({
          type: 'error',
          message: '통합 검색에 실패했습니다.\n나중에 다시 시도해 주세요.',
        });
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    },
    [handleNavigation, setIsLoading, setSearchParam, setSearchResultData],
  );

  return { loading, search };
};
