import { useState, useCallback } from 'react';
import { unifiedSearchService } from '../services/unifiedSearchService';
import { logger } from '@utils/index';
import Toast from 'react-native-toast-message';
import {
  getPillDataCountByItemSeq,
  getPillDatasByItemSeq,
} from '@services/database/queries/pill_data';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import { useRouter, usePathname } from 'expo-router';

export const useUnifiedSearch = () => {
  const [loading, setLoading] = useState(false);

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
          Toast.show({
            type: 'error',
            text1: '통합 검색 서버 오류',
            text2:
              '서버로 부터 검색 결과를 받아오는데 실패했습니다. 나중에 다시 시도해주세요.',
            position: 'bottom',
          });
          return;
        }

        const results = searchResult.data?.results || [];
        if (results.length === 0) {
          Toast.show({
            type: 'info',
            text1: '검색 결과 없음',
            text2: '입력하신 키워드와 일치하는 약 정보가 없습니다.',
            position: 'bottom',
          });
          return;
        }

        const totalDataCount = await getPillDataCountByItemSeq(results);
        const pillDatas = await getPillDatasByItemSeq(results);

        // 검색 조건 및 결과 저장
        setSearchParam({ ITEM_NAME: trimmedKeyword });
        setTotalDataCount(totalDataCount);
        setSearchResultData(pillDatas);

        handleNavigation();
      } catch (e) {
        logger.error(`UnifiedSearch search Failed: ${e.stack || e}`);

        Toast.show({
          type: 'error',
          text1: '검색 실패',
          text2: '통합 검색에 실패했습니다. 나중에 다시 시도해주세요.',
          position: 'bottom',
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
