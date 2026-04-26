import axios from 'axios';
import { getToken } from './google_cloud_token';

export interface IExternalURLResponse {
  kada: string;
}

/**
 * 외부 URL 조회 요청
 * @returns
 */
export async function requestExternalURL() {
  const serviceURL = process.env
    .EXPO_PUBLIC_GOOGLE_CLOUD_PLATFORM_WIP_EXTERNAL_URL as string;

  const token = getToken();

  const result = await axios.get<IExternalURLResponse>(serviceURL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return result.data;
}
