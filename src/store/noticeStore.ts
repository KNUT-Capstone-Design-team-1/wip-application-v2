import { create } from 'zustand';
import { INoticeData } from '@/types/TNoticeType';

interface IInitialNotice {
  noticeData: INoticeData[];
  noticeDetail: INoticeData;
  mainBottomSheetState: boolean;
}

interface INoticeActions {
  actions: {
    setNoticeData: (notices: INoticeData[]) => void;
    setNoticeDetail: (notice: INoticeData) => void;
    setMainButtonSheetState: (state: boolean) => void;
  };
}

const initialNotice: IInitialNotice = {
  noticeData: [],
  noticeDetail: {} as INoticeData,
  mainBottomSheetState: false,
};

// export const useCountStore = create<State & Actions>(set => ({
export const useNoticeStore = create<IInitialNotice & INoticeActions>(set => ({
    ...initialNotice,
    actions: {
      setNoticeData: (noticeData) => set({ noticeData: noticeData }),
      setNoticeDetail: (noticeDetail) => set({ noticeDetail: noticeDetail }),
      setMainButtonSheetState: (mainBottomSheetState) =>
        set({ mainBottomSheetState: mainBottomSheetState }),
    },
}));
