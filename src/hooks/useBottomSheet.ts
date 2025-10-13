import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { INoticeData } from '@/types/TNoticeType';

const HIDE_NOTICE_KEY = 'hideNoticeUntil';

export const useBottomSheet = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigation: any = useNavigation();

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
    if (!hasData) {
      setIsVisible(false);
      return;
    }

    const hideUntil = await AsyncStorage.getItem(HIDE_NOTICE_KEY);
    const now = new Date().getTime();

    if (!hideUntil || now > parseInt(hideUntil)) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const moveToDetailContent = (noticeData: INoticeData) => {
    navigation.navigate('공지사항 상세', { notice: noticeData });
  };

  return {
    isVisible,
    handleClose,
    handleNeverShowAgain,
    checkShouldShow,
    moveToDetailContent,
  };
};
