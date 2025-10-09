import { create } from 'zustand';
import { INoticeData } from '@/types/TNoticeType';

interface IInitialNotice {
  noticeData: INoticeData[];
  noticeDetail: INoticeData;
  mainBottomSheetData: INoticeData[];
}

interface INoticeActions {
  actions: {
    setNoticeData: (notices: INoticeData[]) => void;
    setMainBottomSheetData: (state: INoticeData[]) => void;
    setNoticeDetail: (notice: INoticeData) => void;
  };
}

const initialNotice: IInitialNotice = {
  noticeData: [],
  mainBottomSheetData: [],
  noticeDetail: {} as INoticeData,
};

export const useNoticeStore = create<IInitialNotice & INoticeActions>(set => ({
    ...initialNotice,
    actions: {
      setNoticeData: (noticeData) => set({ noticeData: noticeData }),
      setMainBottomSheetData: (mainBottomSheetData) =>
        set({ mainBottomSheetData: mainBottomSheetData }),
      setNoticeDetail: (noticeDetail) => set({ noticeDetail: noticeDetail }),
    },
}));
