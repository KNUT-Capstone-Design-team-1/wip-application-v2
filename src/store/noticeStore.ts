import { create } from 'zustand';
import { INoticeData } from '@/types/TNoticeType';

interface IInitialNotice {
  noticeData: INoticeData[];
  noticeDetail: INoticeData;
  mainBottomSheetData: INoticeData[];
  isDetailViewing: boolean;
}

interface INoticeActions {
  actions: {
    setNoticeData: (notices: INoticeData[]) => void;
    setMainBottomSheetData: (state: INoticeData[]) => void;
    setNoticeDetail: (notice: INoticeData) => void;
    setIsDetailViewing: (viewingState: boolean) => void;
  };
}

const initialNotice: IInitialNotice = {
  noticeData: [],
  mainBottomSheetData: [],
  noticeDetail: {} as INoticeData,
  isDetailViewing: false,
};

export const useNoticeStore = create<IInitialNotice & INoticeActions>(set => ({
    ...initialNotice,
    actions: {
      setNoticeData: (noticeData) => set({ noticeData: noticeData }),
      setMainBottomSheetData: (mainBottomSheetData) =>
        set({ mainBottomSheetData: mainBottomSheetData }),
      setNoticeDetail: (noticeDetail) => set({ noticeDetail: noticeDetail }),
      setIsDetailViewing: (viewingState: boolean) => set({ isDetailViewing: viewingState }),
    },
}));
