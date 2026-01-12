import axios from 'axios';
import { getToken } from './google_cloud_token';
import { IPillData } from '../../types/pill_data';

interface IPillDataResourceResponse {
  resourceVersion: string;
  datas: IPillData[];
  total: number;
}

/**
 * pill_data 테이블 원천 데이터 요청
 * @param page 페이지
 * @returns
 */
export async function requestPillDataResource(page: number) {
  const serviceURL = process.env
    .EXPO_PUBLIC_GOOGLE_CLOUD_PILL_DATA_RESOURCE_URL as string;

  const token = getToken();

  const result = await axios.get<IPillDataResourceResponse>(serviceURL, {
    params: { page },
    headers: { Authorization: `Bearer ${token}` },
  });

  return result.data;
}
