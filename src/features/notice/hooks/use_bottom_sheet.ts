import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';
import { INoticeData } from '@features/notice/types/notice_type';
import { useNoticeStore } from '@features/notice/store/notice_store';
import logger from '@utils/logger';

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

    // 저장을 기다리는 동안 진행 중인 새로고침이 공지를 다시 열지 않도록 먼저 닫는다.
    useNoticeStore.setState({ hasDismissedBottomSheet: true });
    setIsVisibleBottomSheet(false);
    setIsNeverShowAgain(true);

    // 상태 초기화하여 즉시 숨김 처리
    setMainBottomSheetData([]);
    try {
      await AsyncStorage.setItem(BOTTOM_SHEET_HIDDEN_KEY, hideUntil.toString());
    } catch (error) {
      logger.error(`[NOTICE] Failed to save dismissal: ${error}`);
    }
  }, [setMainBottomSheetData, setIsVisibleBottomSheet, setIsNeverShowAgain]);

  // 닫기 처리
  const handleClose = useCallback(() => {
    useNoticeStore.setState({ hasDismissedBottomSheet: true });
    setIsVisibleBottomSheet(false);
  }, [setIsVisibleBottomSheet]);

  // 공지사항 표시 가능 여부 확인
  const checkShouldShow = useCallback(async () => {
    const bottomSheetNotices = useNoticeStore.getState().mainBottomSheetData;
    // 데이터가 없으면 표시 안 함
    if (
      bottomSheetNotices.length === 0 ||
      useNoticeStore.getState().hasDismissedBottomSheet
    ) {
      setIsVisibleBottomSheet(false);
      return;
    }

    // 저장된 시간 확인
    let hideUntil: string | null;
    try {
      hideUntil = await AsyncStorage.getItem(BOTTOM_SHEET_HIDDEN_KEY);
    } catch (error) {
      logger.error(`[NOTICE] Failed to read dismissal: ${error}`);
      return;
    }
    // 비동기 저장소 조회 중 닫기 또는 데이터 갱신이 발생했다면 이전 판단은 버린다.
    const currentState = useNoticeStore.getState();
    if (
      currentState.hasDismissedBottomSheet ||
      currentState.mainBottomSheetData !== bottomSheetNotices
    )
      return;
    const now = new Date().getTime();
    const hiddenUntil = Number(hideUntil);
    const shouldShowBottomSheet =
      !Number.isFinite(hiddenUntil) || now >= hiddenUntil;

    setIsNeverShowAgain(!shouldShowBottomSheet);
    setIsVisibleBottomSheet(shouldShowBottomSheet);

    if (hideUntil && shouldShowBottomSheet) {
      await AsyncStorage.removeItem(BOTTOM_SHEET_HIDDEN_KEY);
    }
  }, [setIsNeverShowAgain, setIsVisibleBottomSheet]);

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
