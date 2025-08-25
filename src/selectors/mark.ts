import { apiClient } from '@api/apiClient.ts';
import { TMarkData, TMarkDataResponse } from '@/types/TApiType.ts';
import Config from 'react-native-config';
import { selectorFamily } from 'recoil';

export const markDataSelector = selectorFamily<
  TMarkData[],
  { title: string; page: number; limit: number }
>({
  key: 'markDataSelector',
  get:
    ({ title, page, limit }: { title: string; page: number; limit: number }) =>
    async () => {
      const response = await apiClient.get<TMarkDataResponse>(
        `${Config.GOOGLE_CLOUD_MARK_IMAGE_URL}?page=${page}&limit=${limit}&title=${encodeURIComponent(title)}`,
      );

      console.log("data", response.data);

      return response.data;
    },
});
