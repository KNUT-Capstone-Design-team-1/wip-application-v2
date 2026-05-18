import { LogAPI } from '../services/apis/google_cloud';
import { TLogLevel } from '../constants';

/**
 * 로그 서버에 로그 기록 요청
 * @param logLevel 로그 레벨
 * @param logContents 로그 내용
 */
const writeLog = async (logLevel: TLogLevel, logContents: string) => {
  try {
    console.log(`[${logLevel}] ${logContents}`);
    await LogAPI.requestWriteLog(logLevel, logContents);
  } catch (e) {
    console.log(`Failed to write log. ${e?.stack || e}`);
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
