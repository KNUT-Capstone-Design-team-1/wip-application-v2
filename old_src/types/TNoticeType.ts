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
