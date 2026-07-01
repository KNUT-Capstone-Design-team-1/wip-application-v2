import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { usePillDetail } from '@features/pill_search_result_detail/hooks/use_pill_detail';
import { usePillBox } from '@features/pill_save/hooks/use_pill_box';
import { IPillDetail } from '@features/pill_search_result_detail/types/pill_detail_type';
import { useRecentViewedPillStore } from '@store/recent_viewed_pill_store';
import { TRecentViewedPill } from '@common_types/recent_viewed_pill';

export const usePillDetailScreen = () => {
  const { itemImage, ITEM_SEQ } = useLocalSearchParams();
  const itemSeqStr = Array.isArray(ITEM_SEQ) ? ITEM_SEQ[0] : ITEM_SEQ;
  const itemImageStr = Array.isArray(itemImage) ? itemImage[0] : itemImage;

  const [pillData, setPillData] = useState<IPillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadPillDetail } = usePillDetail();
  const { setRecentViewedPills } = useRecentViewedPillStore();

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
  }, [pillData, toggleSave, itemImageStr]);

  // 최근 조회 저장
  useEffect(() => {
    if (pillData?.ITEM_SEQ) {
      setRecentViewedPills({
        ITEM_SEQ: pillData.ITEM_SEQ,
        ITEM_NAME: pillData.ITEM_NAME,
      } as TRecentViewedPill);
    }
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

  return {
    pillData,
    loading,
    itemImageStr,
    saveState,
    handleSaveToggle,
  };
};
