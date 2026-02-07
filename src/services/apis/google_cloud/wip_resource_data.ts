import axios, { isAxiosError } from 'axios';
import { getToken } from './google_cloud_token';
import {
  IMarkImages,
  INearbyPharmacies,
  IPillData,
  TTable,
} from '../../database/types';
import { logger } from '../../../utils';

type TResourceDataSchemas = IPillData | IMarkImages | INearbyPharmacies;
export interface IResourceDataResponse<T extends TResourceDataSchemas> {
  resource: T[]; // API는 'resource' 필드 사용
  total: number;
  totalPage: number;
  current: number;
}

/**
 * pill_data 테이블 원천 데이터 요청
 * @param page 페이지
 * @returns
 */
export async function requestResourceData<T extends TResourceDataSchemas>(
  table: TTable,
  page: number,
) {
  const serviceURL = process.env
    .EXPO_PUBLIC_GOOGLE_CLOUD_PLATFORM_WIP_RESOURCE_DATA_URL as string;

  const token = getToken();

  try {
    const result = await axios.get<IResourceDataResponse<T>>(serviceURL, {
      params: { table, page },
      headers: { Authorization: `Bearer ${token}` },
    });

    return result.data;
  } catch (error) {
    if (isAxiosError(error)) {
      logger.error(
        `API Error: ${JSON.stringify({
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        })}`,
      );
    }
    throw error;
  }
}
