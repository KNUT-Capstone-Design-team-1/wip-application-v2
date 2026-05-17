import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { INoticeData } from '../types/notice_type';
import { useNoticeStore } from '../store/notice_store';
import { useShallow } from 'zustand/react/shallow';

const BOTTOM_SHEET_HIDDEN_KEY = 'bottomSheetHiddenUntil';

export const useBottomSheet = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [
    isNoticeViewing,
    setIsNoticeViewing,
    mainBottomSheetData,
    isNoticeLoading,
    actions,
  ] = useNoticeStore(
    useShallow((state) => [
      state.isDetailViewing,
      state.actions.setIsDetailViewing,
      state.mainBottomSheetData,
      state.isNoticeLoading,
      state.actions,
    ]),
  );

  // 하루 보지 않기 처리
  const handleNeverShowAgain = async () => {
    // 24시간 (24 * 60 * 60 * 1000ms)
    const hideUntil = new Date().getTime() + 24 * 60 * 60 * 1000;
    await AsyncStorage.setItem(BOTTOM_SHEET_HIDDEN_KEY, hideUntil.toString());

    // 상태 초기화하여 즉시 숨김 처리
    actions.setMainBottomSheetData([]);
    setIsVisible(false);
  };

  // 닫기 처리
  const handleClose = () => {
    setIsVisible(false);
  };

  // 공지사항 표시 가능 여부 확인
  const checkShouldShow = async () => {
    // 이미 상세 보기 중이거나 로딩 중이면 표시 안 함
    if (isNoticeViewing || isNoticeLoading) {
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
  };

  const moveToDetailContent = (noticeData: INoticeData) => {
    setIsNoticeViewing(true);
    handleClose();

    // expo-router를 사용하여 공지사항 상세 화면으로 이동
    router.push({
      pathname: '/notice-detail',
      params: {
        notice: JSON.stringify(noticeData),
      },
    });
  };

  return {
    isVisible,
    handleClose,
    handleNeverShowAgain,
    checkShouldShow,
    moveToDetailContent,
  };
};
