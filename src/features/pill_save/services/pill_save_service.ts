import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPillSaveData } from '@features/pill_save/types/pill_save_type';
import logger from '@utils/logger';

const SAVE_DATA_KEY = 'saveData';

/**
 * 저장된 알약 데이터를 AsyncStorage에서 관리하는 서비스
 */
export const pillSaveService = {
  /**
   * 저장된 모든 알약 목록 가져오기
   */
  async getSavedPills(): Promise<IPillSaveData[]> {
    try {
      const raw = await AsyncStorage.getItem(SAVE_DATA_KEY);

      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);

      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      logger.error(`[PILL-SAVE-SERVICE] Failed to get saved pills: ${e}`);
      return [];
    }
  },

  /**
   * 특정 알약이 저장되어 있는지 확인
   */
  async isPillSaved(itemSeq: string): Promise<boolean> {
    const savedList = await this.getSavedPills();
    return savedList.some((item) => item.ITEM_SEQ === itemSeq);
  },

  /**
   * 알약 저장 상태 토글 (저장되어 있으면 삭제, 없으면 추가)
   * @returns 변경 후의 저장 상태 (true: 저장됨, false: 삭제됨)
   */
  async toggleSave(saveItem: IPillSaveData): Promise<boolean> {
    try {
      const savedList = await this.getSavedPills();

      const isAlreadySaved = savedList.some(
        (item) => item.ITEM_SEQ === saveItem.ITEM_SEQ,
      );

      let nextList: IPillSaveData[];
      let nextStatus: boolean;

      if (isAlreadySaved) {
        nextList = savedList.filter(
          (item) => item.ITEM_SEQ !== saveItem.ITEM_SEQ,
        );

        nextStatus = false;

        await AsyncStorage.setItem(SAVE_DATA_KEY, JSON.stringify(nextList));
        return nextStatus;
      }

      const sanitizedItem = {
        ...saveItem,
        CHART: saveItem.CHART?.replace(/\s+/g, ' ').trim() || '',
      };

      nextList = [...savedList, sanitizedItem];
      nextStatus = true;

      await AsyncStorage.setItem(SAVE_DATA_KEY, JSON.stringify(nextList));

      return nextStatus;
    } catch (e) {
      logger.error(`[PILL-SAVE-SERVICE] Failed to toggle save: ${e}`);

      throw e;
    }
  },

  /**
   * 특정 알약 삭제
   */
  async deletePill(itemSeq: string): Promise<IPillSaveData[]> {
    try {
      const savedList = await this.getSavedPills();
      const nextList = savedList.filter((item) => item.ITEM_SEQ !== itemSeq);

      await AsyncStorage.setItem(SAVE_DATA_KEY, JSON.stringify(nextList));

      return nextList;
    } catch (e) {
      logger.error(`[PILL-SAVE-SERVICE] Failed to delete pill: ${e}`);

      throw e;
    }
  },
};
