import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';
import { INoticeData } from '@features/notice/types/notice_type';
import { useNoticeStore } from '@features/notice/store/notice_store';

const BOTTOM_SHEET_HIDDEN_KEY = 'bottomSheetHiddenUntil';

export const useBottomSheet = () => {
  const [isVisible, setIsVisible] = useState(false);

  const {
    isDetailViewing,
    setIsDetailViewing,
    mainBottomSheetData,
    setMainBottomSheetData,
    isNoticeLoading,
  } = useNoticeStore(
    useShallow((state) => ({
      isDetailViewing: state.isDetailViewing,
      setIsDetailViewing: state.setIsDetailViewing,
      mainBottomSheetData: state.mainBottomSheetData,
      setMainBottomSheetData: state.setMainBottomSheetData,
      isNoticeLoading: state.isNoticeLoading,
    })),
  );

  // 하루 보지 않기 처리
  const handleNeverShowAgain = useCallback(async () => {
    const hideUntil = new Date().getTime() + 24 * 60 * 60 * 1000; // 24시간

    await AsyncStorage.setItem(BOTTOM_SHEET_HIDDEN_KEY, hideUntil.toString());

    // 상태 초기화하여 즉시 숨김 처리
    setMainBottomSheetData([]);

    setIsVisible(false);
  }, [setMainBottomSheetData]);

  // 닫기 처리
  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  // 공지사항 표시 가능 여부 확인
  const checkShouldShow = useCallback(async () => {
    // 이미 상세 보기 중이거나 로딩 중이면 표시 안 함
    if (isDetailViewing || isNoticeLoading) {
      setIsVisible(false);
      return;
    }

    // 데이터가 없으면 표시 안 함
    if (!mainBottomSheetData || mainBottomSheetData.length === 0) {
      setIsVisible(false);
      return;
    }

    // 저장된 시간 확인
    const hideUntil = await AsyncStorage.getItem(BOTTOM_SHEET_HIDDEN_KEY);
    const now = new Date().getTime();
    const shouldShowBottomSheet = !hideUntil || now > parseInt(hideUntil, 10);

    setIsVisible(shouldShowBottomSheet);
  }, [isDetailViewing, isNoticeLoading, mainBottomSheetData]);

  const moveToDetailContent = useCallback(
    (noticeData: INoticeData) => {
      setIsDetailViewing(true);
      handleClose();

      // expo-router를 사용하여 공지사항 상세 화면으로 이동
      router.push({
        pathname: '/notice-detail',
        params: {
          notice: JSON.stringify(noticeData),
        },
      });
    },
    [setIsDetailViewing, handleClose],
  );

  return {
    isVisible,
    mainBottomSheetData,
    handleClose,
    handleNeverShowAgain,
    checkShouldShow,
    moveToDetailContent,
  };
};
