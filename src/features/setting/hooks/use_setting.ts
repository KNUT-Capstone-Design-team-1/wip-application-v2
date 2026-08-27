import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { ISettingListType } from '@features/setting/types/setting_type';
import logger from '@utils/logger';
import { useRecentViewedPillStore } from '@store/recent_viewed_pill_store';
import { useCommonModalStore } from '@store/common_modal_store';

export const useSetting = () => {
  const router = useRouter();
  const resetRecentViewed = useRecentViewedPillStore(
    (state) => state.resetRecentViewed,
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
    (item: ISettingListType) => {
      if (item.path !== '') {
        router.push(`/${item.path}`);
        return;
      }

      switch (item.id) {
        case 'CLEAR_RECENT_VIEWED':
          clearRecentViewed();
          break;

        default:
          break;
      }
    },
    [router, clearRecentViewed],
  );

  return { handleSettingClick };
};
