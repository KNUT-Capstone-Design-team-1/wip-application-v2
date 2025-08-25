// 마크 데이터 타입
export interface TMarkData {
  code: string;
  base64: string;
}

export interface TMarkDataResponse {
  total: number;
  totalPage: number;
  page: string;
  limit: string;
  data: TMarkData[];
}
