import { useState } from 'react';
import { unifiedSearchService } from '../services/unifiedSearchService';
import { logger } from '@utils/index';
import Toast from 'react-native-toast-message';
import { getPillDatasByItemSeq } from '@services/database/queries/pill_data';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import { useRouter, usePathname } from 'expo-router';

export const useUnifiedSearch = () => {
  const [loading, setLoading] = useState(false);
  const { setSearchResultData, setIsLoading } = useSearchResultListStore();
  const router = useRouter();
  const pathname = usePathname();

  const search = async (keyword: string) => {
    if (!keyword.trim()) {
      return;
    }

    setLoading(true);
    setIsLoading(true);
    try {
      // 1. 통합 검색 API 호출 (string[] 반환됨)
      const keywords = keyword.trim().split(/\s+/);
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

      if (!searchResult.data?.results?.length) {
        Toast.show({
          type: 'info',
          text1: '검색 결과 없음',
          text2: '입력하신 키워드와 일치하는 약 정보가 없습니다.',
          position: 'bottom',
        });
        return;
      }

      const pillDatas = await getPillDatasByItemSeq(searchResult.data.results);

      setSearchResultData(pillDatas);

      // 네비게이션 처리. 홈 화면('/')에서 검색하면 결과 화면으로 이동 (뒤로가기 시 홈으로 오게 push 사용)
      if (pathname === '/') {
        router.push('/pill-search-result-list');
        return;
      }

      if (pathname !== '/pill-search-result-list') {
        router.replace('/pill-search-result-list');
      }
    } catch (error: any) {
      logger.error(`UnifiedSearch search Failed: ${error.stack || error}`);

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
  };

  return {
    loading,
    search,
  };
};
