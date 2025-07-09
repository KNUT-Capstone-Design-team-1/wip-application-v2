import axios from 'axios';
import Config from 'react-native-config';
import { getToken } from './auth';

const getDBInfo = async () => {
  const token = getToken();

  const res = await axios.get(Config.GOOGLE_CLOUD_INIT_INFO_URL as string, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export { getDBInfo };
