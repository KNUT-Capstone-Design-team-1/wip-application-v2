import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPillDetail } from '@features/pill_search_result_detail/types/pill_detail_type';
import logger from '@utils/logger';

export const useHome = () => {
  const [recentSearchPills, setRecentSearchPills] = useState<IPillDetail[]>([]);

  const loadRecentSearchPills = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem('recentSearch');

      if (raw) {
        const pills: IPillDetail[] = JSON.parse(raw);
        setRecentSearchPills(pills);
      } else {
        setRecentSearchPills([]);
      }
    } catch (e) {
      logger.error(`Failed to load recent search pills: ${e.stack || e}`);
    }
  }, []);

  const deleteRecentSearch = useCallback(
    async (itemSeq: string) => {
      try {
        const raw = await AsyncStorage.getItem('recentSearch');
        if (raw) {
          const pills: IPillDetail[] = JSON.parse(raw);

          const updatedPills = pills.filter(
            (pill) => pill.ITEM_SEQ !== itemSeq,
          );

          await AsyncStorage.setItem(
            'recentSearch',
            JSON.stringify(updatedPills),
          );

          setRecentSearchPills(updatedPills);
        }
      } catch (e) {
        logger.error(`Failed to delete recent search: ${e.stack || e}`);
      }
    },
    [recentSearchPills],
  );

  return { recentSearchPills, loadRecentSearchPills, deleteRecentSearch };
};
