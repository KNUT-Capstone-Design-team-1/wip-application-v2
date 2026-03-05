import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { INoticeData } from '../types/notice_type';
import { useNoticeStore } from '../store/notice_store';
import { useShallow } from 'zustand/react/shallow';

const HIDE_NOTICE_KEY = 'hideNoticeUntil';

export const useBottomSheet = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigation: any = useNavigation();
  const [
    isNoticeViewing,
    setIsNoticeViewing,
    mainBottomSheetData,
    isNoticeLoading,
  ] = useNoticeStore(
    useShallow((state) => [
      state.isDetailViewing,
      state.actions.setIsDetailViewing,
      state.mainBottomSheetData,
      state.isNoticeLoading,
    ]),
  );

  // 하루 보지 않기 처리
  const handleNeverShowAgain = async () => {
    const tomorrow = new Date().getTime() + 24 * 60 * 60 * 1000;
    // test 용
    // const tomorrow = new Date().getTime() + 20000;
    await AsyncStorage.setItem(HIDE_NOTICE_KEY, tomorrow.toString());
    setIsVisible(false);
  };

  // 닫기 처리
  const handleClose = () => {
    setIsVisible(false);
  };

  // 공지사항 표시 가능 여부 확인
  const checkShouldShow = async () => {
    // 이미 상세 보기 중이면 표시 안 함
    if (isNoticeViewing) {
      setIsVisible(false);
      return;
    }

    // 로딩 중이면 표시 안 함 (데이터 로딩 완료 후에만 표시)
    if (isNoticeLoading) {
      setIsVisible(false);
      return;
    }

    // 로딩 완료 후 데이터가 없으면 표시 안 함
    if (!mainBottomSheetData || mainBottomSheetData.length === 0) {
      setIsVisible(false);
      return;
    }

    // 데이터가 있으면 표시 여부 확인
    const hideUntil = await AsyncStorage.getItem(HIDE_NOTICE_KEY);
    const now = new Date().getTime();
    const shouldShowBottomSheet = !hideUntil || now > parseInt(hideUntil, 10);

    setIsVisible(shouldShowBottomSheet);
  };

  const moveToDetailContent = (noticeData: INoticeData) => {
    setIsNoticeViewing(true);
    handleClose();

    // SettingsStack으로 이동하면서 공지사항 상세 화면을 열되,
    // 뒤로가기 시 공지사항 화면으로 갈 수 있도록 초기 라우트 설정
    navigation.reset({
      index: 1,
      routes: [
        { name: 'HomeStack' },
        {
          name: 'SettingsStack',
          state: {
            routes: [
              { name: '공지사항' },
              { name: '공지사항 상세', params: { notice: noticeData } },
            ],
            index: 2,
          },
        },
      ],
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
