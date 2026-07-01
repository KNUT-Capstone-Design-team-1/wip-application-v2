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

export interface INoticeStore {
  // State
  noticeData: INoticeData[];
  noticeDetail: INoticeData | null;
  mainBottomSheetData: INoticeData[];
  isNoticeLoading: boolean;
  isVisibleBottomSheet: boolean; // 바텀시트 표시 여부
  isNeverShowAgain: boolean;

  // Actions
  setNoticeData: (notices: INoticeData[]) => void;
  setMainBottomSheetData: (state: INoticeData[]) => void;
  setNoticeDetail: (notice: INoticeData | null) => void;
  setIsNoticeLoading: (loadingState: boolean) => void;
  setIsVisibleBottomSheet: (visible: boolean) => void;
  setIsNeverShowAgain: (show: boolean) => void;
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

export interface INotItemProps {
  mainText: string;
  subText: string;
  marginTop?: string;
  height?: string;
}
