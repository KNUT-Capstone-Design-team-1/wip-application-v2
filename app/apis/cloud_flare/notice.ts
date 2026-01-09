import axios from 'axios';

type TNotice = {
  title: string;
  contents: string;
  mustRead: boolean;
  createDate: string;
  updateDate: string;
};

type TNoticeList = {
  success: boolean;
  notices: TNotice[];
  total: number;
}[];

type TNoticeWritePayload = Pick<TNotice, 'title' | 'contents' | 'mustRead'>;

const axiosInstance = axios.create({
  baseURL: process.env
    .EXPO_PUBLIC_CLOUD_FLARE_WORKERS_NOTICES_API_URL as string,
  headers: {
    Authorization: `Bearer ${process.env.CLOUD_FLARE_WORKERS_TOKEN as string}`,
  },
});

/**
 * 공지사항 작성
 * @param contents 공지사항 내용
 * @returns
 */
export const requestCreateNotice = async (contents: TNoticeWritePayload) => {
  const response = await axiosInstance.post<'Created'>(`/notices`, contents, {
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data;
};

/**
 * 공지사항 목록 조회
 * @param skip 페이지
 * @param limit 페이지 내 공지사항 개수
 * @param mustRead 필독 여부
 * @returns
 */
export const requestReadNotices = async (
  skip?: number,
  limit?: number,
  mustRead?: boolean,
) => {
  const response = await axiosInstance.get<TNoticeList>(`/notices`, {
    params: { skip, limit, mustRead },
  });

  return response.data;
};

/**
 * 공지사항 수정
 * @param idx 공지사항 ID
 * @param contents 공지사항 내용
 * @returns
 */
export const requestUpdateNotice = async (
  idx: number,
  contents: TNoticeWritePayload,
) => {
  const response = await axiosInstance.put<'Success'>(
    `/notices/${idx}`,
    contents,
    { headers: { 'Content-Type': 'application/json' } },
  );

  return response.data;
};

/**
 * 공지사항 삭제
 * @param idx 공지사항 ID
 * @returns
 */
export const requestDeleteNotice = async (idx: number) => {
  const response = await axiosInstance.delete<'Success'>(`/notices/${idx}`);

  return response.data;
};
