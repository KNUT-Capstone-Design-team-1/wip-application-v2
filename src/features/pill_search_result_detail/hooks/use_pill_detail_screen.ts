import { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { usePillDetail } from '@features/pill_search_result_detail/hooks/use_pill_detail';
import { usePillBox } from '@features/pill_save/hooks/use_pill_box';
import { IPillDetail } from '@features/pill_search_result_detail/types/pill_detail_type';
import { useRecentViewedPillStore } from '@store/recent_viewed_pill_store';
import { TRecentViewedPill } from '@common_types/recent_viewed_pill';
import { useHeaderTitleStore } from '@layouts/header/store/header_title_store';
import { useAppTrackStore } from '@store/app_track_store';
import { useReviewStore } from '@store/app_review_store';

const STAY_DURATION = 3000;

export const usePillDetailScreen = () => {
  const isSave = useRef(false);
  const isStay = useRef(false);

  const { itemImage, ITEM_SEQ } = useLocalSearchParams();
  const itemSeqStr = Array.isArray(ITEM_SEQ) ? ITEM_SEQ[0] : ITEM_SEQ;
  const itemImageStr = Array.isArray(itemImage) ? itemImage[0] : itemImage;

  const [pillData, setPillData] = useState<IPillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadPillDetail, detailLoading } = usePillDetail();
  const { setRecentViewedPills } = useRecentViewedPillStore();
  const { setTitle, resetTitle } = useHeaderTitleStore();

  const { saveState, toggleSave } = usePillBox(pillData?.ITEM_SEQ ?? '');

  const handleSaveToggle = useCallback(() => {
    if (!pillData) {
      return;
    }

    toggleSave({
      ITEM_SEQ: pillData.ITEM_SEQ,
      ITEM_NAME: pillData.ITEM_NAME,
      ENTP_NAME: pillData.ENTP_NAME,
      ITEM_IMAGE: itemImageStr || pillData.ITEM_IMAGE || '',
      CHART: pillData.CHART || '',
      CLASS_NAME: pillData.CLASS_NAME || '',
      PRINT_FRONT: pillData.PRINT_FRONT || '',
      PRINT_BACK: pillData.PRINT_BACK || '',
    });

    isSave.current = true;
  }, [pillData, toggleSave, itemImageStr]);

  // 최근 조회 저장
  useEffect(() => {
    if (pillData?.ITEM_SEQ) {
      setRecentViewedPills({
        ITEM_SEQ: pillData.ITEM_SEQ,
        ITEM_NAME: pillData.ITEM_NAME,
      } as TRecentViewedPill);

      setTitle(pillData.ITEM_NAME);
    }

    return () => {
      resetTitle();
    };
  }, [pillData?.ITEM_SEQ]);

  useEffect(() => {
    const initData = async () => {
      let initialPillData: IPillDetail | null = null;

      if (itemSeqStr) {
        await loadPillDetail(
          itemSeqStr as string,
          initialPillData ? () => {} : setLoading,
          setPillData,
        );

        return;
      } else {
        setLoading(false);
      }
    };

    initData();
  }, [itemSeqStr, loadPillDetail]);

  useFocusEffect(
    useCallback(() => {
      if (loading || !pillData) return;

      const timer = setTimeout(() => {
        isStay.current = true;
        console.log(`${STAY_DURATION}초 체류 완료`);
      }, STAY_DURATION);

      return () => {
        clearTimeout(timer);

        if (isStay.current) {
          useAppTrackStore
            .getState()
            .increaseReviewActionCount('detail_viewed');

          // 화면 전환 애니메이션 등으로 바쁜 작업이 끝나고 스레드가 한가해질 때 실행됨
        }

        if (isStay.current || isSave.current) {
          requestIdleCallback(() => {
            useReviewStore.getState().requestReviewIfEligible();
          });
        }
      };
    }, [loading, pillData]),
  );

  return {
    pillData,
    loading,
    itemImageStr,
    saveState,
    handleSaveToggle,
    detailLoading,
  };
};
