import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { INoticeData } from '@/types/TNoticeType';
  import { useNoticeStore } from '@store/noticeStore';
import { useShallow } from 'zustand/react/shallow';

const HIDE_NOTICE_KEY = 'hideNoticeUntil';

export const useBottomSheet = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigation: any = useNavigation();
  const [isNoticeViewing, setIsNoticeViewing] = useNoticeStore(
    useShallow((state) => [
      state.isDetailViewing,
      state.actions.setIsDetailViewing,
    ]),
  );

  // 다신 보지 않기 처리
  const handleNeverShowAgain = async () => {
    // const tomorrow = new Date().getTime() + 24 * 60 * 60 * 1000;
    const tomorrow = new Date().getTime() + 20000;
    await AsyncStorage.setItem(HIDE_NOTICE_KEY, tomorrow.toString());
    setIsVisible(false);
  };

  // 닫기 처리
  const handleClose = () => {
    setIsVisible(false);
  };

  // 공지사항 표시 가능 여부 확인
  const checkShouldShow = async (hasData: boolean) => {
    if (!hasData || isNoticeViewing) {
      setIsVisible(false);
      return;
    }

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
