import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPillSaveData } from '@/src/features/pill_save/types/pill_save_type';

const SAVE_DATA_KEY = 'saveData';

export const usePillBox = (itemSeq: string) => {
  const [saveState, setSaveState] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      const raw = await AsyncStorage.getItem(SAVE_DATA_KEY);

      if (!raw) return;

      const savedList: IPillSaveData[] = JSON.parse(raw);
      setSaveState(savedList.some((item) => item.ITEM_SEQ === itemSeq));
    };
    checkSaved();
  }, [itemSeq]);

  const toggleSave = async (saveItem: IPillSaveData) => {
    const raw = await AsyncStorage.getItem(SAVE_DATA_KEY);
    const savedList: IPillSaveData[] = raw ? JSON.parse(raw) : [];
    const alreadySaved = savedList.some((item) => item.ITEM_SEQ === itemSeq);

    if (alreadySaved) {
      const next = savedList.filter((item) => item.ITEM_SEQ !== itemSeq);

      await AsyncStorage.setItem(SAVE_DATA_KEY, JSON.stringify(next));
      setSaveState(false);
    } else {
      // CHART 필드의 줄바꿈/공백 정리
      const sanitizedItem = {
        ...saveItem,
        CHART: saveItem.CHART?.replace(/\s+/g, ' ').trim() || '',
      };
      savedList.push(sanitizedItem);
      await AsyncStorage.setItem(SAVE_DATA_KEY, JSON.stringify(savedList));

      setSaveState(true);
    }
  };

  return { saveState, toggleSave };
};
