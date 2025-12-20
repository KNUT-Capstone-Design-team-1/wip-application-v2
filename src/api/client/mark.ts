// @api/client/mark.ts
import { apiClient } from '@api/apiClient';
import type { TMarkDataResponse } from '@/types/TApiType';

/*
  - 재시도 로직 잠시 주석 처리 api 호출 실패 시 앱 다시 실행시키는 방향으로 수정
*/

const getMarkData = async (
  title: string, // 마크 이름
  limit: number, // 호출 개수
  page: number, // 선택된 pagination
) => {
  const response: TMarkDataResponse = await apiClient.get(
    `${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_MARK_IMAGE_URL}?page=${page}&limit=${limit}&title=${encodeURIComponent(title)}`,
  );

  return {
    pages: response.totalPage,
    markData: response.data,
  };
};

export default getMarkData;
