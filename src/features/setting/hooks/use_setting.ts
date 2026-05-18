import { Alert } from 'react-native';
import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { getPillStorage } from '@features/setting/utils/setting';
import { SEARCH_LIST } from '@features/setting/constants/setting_list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ISettingListType } from '@features/setting/types/setting_type';
import logger from '@utils/logger';

export const useSetting = () => {
  const router = useRouter();

  const loadPillStorageCount = useCallback(async () => {
    try {
      const count = await getPillStorage();

      return SEARCH_LIST.map((item) =>
        item.id === 'CLEAR_STORAGE' ? { ...item, value: `${count}개` } : item,
      );
    } catch (e) {
      logger.error(`Failed to load pill storage count: ${e.stack || e}`);
      return SEARCH_LIST;
    }
  }, []);

  // 보관함 초기화
  const clearPillStorage = useCallback(
    async (onSuccess: (updatedList: ISettingListType[]) => void) => {
      Alert.alert('보관함 초기화', '보관함의 모든 알약을 삭제하시겠습니까?', [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('saveData');

              const updatedList = await loadPillStorageCount(); // 개수 다시 로드

              onSuccess(updatedList); // 화면 업데이트

              Alert.alert('완료', '보관함이 초기화되었습니다.');
            } catch (e) {
              logger.error(`Failed to clear pill storage: ${e.stack || e}`);

              Alert.alert('오류', '보관함 초기화에 실패했습니다.');
            }
          },
        },
      ]);
    },
    [loadPillStorageCount],
  );

  // 최근 검색 기록 삭제
  const clearRecentSearch = useCallback(async () => {
    Alert.alert('기록 삭제', '최근 검색한 알약 기록을 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('recentSearch');

            Alert.alert('완료', '검색 기록이 삭제되었습니다.');
          } catch (e) {
            logger.error(`Failed to clear recent search: ${e.stack || e}`);

            Alert.alert('오류', '기록 삭제에 실패했습니다.');
          }
        },
      },
    ]);
  }, []);

  const handleSettingClick = useCallback(
    (
      item: ISettingListType,
      onListUpdate: (updatedList: ISettingListType[]) => void,
    ) => {
      if (item.path !== '') {
        router.push(`/${item.path}`);
        return;
      }

      switch (item.id) {
        case 'CLEAR_STORAGE':
          clearPillStorage(onListUpdate);
          break;

        case 'CLEAR_RECENT_SEARCH':
          clearRecentSearch();
          break;

        default:
          break;
      }
    },
    [router, clearPillStorage, clearRecentSearch],
  );

  return { handleSettingClick, loadPillStorageCount };
};
