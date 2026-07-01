import React, { useEffect } from 'react';
import BottomSheet from './BottomSheet';
import { useBottomSheet } from '../hooks/use_bottom_sheet';
import { usePathname } from 'expo-router';
import { AppState } from 'react-native';
import { useNotices } from '../hooks/use_notice';
import { useAppStateStore } from '@store/app_state_store';

/**
 * 홈 화면 전용 공지사항 바텀시트 컨트롤러 컴포넌트
 * Layout과의 결합도를 낮추기 위해 데이터 페칭 및 노출 로직을 캡슐화함
 */
const MainNoticeBottomSheet = () => {
  const pathName = usePathname();
  const { getNoticeBottomSheet } = useNotices();
  const {
    isVisibleBottomSheet,
    handleClose,
    handleNeverShowAgain,
    mainBottomSheetData,
    checkShouldShow,
  } = useBottomSheet();

  useEffect(() => {
    getNoticeBottomSheet();
  }, []);

  useEffect(() => {
    checkShouldShow();
  }, [mainBottomSheetData]);

  // 뒤로가기 종료 후 재실행 시 공지사항 데이터 갱신
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        const { isExited, setIsExited } = useAppStateStore.getState();

        if (isExited) {
          getNoticeBottomSheet();

          setIsExited(false);
        }
      }
    });
    return () => {
      subscription.remove();
    };
  }, [getNoticeBottomSheet]);

  // 표시할 데이터가 없으면 렌더링하지 않음
  if (
    pathName !== '/' ||
    !isVisibleBottomSheet ||
    mainBottomSheetData.length === 0
  ) {
    return null;
  }

  return (
    <BottomSheet
      data={mainBottomSheetData}
      onClose={handleClose}
      onNeverShowAgain={handleNeverShowAgain}
    />
  );
};

export default MainNoticeBottomSheet;
