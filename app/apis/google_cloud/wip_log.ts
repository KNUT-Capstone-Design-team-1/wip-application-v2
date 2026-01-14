import axios from 'axios';
import { getToken } from './google_cloud_token';
import { TLogLevel } from '../../constants/types';

/**
 * 로그 서버에 로그 기록 요청
 * @param logLevel 로그 레벨
 * @param logContents 로그 내용
 */
export const requestWriteLog = async (
  logLevel: TLogLevel,
  logContents: string,
) => {
  const serviceURL = process.env
    .EXPO_PUBLIC_GOOGLE_CLOUD_PLATFORM_WIP_LOG_URL as string;

  const token = getToken();

  await axios.post(
    serviceURL,
    { logLevel, logContents },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
};
