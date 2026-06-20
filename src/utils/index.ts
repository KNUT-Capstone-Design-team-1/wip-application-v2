import { Buffer } from 'buffer';
import logger from './logger';

export { logger };

/**
 * base64를 binary string으로 변환
 * @param base64 base64 string
 * @returns
 */
export const base64ToUint8Array = (base64: string) => {
  const pureBase64 = base64.includes(',') ? base64.split(',')[1] : base64;

  const binaryString = atob(pureBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i) & 0xff;
  }

  return bytes;
};

/**
 * binary string을 base64로 변환
 * @param uint8ArrayString 바이너리 string
 * @returns
 */
export const binaryToBase64 = (data: any) => {
  if (!data) return '';

  // 이미 base64 data URI 형태인 경우
  if (typeof data === 'string' && data.startsWith('data:image')) {
    return data;
  }

  let base64 = '';
  try {
    // RN 환경의 Buffer 폴리필에서 Uint8Array/ArrayBuffer 처리에 문제가 있을 수 있으므로 방어 코드 추가
    if (typeof data === 'object' && !Buffer.isBuffer(data)) {
      const uint8Array = new Uint8Array(data);
      base64 = Buffer.from(uint8Array).toString('base64');
    } else {
      base64 = Buffer.from(data).toString('base64');
    }
  } catch (error) {
    logger.error(`binaryToBase64 conversion error: ${error}`);
    return '';
  }

  return `data:image/gif;base64,${base64}`;
};
