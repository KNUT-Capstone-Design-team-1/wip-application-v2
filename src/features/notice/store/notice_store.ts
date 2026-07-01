import { create } from 'zustand';
import { INoticeStore } from '@features/notice/types/notice_type';

/**
 * 공지사항 상태 관리 스토어
 */
export const useNoticeStore = create<INoticeStore>((set) => ({
  noticeData: [], // 전체 공지사항 목록
  mainBottomSheetData: [], // 홈 화면 바텀시트에 표시될 필독 공지사항 목록
  noticeDetail: null, // 현재 선택된 공지사항 상세 데이터
  isNoticeLoading: false, // 공지사항 데이터 로딩 상태
  isVisibleBottomSheet: false, // 홈 화면 바텀시트 표시 여부
  isNeverShowAgain: false, // 하루 동안 보지 않기 상태

  /**
   * 전체 공지사항 목록 설정
   */
  setNoticeData: (noticeData) => set({ noticeData }),

  /**
   * 홈 화면 바텀시트용 공지사항 설정
   */
  setMainBottomSheetData: (mainBottomSheetData) => set({ mainBottomSheetData }),

  /**
   * 공지사항 상세 데이터 설정
   */
  setNoticeDetail: (noticeDetail) => set({ noticeDetail }),

  /**
   * 공지사항 데이터 로딩 상태 설정
   */
  setIsNoticeLoading: (isNoticeLoading) => set({ isNoticeLoading }),

  /**
   * 바텀시트 표시 상태 변경
   */
  setIsVisibleBottomSheet: (isVisibleBottomSheet) =>
    set({ isVisibleBottomSheet }),

  /**
   * 하루 동안 보지 않기 상태 변경
   */
  setIsNeverShowAgain: (isNeverShowAgain) => set({ isNeverShowAgain }),
}));
