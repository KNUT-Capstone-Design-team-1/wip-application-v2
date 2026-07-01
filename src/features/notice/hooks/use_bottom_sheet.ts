import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';
import { INoticeData } from '@features/notice/types/notice_type';
import { useNoticeStore } from '@features/notice/store/notice_store';

const BOTTOM_SHEET_HIDDEN_KEY = 'bottomSheetHiddenUntil';

export const useBottomSheet = () => {
  const {
    mainBottomSheetData,
    setMainBottomSheetData,
    isVisibleBottomSheet,
    setIsVisibleBottomSheet,
    setIsNeverShowAgain,
  } = useNoticeStore(
    useShallow((state) => ({
      mainBottomSheetData: state.mainBottomSheetData,
      setMainBottomSheetData: state.setMainBottomSheetData,
      isVisibleBottomSheet: state.isVisibleBottomSheet,
      setIsVisibleBottomSheet: state.setIsVisibleBottomSheet,
      setIsNeverShowAgain: state.setIsNeverShowAgain,
    })),
  );

  // 하루 보지 않기 처리
  const handleNeverShowAgain = useCallback(async () => {
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );
    const hideUntil = nextMidnight.getTime(); // 다음날 자정(00:00)

    await AsyncStorage.setItem(BOTTOM_SHEET_HIDDEN_KEY, hideUntil.toString());

    setIsVisibleBottomSheet(false);
    setIsNeverShowAgain(true);

    // 상태 초기화하여 즉시 숨김 처리
    setMainBottomSheetData([]);
  }, [setMainBottomSheetData]);

  // 닫기 처리
  const handleClose = useCallback(() => {
    setIsVisibleBottomSheet(false);
  }, []);

  // 공지사항 표시 가능 여부 확인
  const checkShouldShow = useCallback(async () => {
    const bottomSheetNotices = useNoticeStore.getState().mainBottomSheetData;
    // 데이터가 없으면 표시 안 함
    if (!bottomSheetNotices || bottomSheetNotices.length === 0) {
      setIsVisibleBottomSheet(false);
      return;
    }

    // 저장된 시간 확인
    const hideUntil = await AsyncStorage.getItem(BOTTOM_SHEET_HIDDEN_KEY);
    const now = new Date().getTime();
    const shouldShowBottomSheet = !hideUntil || now > parseInt(hideUntil, 10);

    setIsNeverShowAgain(!shouldShowBottomSheet);
    setIsVisibleBottomSheet(shouldShowBottomSheet);

    if (hideUntil && shouldShowBottomSheet) {
      await AsyncStorage.removeItem(BOTTOM_SHEET_HIDDEN_KEY);
    }
  }, []);

  const moveToDetailContent = useCallback(
    (noticeData: INoticeData) => {
      handleClose();

      // expo-router를 사용하여 공지사항 상세 화면으로 이동
      router.push({
        pathname: '/notice-detail',
        params: {
          notice: JSON.stringify(noticeData),
        },
      });
    },
    [handleClose],
  );

  return {
    isVisibleBottomSheet,
    mainBottomSheetData,
    handleClose,
    handleNeverShowAgain,
    checkShouldShow,
    moveToDetailContent,
  };
};
