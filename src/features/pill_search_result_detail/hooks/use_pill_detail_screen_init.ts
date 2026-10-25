import { useCallback, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import { useHeaderTitleStore } from '@layouts/header/store/header_title_store';
import { useReviewStore } from '@store/app_review_store';
import { useAppTrackStore } from '@store/app_track_store';
import { useRecentViewedPillStore } from '@store/recent_viewed_pill_store';
import { DETAIL_REVIEW_STAY_MS } from '../constants/pill_detail';
import { usePillDetailContext } from './use_pill_detail_context';

// 조회 기록·헤더 제목 생명주기 관리.
export const usePillDetailMetadataInit = (itemSeq?: string, name?: string) => {
  useEffect(() => {
    const hasIncompleteMetadata = !itemSeq || !name;

    if (hasIncompleteMetadata) {
      return;
    }

    useRecentViewedPillStore
      .getState()
      .setRecentViewedPills({ ITEM_SEQ: itemSeq, ITEM_NAME: name });
  }, [itemSeq, name]);

  useFocusEffect(
    useCallback(() => {
      const hasName = !!name;

      if (hasName) {
        useHeaderTitleStore.getState().setTitle(name);
      }

      return () => useHeaderTitleStore.getState().resetTitle();
    }, [name]),
  );
};

// 체류·저장 후 리뷰 요청 생명주기 관리.
export const usePillDetailReviewInit = (itemSeq?: string) => {
  const store = usePillDetailContext();
  useFocusEffect(
    useCallback(() => {
      const hasNoItemSeq = !itemSeq;

      if (hasNoItemSeq) {
        return;
      }

      let stayed = false;
      const timer = setTimeout(() => {
        stayed = true;
      }, DETAIL_REVIEW_STAY_MS);

      return () => {
        clearTimeout(timer);

        if (stayed) {
          useAppTrackStore
            .getState()
            .increaseReviewActionCount('detail_viewed');
        }

        const shouldSkipReview = !stayed && !store.getState().hasSaved;

        if (shouldSkipReview) {
          return;
        }

        requestIdleCallback(() => {
          useReviewStore.getState().requestReviewIfEligible();
        });
      };
    }, [store, itemSeq]),
  );
};
