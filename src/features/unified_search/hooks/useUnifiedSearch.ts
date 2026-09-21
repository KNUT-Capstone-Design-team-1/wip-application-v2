import { useCallback } from 'react';
import { unifiedSearchService } from '../services/unifiedSearchService';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import { useRouter, usePathname } from 'expo-router';
import { useToast } from '@hooks/use_toast';
import { useAppTrackStore } from '@store/app_track_store';
import { useFullLoadingStore } from '@store/full_loading_store';
import { useRecentKeywordStore } from '@store/recent_keyword_store';

export const useUnifiedSearch = () => {
  const { showToast } = useToast();

  const {
    resetSearchResults,
    setSearchResultData,
    setIsLoading,
    setSearchParam,
    setTotalDataCount,
    setNextCursor,
    setHasMore,
  } = useSearchResultListStore();
  const { addRecentKeyword } = useRecentKeywordStore();

  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = useCallback(() => {
    if (pathname === '/unified-search') {
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

      resetSearchResults();

      const { setShow, setHide } = useFullLoadingStore.getState();
      const isNotInResultScreen = pathname !== '/pill-search-result-list';
      if (isNotInResultScreen) {
        setShow();
      }

      try {
        const searchResult = await unifiedSearchService.executeUnifiedSearch(
          trimmedKeyword,
          100,
        );

        if (!searchResult.success) {
          showToast({
            type: 'error',
            message:
              searchResult.message ||
              '통합 검색에 실패했습니다.\n나중에 다시 시도해 주세요.',
          });
          return;
        }

        addRecentKeyword(trimmedKeyword); // 최근 검색어 추가
        setSearchParam({ KEYWORD: trimmedKeyword }); // 키워드 태그 추가

        if (searchResult.results.length === 0) {
          showToast({
            type: 'default',
            message: '입력하신 키워드와 일치하는 약 정보가 없습니다.',
          });
          return;
        }

        // 검색 조건 및 결과 저장
        setTotalDataCount(searchResult.totalDataCount);
        setSearchResultData(searchResult.results);
        setNextCursor(searchResult.nextCursor);
        setHasMore(searchResult.hasMore);
        useAppTrackStore.getState().increaseCoreActionCount('unified_search');

        // 작업 완료 검색 결과 페이지로 이동
        handleNavigation();
      } finally {
        setIsLoading(false);
        setHide();
      }
    },
    [
      handleNavigation,
      setIsLoading,
      setSearchParam,
      setSearchResultData,
      resetSearchResults,
      setTotalDataCount,
      setNextCursor,
      setHasMore,
      showToast,
      addRecentKeyword,
      pathname,
    ],
  );

  return { search };
};
