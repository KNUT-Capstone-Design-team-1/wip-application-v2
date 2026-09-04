import { useRecentViewedPillStore } from '@store/recent_viewed_pill_store';

export const useRecentViewedPills = () =>
  useRecentViewedPillStore((state) => ({
    recentViewedPills: state.recentViewedPills,
    loadRecentViewedPills: state.getRecentViewedPills,
    deleteRecentViewedPill: state.deleteRecentViewed,
  }));
