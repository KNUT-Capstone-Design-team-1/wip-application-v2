import axios from 'axios';
import { getToken } from './google_cloud_token';

interface IPillDataTableSchemaResponse {
  schemaVersion: string;
  columns: [
    {
      name: string;
      type: string;
      size: number; // byte
      nullable: boolean;
      defaultValue: string | number | null;
      isPK: boolean;
    },
  ];
}

/**
 * pill_data 테이블 스키마 요청
 * @returns
 */
export async function requestPillDataTableSchema() {
  const serviceURL = process.env
    .EXPO_PUBLIC_GOOGLE_CLOUD_PILL_DATA_TABLE_SCHEMA_URL as string;

  const token = getToken();

  const result = await axios.get<IPillDataTableSchemaResponse>(serviceURL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return result.data;
}
