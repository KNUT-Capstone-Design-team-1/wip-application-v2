import logger from './logger';

export { logger };

/**
 * base64를 binary로 변환 (BLOB)
 * @param base64 base64 string
 * @returns
 */
export const base64ToBinary = (base64: string): string => {
  const binary = atob(base64);
  let result = '';

  for (let i = 0; i < binary.length; i++) {
    result += String.fromCharCode(binary.charCodeAt(i));
  }

  return result;
};

/**
 * binary (BLOB)를 base64로 변환
 * @param binary 바이너리 string
 * @param mime 이미지 포맷
 * @returns
 */
export const binaryToBase64 = (binary: string, mime = 'image/gif') => {
  const base64 = btoa(binary);

  return `data:${mime};base64,${base64}`;
};
