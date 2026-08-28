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
  const [isFolderModalVisible, setFolderModalVisible] = useState(false);

  const { loadPillDetail, detailLoading } = usePillDetail();
  const { setRecentViewedPills } = useRecentViewedPillStore();
  const { setTitle, resetTitle } = useHeaderTitleStore();

  const {
    savedFolderIds,
    isSaved,
    checkSavedStatus,
    loading: boxLoading,
  } = usePillBox(pillData?.ITEM_SEQ ?? '');

  const openFolderModal = useCallback(() => {
    if (!pillData) return;
    setFolderModalVisible(true);
  }, [pillData]);

  const closeFolderModal = useCallback(() => {
    setFolderModalVisible(false);
  }, []);

  const handleSaveComplete = useCallback(() => {
    isSave.current = true;
    checkSavedStatus(); // Refresh saved status after modal closes
  }, [checkSavedStatus]);

  const itemSeq = pillData?.ITEM_SEQ;
  const itemName = pillData?.ITEM_NAME;

  // 최근 조회 저장
  useEffect(() => {
    if (itemSeq && itemName) {
      setRecentViewedPills({
        ITEM_SEQ: itemSeq,
        ITEM_NAME: itemName,
      } as TRecentViewedPill);

      setTitle(itemName);
    }

    return () => {
      resetTitle();
    };
  }, [itemSeq, itemName, resetTitle, setRecentViewedPills, setTitle]);

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
      }, STAY_DURATION);

      return () => {
        clearTimeout(timer);

        if (isStay.current) {
          useAppTrackStore
            .getState()
            .increaseReviewActionCount('detail_viewed');
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
    isSaved, // passed down as saveState
    savedFolderIds,
    isFolderModalVisible,
    openFolderModal,
    closeFolderModal,
    handleSaveComplete,
    detailLoading,
  };
};
