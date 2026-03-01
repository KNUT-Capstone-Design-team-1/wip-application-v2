import { getPillStorage } from '@/src/features/setting/utils/setting';
import { SEARCH_LIST } from '@/src/features/setting/constants/setting_list';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ISettingListType } from '../types/setting_type';
import { useRouter } from 'expo-router';
import React from 'react';

export const useSetting = () => {
  const router = useRouter();

  const settingListClickHandler = (
    list: ISettingListType,
    setSettingList: React.Dispatch<React.SetStateAction<ISettingListType[]>>,
  ) => {
    if (list.path !== '') {
      router.push(`/${list.path}`);
      return;
    }

    // 기능별 처리
    if (list.title === '보관함 초기화') {
      clearPillStorage(setSettingList);
    } else if (list.title === '기록 삭제') {
      clearRecentSearch();
    }
  };

  const loadPillStorageCount = async () => {
    const count = await getPillStorage();
    return SEARCH_LIST.map((item) => {
      if (item.title === '보관함 초기화') {
        return { ...item, value: `${count}개` };
      }
      return item;
    });
  };

  // 보관함 초기화
  const clearPillStorage = async (
    onSuccess: (updatedList: ISettingListType[]) => void,
  ) => {
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
          } catch (error) {
            console.error('Failed to clear pill storage:', error);
            Alert.alert('오류', '보관함 초기화에 실패했습니다.');
          }
        },
      },
    ]);
  };

  // 최근 검색 기록 삭제
  const clearRecentSearch = async () => {
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
          } catch (error) {
            console.error('Failed to clear recent search:', error);
            Alert.alert('오류', '기록 삭제에 실패했습니다.');
          }
        },
      },
    ]);
  };

  return {
    settingListClickHandler,
    loadPillStorageCount,
    clearPillStorage,
    clearRecentSearch,
  };
};
