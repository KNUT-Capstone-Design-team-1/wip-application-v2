import axios from 'axios';
import { getToken } from './google_cloud_token';

interface IDatabaseVersionResponse {
  schemaVersion: number; // 스키마 버전
  dataVersion: number; // 데이터베이스 버전
}

/**
 * 데이터베이스 버전 조회 요청
 * @returns
 */
export async function requestDatabaseVersion() {
  const serviceURL = process.env
    .EXPO_PUBLIC_GOOGLE_CLOUD_DATA_BASE_VERSION_URL as string;

  const token = getToken();

  const result = await axios.get<IDatabaseVersionResponse>(serviceURL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return result.data;
}
