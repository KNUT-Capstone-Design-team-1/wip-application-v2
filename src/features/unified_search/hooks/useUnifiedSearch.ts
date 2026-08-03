import { useCallback } from 'react';
import { unifiedSearchService } from '../services/unifiedSearchService';
import { logger } from '@utils/index';
import {
  getPillDataCountByItemSeq,
  getPillDatasByItemSeq,
} from '@services/database/queries/pill_data';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import { useRouter, usePathname } from 'expo-router';
import { useToast } from '@hooks/use_toast';
import { useInterstitialAd } from '@features/ads/hooks/useInterstitialAd';
import { useAppTrackStore } from '@store/app_track_store';
import { useFullLoadingStore } from '@store/full_loading_store';

export const useUnifiedSearch = () => {
  const { showInterstitial } = useInterstitialAd();
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

      setIsLoading(true);

      const { setShow, setHide } = useFullLoadingStore.getState();
      setShow();

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

        // 광고와 데이터를 병렬 처리
        const getPillData = (async () => {
          // 백그라운드에서 후속 데이터 2개를 동시에 가져옴
          const [totalDataCount, pillDatas] = await Promise.all([
            getPillDataCountByItemSeq(results),
            getPillDatasByItemSeq(results),
          ]);

          return { totalDataCount, pillDatas };
        })();

        // 전면 광고 표시
        await new Promise<void>((resolve) => {
          showInterstitial(() => resolve(), 'UNIFIED_SEARCH');
        });

        const { totalDataCount, pillDatas } = await getPillData;

        // 검색 조건 및 결과 저장
        setSearchParam({ KEYWORD: trimmedKeyword });
        setTotalDataCount(totalDataCount);
        setSearchResultData(pillDatas);
        useAppTrackStore.getState().increaseCoreActionCount('unified_search');

        // 작업 완료 검색 결과 페이지로 이동
        handleNavigation();
      } catch (e) {
        logger.error(`UnifiedSearch search Failed: ${e.stack || e}`);

        showToast({
          type: 'error',
          message: '통합 검색에 실패했습니다.\n나중에 다시 시도해 주세요.',
        });
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
      showInterstitial,
      showToast,
    ],
  );

  return { search };
};
