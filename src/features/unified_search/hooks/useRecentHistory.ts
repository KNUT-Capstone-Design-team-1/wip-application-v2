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
