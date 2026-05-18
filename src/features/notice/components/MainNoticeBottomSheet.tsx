import React, { useEffect } from 'react';
import BottomSheet from './BottomSheet';
import { useNotices } from '../hooks/use_notice';
import { useBottomSheet } from '../hooks/use_bottom_sheet';

/**
 * 홈 화면 전용 공지사항 바텀시트 컨트롤러 컴포넌트
 * Layout과의 결합도를 낮추기 위해 데이터 페칭 및 노출 로직을 캡슐화함
 */
const MainNoticeBottomSheet = () => {
  const { getNoticeBottomSheet } = useNotices();
  const {
    isVisible,
    checkShouldShow,
    handleClose,
    handleNeverShowAgain,
    mainBottomSheetData,
  } = useBottomSheet();

  // 1. 초기 데이터 로드 (캐시 확인 및 API 호출)
  useEffect(() => {
    getNoticeBottomSheet();
  }, [getNoticeBottomSheet]);

  // 2. 데이터가 로드되거나 변경될 때 표시 여부 재계산
  useEffect(() => {
    checkShouldShow();
  }, [mainBottomSheetData, checkShouldShow]);

  // 표시할 데이터가 없으면 렌더링하지 않음
  if (!isVisible || mainBottomSheetData.length === 0) {
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
