import { useCallback, useMemo } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { ISettingListType } from '@features/setting/types/setting_type';
import { SEARCH_LIST } from '@features/setting/constants/setting_list';
import logger from '@utils/logger';
import { useRecentViewedPillStore } from '@store/recent_viewed_pill_store';
import { useCommonModalStore } from '@store/common_modal_store';
import { usePillReminderStore } from '@features/pill_reminder/store/pill_reminder_store';
import Toast from 'react-native-toast-message';

// 설정 화면의 항목 목록 및 액션 처리 커스텀 훅
export const useSetting = () => {
  const router = useRouter();
  const resetRecentViewed = useRecentViewedPillStore(
    (state) => state.resetRecentViewed,
  );

  const { reminders, fetchReminders, deleteAllReminders } =
    usePillReminderStore();

  // 화면 진입 시 복용 알림 최신 데이터 동기화
  useFocusEffect(
    useCallback(() => {
      fetchReminders();
    }, [fetchReminders]),
  );

  // 최근 조회한 알약 삭제
  const clearRecentViewed = useCallback(async () => {
    useCommonModalStore.getState().showModal({
      title: '안내',
      message: '최근 조회한 알약을 모두 삭제하시겠습니까?',
      confirmText: '삭제',
      confirmStyle: 'destructive',
      cancelText: '취소',
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

  // 모든 복용 알림 전체 삭제 (확인 모달 후 토스트 알림)
  const clearAllReminders = useCallback(async () => {
    const reminderCount = reminders.length;
    const hasNoReminders = reminderCount === 0;

    if (hasNoReminders) {
      return;
    }

    useCommonModalStore.getState().showModal({
      title: '복용 알림 전체 삭제',
      message: `설정된 모든 복용 알림(${reminderCount}개)을\n삭제하시겠습니까?`,
      confirmText: '삭제',
      confirmStyle: 'destructive',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          const success = await deleteAllReminders();
          const isDeleted = Boolean(success);

          if (isDeleted) {
            Toast.show({
              type: 'success',
              text1: '모든 복용 알림이 삭제되었습니다.',
            });
          }
        } catch (e) {
          logger.error(`Failed to clear all reminders: ${e}`);
          Toast.show({
            type: 'error',
            text1: '복용 알림 전체 삭제 중 오류가 발생했습니다.',
          });
        }
      },
    });
  }, [reminders.length, deleteAllReminders]);

  // 실시간 알림 개수가 반영된 설정 목록 계산
  const settingList = useMemo<ISettingListType[]>(() => {
    return SEARCH_LIST.map((item) => {
      const isReminderItem = item.id === 'CLEAR_ALL_REMINDERS';

      if (isReminderItem) {
        return {
          ...item,
          value: `${reminders.length}개`,
        };
      }

      return item;
    });
  }, [reminders.length]);

  // 설정 항목 클릭 핸들러
  const handleSettingClick = useCallback(
    (item: ISettingListType) => {
      const hasPath = Boolean(item.path);

      if (hasPath && item.path !== '') {
        router.push(`/${item.path}`);
        return;
      }

      switch (item.id) {
        case 'CLEAR_RECENT_VIEWED':
          clearRecentViewed();
          break;

        case 'CLEAR_ALL_REMINDERS':
          clearAllReminders();
          break;

        default:
          break;
      }
    },
    [router, clearRecentViewed, clearAllReminders],
  );

  return { settingList, handleSettingClick };
};
