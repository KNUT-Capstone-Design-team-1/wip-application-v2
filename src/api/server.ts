import Config from 'react-native-config';
import { apiClient } from '@api/apiClient.ts';

const postImageServer = (base64: string | undefined) => {
  return apiClient.post(Config.GOOGLE_CLOUD_DL_SERVER_URL as string, {
    base64,
  });
};

const getDrugDetail = (URL: string, ITEM_SEQ: string) => {
  return apiClient.get(URL, { ITEM_SEQ: ITEM_SEQ });
};

export { postImageServer, getDrugDetail };
