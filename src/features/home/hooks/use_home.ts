import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPillDetail } from '@/src/features/pill_search_result_detail/types/pill_detail_type';
import React from 'react';

export const useHome = () => {
  const loadRecentSearchPills = async (
    setRecentSearchPills: React.Dispatch<React.SetStateAction<IPillDetail[]>>,
  ) => {
    try {
      const raw = await AsyncStorage.getItem('recentSearch');
      if (raw) {
        const pills: IPillDetail[] = JSON.parse(raw);
        setRecentSearchPills(pills); // 전체 표시
      }
    } catch (error) {
      console.error('Failed to load recent search pills:', error);
    }
  };

  return {
    loadRecentSearchPills,
  };
};
