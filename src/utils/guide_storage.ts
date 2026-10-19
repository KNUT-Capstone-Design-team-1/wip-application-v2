import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StorageAdapter } from '@features/guide';

// 스포트라이트 가이드의 'once' 노출 기록을 AsyncStorage 에 영구 저장하는 어댑터
export const guideStorage: StorageAdapter = {
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
};
