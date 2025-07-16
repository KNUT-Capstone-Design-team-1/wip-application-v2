import Config from 'react-native-config';
import { apiClient } from '@api/apiClient.ts';

interface IInitInfo {
  appStoreVersion: null | string;
  playStoreVersion: null | string;
  resourceDate: string;
}

const getDBInfo = async () => {
  return await apiClient.get<IInitInfo>(
    Config.GOOGLE_CLOUD_INIT_INFO_URL as string,
  );
};

export { getDBInfo };
