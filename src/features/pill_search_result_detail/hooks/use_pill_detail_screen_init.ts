import {
  useCallback,
  useEffect,
  useRef,
  RefObject,
  Dispatch,
  SetStateAction,
} from 'react';
import { useFocusEffect } from 'expo-router';
import { useRecentViewedPillStore } from '@store/recent_viewed_pill_store';
import { TRecentViewedPill } from '@common_types/recent_viewed_pill';
import { useHeaderTitleStore } from '@layouts/header/store/header_title_store';
import { useAppTrackStore } from '@store/app_track_store';
import { useReviewStore } from '@store/app_review_store';
import { IPillDetail } from '../types/pill_detail_type';
import { usePillDetail } from './use_pill_detail';

const STAY_DURATION = 3000;
interface Params {
  itemSeq?: string;
  pillData: IPillDetail | null;
  loading: boolean;
  isSave: RefObject<boolean>;
  loadPillDetail: ReturnType<typeof usePillDetail>['loadPillDetail'];
  setLoading: Dispatch<SetStateAction<boolean>>;
  setPillData: Dispatch<SetStateAction<IPillDetail | null>>;
}

// 상세 진입·조회 기록·포커스 생명주기 관리.
export const usePillDetailScreenInit = ({
  itemSeq,
  pillData,
  loading,
  isSave,
  loadPillDetail,
  setLoading,
  setPillData,
}: Params) => {
  const isStay = useRef(false);
  const name = pillData?.ITEM_NAME;
  const seq = pillData?.ITEM_SEQ;

  useEffect(() => {
    if (!seq || !name) {
      return;
    }

    useRecentViewedPillStore.getState().setRecentViewedPills({
      ITEM_SEQ: seq,
      ITEM_NAME: name,
    } as TRecentViewedPill);
  }, [seq, name]);

  useFocusEffect(
    useCallback(() => {
      if (name) {
        useHeaderTitleStore.getState().setTitle(name);
      }

      return () => useHeaderTitleStore.getState().resetTitle();
    }, [name]),
  );

  useEffect(() => {
    if (!itemSeq) {
      setLoading(false);

      return;
    }

    void loadPillDetail(itemSeq, setLoading, setPillData);
  }, [itemSeq, loadPillDetail, setLoading, setPillData]);

  useFocusEffect(
    useCallback(() => {
      if (loading || !pillData) {
        return;
      }

      const timer = setTimeout(() => {
        isStay.current = true;
      }, STAY_DURATION);

      return () => {
        clearTimeout(timer);

        if (isStay.current) {
          useAppTrackStore
            .getState()
            .increaseReviewActionCount('detail_viewed');
        }

        if (!isStay.current && !isSave.current) {
          return;
        }

        requestIdleCallback(() => {
          useReviewStore.getState().requestReviewIfEligible();
        });
      };
    }, [loading, pillData, isSave]),
  );
};
