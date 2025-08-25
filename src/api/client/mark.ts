// @api/client/mark.ts
import { apiClient } from '@api/apiClient.ts';
import Config from 'react-native-config';
import { TMarkDataResponse } from '@/types/TApiType.ts';

const getMarkData = async (title: string, limit: number, page: number) => {
  const response: TMarkDataResponse = await apiClient.get(
    `${Config.GOOGLE_CLOUD_MARK_IMAGE_URL}?page=${page}&limit=${limit}&title=${encodeURIComponent(title)}`,
  );

  return response.data;
};

export default getMarkData;
