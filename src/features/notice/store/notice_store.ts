import { create } from 'zustand';
import {
  IInitialNotice,
  INoticeActions,
  INoticeData,
} from '../types/notice_type';

const initialNotice: IInitialNotice = {
  noticeData: [],
  mainBottomSheetData: [],
  noticeDetail: {} as INoticeData,
  isDetailViewing: false,
  isNoticeLoading: true,
};

export const useNoticeStore = create<IInitialNotice & INoticeActions>(
  (set) => ({
    ...initialNotice,
    actions: {
      setNoticeData: (noticeData) => set({ noticeData: noticeData }),
      setMainBottomSheetData: (mainBottomSheetData) =>
        set({ mainBottomSheetData: mainBottomSheetData }),
      setNoticeDetail: (noticeDetail) => set({ noticeDetail: noticeDetail }),
      setIsDetailViewing: (viewingState: boolean) =>
        set({ isDetailViewing: viewingState }),
      setIsNoticeLoading: (loading: boolean) =>
        set({ isNoticeLoading: loading }),
    },
  }),
);
