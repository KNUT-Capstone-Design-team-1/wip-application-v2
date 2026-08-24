import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { getPillStorage } from '@features/setting/utils/setting';
import { SEARCH_LIST } from '@features/setting/constants/setting_list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ISettingListType } from '@features/setting/types/setting_type';
import logger from '@utils/logger';
import { useRecentViewedPillStore } from '@store/recent_viewed_pill_store';
import { useCommonModalStore } from '@store/common_modal_store';

export const useSetting = () => {
  const router = useRouter();
  const resetRecentViewed = useRecentViewedPillStore(
    (state) => state.resetRecentViewed,
  );

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
      useCommonModalStore.getState().showModal({
        title: '안내',
        message: '보관함의 모든 알약을 삭제하시겠습니까?',
        confirmText: '삭제',
        onConfirm: async () => {
          try {
            await AsyncStorage.removeItem('saveData');
            const updatedList = await loadPillStorageCount(); // 개수 다시 로드
            onSuccess(updatedList); // 화면 업데이트

            useCommonModalStore.getState().showModal({
              title: '알림',
              message: '보관함이 초기화되었습니다.',
              hideCancel: true,
            });
          } catch (e) {
            logger.error(`Failed to clear pill storage: ${e.stack || e}`);
            useCommonModalStore.getState().showModal({
              title: '오류',
              message: '보관함 초기화에 실패했습니다.',
              hideCancel: true,
            });
          }
        },
      });
    },
    [loadPillStorageCount],
  );

  // 최근 조회한 알약 삭제
  const clearRecentViewed = useCallback(async () => {
    useCommonModalStore.getState().showModal({
      title: '안내',
      message: '최근 조회한 알약을 모두 삭제하시겠습니까?',
      confirmText: '삭제',
      onConfirm: async () => {
        try {
          resetRecentViewed();
          useCommonModalStore.getState().showModal({
            title: '알림',
            message: '최근 조회한 알약이 삭제되었습니다.',
            hideCancel: true,
          });
        } catch (e) {
          logger.error(`Failed to clear recent search: ${e.stack || e}`);
          useCommonModalStore.getState().showModal({
            title: '오류',
            message: '최근 조회한 알약 삭제에 실패했습니다.',
            hideCancel: true,
          });
        }
      },
    });
  }, [resetRecentViewed]);

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

        case 'CLEAR_RECENT_VIEWED':
          clearRecentViewed();
          break;

        default:
          break;
      }
    },
    [router, clearPillStorage, clearRecentViewed],
  );

  return { handleSettingClick, loadPillStorageCount };
};
