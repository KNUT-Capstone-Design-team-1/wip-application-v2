// 개별 notice 데이터 타입
export interface INoticeData {
  contents: string;
  createDate: string;
  idx: number;
  mustRead: number;
  title: string;
  updateDate: string;
}

// API 응답 타입
export interface INoticeApiResponseItem {
  success: boolean;
  notices: INoticeData[];
  total: number;
}

export interface IInitialNotice {
  noticeData: INoticeData[];
  noticeDetail: INoticeData;
  mainBottomSheetData: INoticeData[];
  isDetailViewing: boolean;
  isNoticeLoading: boolean;
}

export interface INoticeActions {
  actions: {
    setNoticeData: (notices: INoticeData[]) => void;
    setMainBottomSheetData: (state: INoticeData[]) => void;
    setNoticeDetail: (notice: INoticeData) => void;
    setIsDetailViewing: (viewingState: boolean) => void;
    setIsNoticeLoading: (loading: boolean) => void;
  };
}

// NoticeItem.tsx
export interface INoticeListProps {
  noticeData: INoticeData[];
}

export interface INoticeItemProps {
  noticeData: INoticeData;
}

// PrevNextPagination
export interface IPrevNextPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export interface IUsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
}

export interface IUsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  currentData: T[];
  handlePrevious: () => void;
  handleNext: () => void;
  goToPage: (page: number) => void;
}

export interface IBottomSheetProps {
  data: INoticeData[];
  onClose: () => void;
  onNeverShowAgain: () => void;
}
