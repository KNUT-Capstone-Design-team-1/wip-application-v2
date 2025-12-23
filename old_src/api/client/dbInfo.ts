import { apiClient } from '@api/apiClient';

interface IInitInfo {
  appStoreVersion: null | string;
  playStoreVersion: null | string;
  resourceDate: string;
}

const getDBInfo = async () => {
  return await apiClient.get<IInitInfo>(
    process.env.EXPO_PUBLIC_GOOGLE_CLOUD_INIT_INFO_URL as string,
  );
};

export { getDBInfo };
