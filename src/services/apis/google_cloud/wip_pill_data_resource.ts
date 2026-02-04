import axios, { isAxiosError } from 'axios';
import { getToken } from './google_cloud_token';
import { IPillData } from '../../database/types';

export interface IPillDataResourceResponse {
  resource: IPillData[]; // API는 'resource' 필드 사용
  total: number;
  totalPage: number;
  current: number;
}

/**
 * pill_data 테이블 원천 데이터 요청
 * @param page 페이지
 * @returns
 */
export async function requestPillDataResource(page: number) {
  const serviceURL = process.env
    .EXPO_PUBLIC_GOOGLE_CLOUD_PLATFORM_WIP_PILL_DATA_RESOURCE_URL as string;

  const token = getToken();

  try {
    const result = await axios.get<IPillDataResourceResponse>(serviceURL, {
      params: { page },
      headers: { Authorization: `Bearer ${token}` },
    });

    return result.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
}
