import { LogAPI } from '../apis/google_cloud';
import { TLogLevel } from '../constants/types';

/**
 * 로그 서버에 로그 기록 요청
 * @param logLevel 로그 레벨
 * @param logContents 로그 내용
 */
const writeLog = async (logLevel: TLogLevel, logContents: string) => {
  try {
    await LogAPI.requestWriteLog(logLevel, logContents);
  } catch (e) {
    console.log(`Failed to write log. %s`, (e as Error)?.stack || e);
  }
};

/**
 * 로그 기록을 위한 로거
 */
const logger = {
  info: (contents: string) => {
    writeLog('info', contents);
  },
  warn: (contents: string) => {
    writeLog('warn', contents);
  },
  error: (contents: string) => {
    writeLog('error', contents);
  },
};

export default logger;
