import { create } from 'zustand';
import { INoticeStore } from '@features/notice/types/notice_type';

/**
 * 공지사항 상태 관리 스토어
 */
export const useNoticeStore = create<INoticeStore>((set) => ({
  noticeData: [], // 전체 공지사항 목록
  mainBottomSheetData: [], // 홈 화면 바텀시트에 표시될 필독 공지사항 목록
  noticeDetail: null, // 현재 선택된 공지사항 상세 데이터
  isDetailViewing: false, // 공지사항 상세 화면 표시 여부
  isNoticeLoading: true, // 공지사항 로딩 상태

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
   * 공지사항 상세 화면 표시 상태 변경
   */
  setIsDetailViewing: (isDetailViewing) => set({ isDetailViewing }),

  /**
   * 로딩 상태 변경
   */
  setIsNoticeLoading: (isNoticeLoading) => set({ isNoticeLoading }),
}));
