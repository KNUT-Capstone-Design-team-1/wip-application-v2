import { useRecentViewedPillStore } from '@store/recent_viewed_pill_store';
import { useShallow } from 'zustand/react/shallow';

export const useRecentViewedPills = () =>
  useRecentViewedPillStore(
    useShallow((state) => ({
      recentViewedPills: state.recentViewedPills,
      loadRecentViewedPills: state.getRecentViewedPills,
      deleteRecentViewedPill: state.deleteRecentViewed,
    })),
  );
