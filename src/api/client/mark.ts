// @api/client/mark.ts
import { apiClient } from '@api/apiClient';
import { TMarkDataResponse } from '@/types/TApiType';

const getMarkData = async (title: string, limit: number, page: number) => {
  try {
    const response: TMarkDataResponse = await apiClient.get(
      `${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_MARK_IMAGE_URL}?page=${page}&limit=${limit}&title=${encodeURIComponent(title)}`,
    );

    return {
      pages: response.totalPage,
      markData: response.data,
    };
  } catch (e) {
    console.log(e);
  }
};

export default getMarkData;
