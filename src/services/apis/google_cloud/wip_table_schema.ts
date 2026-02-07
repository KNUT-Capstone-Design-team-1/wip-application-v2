import axios from 'axios';
import { getToken } from './google_cloud_token';
import { ITableColumnSchema, TTable } from '../../database/types';

interface ITableSchemaResponse {
  columns: ITableColumnSchema[];
}

/**
 * 테이블 스키마 요청
 * @returns
 */
export async function requestTableSchema(table: TTable) {
  const serviceURL = process.env
    .EXPO_PUBLIC_GOOGLE_CLOUD_PLATFORM_WIP_TABLE_SCHEMA_URL as string;

  const token = getToken();

  const result = await axios.get<ITableSchemaResponse>(serviceURL, {
    headers: { Authorization: `Bearer ${token}` },
    params: { table },
  });

  return result.data;
}
