import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useRecentKeywordStore } from '@store/recent_keyword_store';
import { useRecentViewedPillStore } from '@store/recent_viewed_pill_store';

export const useRecentHistory = () => {
  const getRecentViewedPills = useRecentViewedPillStore(
    (state) => state.getRecentViewedPills,
  );
  const deleteRecentViewed = useRecentViewedPillStore(
    (state) => state.deleteRecentViewed,
  );

  const removeRecentKeyword = useRecentKeywordStore(
    (state) => state.removeRecentKeyword,
  );

  // 앱 재실행 후에도 저장된 조회 기록을 화면 진입 시 복원한다.
  useFocusEffect(
    useCallback(() => {
      getRecentViewedPills();
    }, [getRecentViewedPills]),
  );

  const handlePressKeywordItem = (keyword: string) => {};

  const handlePressViewedItem = (itemSeq: string) => {};

  const handlePressRemoveRecentViewedPill = (itemSeq: string) => {
    deleteRecentViewed(itemSeq);
  };

  const handlePressRemoveRecentKeyword = (keyword: string) => {
    removeRecentKeyword(keyword);
  };

  const loadRecentViewedPills = () => {
    getRecentViewedPills();
  };

  return {
    handlePressKeywordItem,
    handlePressViewedItem,
    handlePressRemoveRecentViewedPill,
    handlePressRemoveRecentKeyword,
    loadRecentViewedPills,
  };
};
