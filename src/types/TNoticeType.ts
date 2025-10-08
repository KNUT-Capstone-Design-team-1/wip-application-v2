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
  meta: {
    changed_db: boolean;
    changes: number;
    duration: number;
    last_row_id: number;
    rows_read: number;
    rows_written: number;
    served_by: string;
    served_by_primary: boolean;
    served_by_region: string;
    size_after: number;
    timings: Record<string, any>;
    total_attempts: number;
  };
  results: INoticeData[];
  success: boolean;
}
