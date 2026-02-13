import axios from 'axios';
import { getToken } from './token';

interface INotice {
  title: string;
  contents: string;
  mustRead: boolean;
  createDate: string;
  updateDate: string;
}

type TNoticeList = {
  success: boolean;
  notices: INotice[];
  total: number;
}[];

type TNoticeWritePayload = Pick<INotice, 'title' | 'contents' | 'mustRead'>;

/**
 * axios 인스턴스 반환 (env 로드 문제로 인해 함수로 분리)
 * @returns
 */
const getAxiosInstance = () => {
  return axios.create({
    baseURL: process.env.EXPO_PUBLIC_CLOUD_FLARE_WIP_NOTICE_URL as string,
  });
};

/**
 * 공지사항 작성
 * @param contents 공지사항 내용
 * @returns
 */
export const requestCreateNotice = async (contents: TNoticeWritePayload) => {
  const token = await getToken();

  const response = await getAxiosInstance().post<'Created'>(
    `/notices`,
    contents,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    },
  );

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
  const token = await getToken();

  const response = await getAxiosInstance().get<TNoticeList>(`/notices`, {
    params: { skip, limit, mustRead },
    headers: { 'x-auth-token': token },
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
  const token = await getToken();

  const response = await getAxiosInstance().put<'Success'>(
    `/notices/${idx}`,
    contents,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    },
  );

  return response.data;
};

/**
 * 공지사항 삭제
 * @param idx 공지사항 ID
 * @returns
 */
export const requestDeleteNotice = async (idx: number) => {
  const token = await getToken();

  const response = await getAxiosInstance().delete<'Success'>(
    `/notices/${idx}`,
    {
      headers: { 'x-auth-token': token },
    },
  );

  return response.data;
};
