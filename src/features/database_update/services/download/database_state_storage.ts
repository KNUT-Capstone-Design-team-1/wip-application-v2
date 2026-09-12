import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '@utils/logger';
import { IPersistedUpdateState } from '../../types';
import { STORAGE_KEYS } from '../../constants';

// AsyncStorage 기반 동기화 진행 상태 영속화 서비스
export const databaseStateStorage = {
  // 영속 업데이트 상태 저장
  async saveUpdateState(state: IPersistedUpdateState): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.UPDATE_STATE,
        JSON.stringify(state),
      );
    } catch (error) {
      logger.warn(
        `[SAVE-STATE] Failed to persist state: ${(error as Error).message}`,
      );
    }
  },

  // 영속 업데이트 상태 로드
  async loadUpdateState(): Promise<IPersistedUpdateState | null> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.UPDATE_STATE);

      const hasStoredJson: boolean = Boolean(json);

      if (!hasStoredJson) {
        return null;
      }

      return JSON.parse(json!) as IPersistedUpdateState;
    } catch (error) {
      logger.warn(
        `[LOAD-STATE] Failed to load persisted state: ${(error as Error).message}`,
      );

      return null;
    }
  },

  // 영속 업데이트 상태 삭제
  async clearUpdateState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.UPDATE_STATE);
    } catch (error) {
      logger.warn(
        `[CLEAR-STATE] Failed to clear persisted state: ${(error as Error).message}`,
      );
    }
  },
};
