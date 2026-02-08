import axios from 'axios';
import { getToken } from './google_cloud_token';

interface IDatabaseVersion {
  schemaVersion: number; // 스키마 버전
  dataVersion: number; // 데이터베이스 버전
}

export interface IDatabaseVersionResponse {
  pill_data: IDatabaseVersion;
  mark_images: IDatabaseVersion;
  nearby_pharmacies: IDatabaseVersion;
}

/**
 * 데이터베이스 버전 조회 요청 (모든 데이터베이스 버전을 가져옴)
 * @returns
 */
export async function requestDatabaseVersion() {
  const serviceURL = process.env
    .EXPO_PUBLIC_GOOGLE_CLOUD_PLATFORM_WIP_DATABASE_VERSION_URL as string;

  const token = getToken();

  const result = await axios.get<IDatabaseVersionResponse>(serviceURL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return result.data;
}
