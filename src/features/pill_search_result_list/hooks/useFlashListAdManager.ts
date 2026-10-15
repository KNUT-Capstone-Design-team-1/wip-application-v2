import { useEffect, useCallback } from 'react';
import { searchResultAdManager } from '@features/ads/services/searchResultAdManager';
import { useSearchResultListAdStore } from '@features/pill_search_result_list/store/search_result_list_ad_store';

/**
 * FlashList 인피드 광고 생명주기 관리 훅
 * - 검색어/검색조건 변경 시 이전 검색 세션의 슬롯 광고 정리 및 뷰포트 상태 리셋
 * - 화면 언마운트 시 슬롯 광고 메모리 해제
 */
export const useFlashListAdManager = (searchKey?: string) => {
  // 검색어/검색조건이 변경될 때마다 이전 검색 세션의 슬롯 광고 정리 및 뷰포트 상태 초기화
  useEffect(() => {
    searchResultAdManager.resetForNewSearch();
    useSearchResultListAdStore.getState().resetAdSlots();
  }, [searchKey]);

  // 검색 결과 화면 언마운트(이탈) 시 슬롯 광고 메모리 해제
  useEffect(() => {
    return () => {
      searchResultAdManager.resetForNewSearch();
      useSearchResultListAdStore.getState().resetAdSlots();
    };
  }, []);

  const getSlotAd = useCallback((slotKey: number | string) => {
    return searchResultAdManager.getSlotAd(slotKey);
  }, []);

  const preloadAd = useCallback(() => {
    return searchResultAdManager.preloadAd();
  }, []);

  return {
    getSlotAd,
    preloadAd,
  };
};
