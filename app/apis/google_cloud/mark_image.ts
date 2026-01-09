import axios from 'axios';
import { getToken } from './google_cloud_token';

type TMarkImageData = {
  total: number; // 마크이미지 총 개수
  totalPage: number; // 총 페이지
  page: number; // 현재 페이지
  limit: number; // 현재 페이지당 개수
  data: {
    title: string; // 마크 이름
    code: string; // 마크 코드
    base64: string; // 마크 이미지
  }[]; // 데이터
};

/**
 * 마크 이미지 조회 요청
 * @param page 페이지
 * @param limit 페이지 당 마크 이미지 개수
 * @param title 마크 이미지 이름
 * @returns
 */
export const requestGetMarkImage = async (
  page: number,
  limit: number,
  title?: string,
) => {
  const serviceURL = process.env
    .EXPO_PUBLIC_GOOGLE_CLOUD_MARK_IMAGE_URL as string;

  const token = getToken();

  const result = await axios.get<TMarkImageData>(serviceURL, {
    params: { page, limit, title },
    headers: { Authorization: `Bearer ${token}` },
  });

  return result.data;
};
