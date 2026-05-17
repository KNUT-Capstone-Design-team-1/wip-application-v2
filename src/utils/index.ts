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
export const binaryToBase64 = (uint8ArrayString: string) => {
  const base64 = Buffer.from(uint8ArrayString).toString('base64');

  return `data:image/gif;base64,${base64}`;
};
