import { apiClient } from '@api/apiClient';
import { AxiosRequestConfig } from 'axios';

const postImageServer = (
  base64: string | undefined,
  config?: AxiosRequestConfig,
) => {
  return apiClient.post(
    process.env.EXPO_PUBLIC_GOOGLE_CLOUD_DL_SERVER_URL as string,
    {
      base64,
    },
    config,
  );
};

const getDrugDetail = (URL: string, ITEM_SEQ: string) => {
  return apiClient.get(URL, { ITEM_SEQ: ITEM_SEQ });
};

export { postImageServer, getDrugDetail };
