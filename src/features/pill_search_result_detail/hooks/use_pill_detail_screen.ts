import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { usePillDetail } from '@features/pill_search_result_detail/hooks/use_pill_detail';
import { usePillBox } from '@features/pill_save/hooks/use_pill_box';
import { IPillDetail } from '@features/pill_search_result_detail/types/pill_detail_type';
import logger from '@utils/logger';
import { useRecentSearchPillStore } from '@store/recent_search_pill_store';
import { TRecentSearchPill } from '@common_types/recent_search_pill';

export const usePillDetailScreen = () => {
  const { itemDetail, itemImage, ITEM_SEQ } = useLocalSearchParams();
  const itemSeqStr = Array.isArray(ITEM_SEQ) ? ITEM_SEQ[0] : ITEM_SEQ;
  const itemImageStr = Array.isArray(itemImage) ? itemImage[0] : itemImage;

  const [pillData, setPillData] = useState<IPillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadPillDetail } = usePillDetail();
  const { setRecentSearchPills } = useRecentSearchPillStore();

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

  // 최근 검색 저장
  useEffect(() => {
    if (pillData?.ITEM_SEQ) {
      setRecentSearchPills({
        ITEM_SEQ: pillData.ITEM_SEQ,
        ITEM_NAME: pillData.ITEM_NAME,
      } as TRecentSearchPill);
    }
  }, [pillData?.ITEM_SEQ]);

  useEffect(() => {
    const initData = async () => {
      let initialPillData: IPillDetail | null = null;

      if (itemDetail) {
        try {
          initialPillData = JSON.parse(itemDetail as string);

          setPillData(initialPillData);

          setLoading(false);
        } catch (e) {
          logger.error(`Failed to parse itemDetail. ${e.stack || e}`);
        }
      }

      if (itemSeqStr) {
        await loadPillDetail(
          itemSeqStr as string,
          initialPillData ? () => {} : setLoading,
          setPillData,
        );

        return;
      }

      if (!itemDetail) {
        setLoading(false);
      }
    };

    initData();
  }, [itemSeqStr, itemDetail, loadPillDetail]);

  return {
    pillData,
    loading,
    itemImageStr,
    saveState,
    handleSaveToggle,
  };
};
