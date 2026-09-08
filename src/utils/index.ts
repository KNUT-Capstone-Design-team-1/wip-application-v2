import logger from './logger';

export { logger };

const BASE64_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

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
 * Uint8Array 바이너리를 Base64 문자열로 변환 (순수 Lookup Table)
 * - 외부 라이브러리(Buffer) 및 btoa 없이 비트 시프트 연산으로 O(1) 매핑
 * - 중간 바이너리 문자열 생성을 배제하여 메모리 복제 최소화
 * @param bytes 변환할 Uint8Array
 * @returns Base64 인코딩 문자열
 */
export const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
  const len = bytes.length;
  if (len === 0) return '';

  const extraBytes = len % 3;
  const parts: string[] = [];
  // V8/Hermes에서 긴 문자열 연결 시 힙 단편화를 방지하기 위해 16KB(3의 배수) 단위로 분할 수집
  const MAX_CHUNK_LENGTH = 16383;

  let chunk = '';
  for (let i = 0, len2 = len - extraBytes; i < len2; i += 3) {
    const b1 = bytes[i];
    const b2 = bytes[i + 1];
    const b3 = bytes[i + 2];

    chunk +=
      BASE64_CHARS[b1 >> 2] +
      BASE64_CHARS[((b1 & 0x03) << 4) | (b2 >> 4)] +
      BASE64_CHARS[((b2 & 0x0f) << 2) | (b3 >> 6)] +
      BASE64_CHARS[b3 & 0x3f];

    if (chunk.length >= MAX_CHUNK_LENGTH) {
      parts.push(chunk);
      chunk = '';
    }
  }

  // 3바이트 배수로 나누어떨어지지 않는 잔여 바이트의 패딩(=, ==) 처리
  if (extraBytes === 1) {
    const b1 = bytes[len - 1];
    chunk += BASE64_CHARS[b1 >> 2] + BASE64_CHARS[(b1 & 0x03) << 4] + '==';
  } else if (extraBytes === 2) {
    const b1 = bytes[len - 2];
    const b2 = bytes[len - 1];
    chunk +=
      BASE64_CHARS[b1 >> 2] +
      BASE64_CHARS[((b1 & 0x03) << 4) | (b2 >> 4)] +
      BASE64_CHARS[(b2 & 0x0f) << 2] +
      '=';
  }

  if (chunk.length > 0) {
    parts.push(chunk);
  }

  return parts.join('');
};

/**
 * 다양한 형태의 바이너리 데이터를 image Data URI (Base64)로 변환
 * @param data SQLite BLOB, Uint8Array, ArrayBuffer, Array, 문자열 등
 * @returns data:image/gif;base64,... 형식의 URI 문자열 (실패 시 '')
 */
export const binaryToBase64 = (data: any): string => {
  if (!data) return '';

  // 이미 완성된 Data URI인 경우 즉시 반환
  if (typeof data === 'string' && data.startsWith('data:image')) {
    return data;
  }

  try {
    let bytes: Uint8Array;

    if (data instanceof Uint8Array) {
      bytes = data;
    } else if (data instanceof ArrayBuffer) {
      bytes = new Uint8Array(data);
    } else if (ArrayBuffer.isView(data)) {
      // DataView나 다른 TypedArray의 서브뷰 오프셋을 정확히 반영
      bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    } else if (Array.isArray(data)) {
      bytes = new Uint8Array(data);
    } else if (typeof data === 'string') {
      // data: 접두사만 누락된 순수 Base64 문자열인 경우 불필요한 재인코딩 방지
      const trimmed = data.trim();
      if (/^[A-Za-z0-9+/=]+$/.test(trimmed) && trimmed.length % 4 === 0) {
        return `data:image/gif;base64,${trimmed}`;
      }

      // 일반 바이너리 문자열인 경우 바이트 배열로 변환
      const len = data.length;
      bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = data.charCodeAt(i) & 0xff;
      }
    } else if (typeof data === 'object' && typeof data.length === 'number') {
      // 유사 배열 객체(Array-like) 직렬화 데이터 대응
      bytes = new Uint8Array(Array.from(data as ArrayLike<number>));
    } else {
      logger.warn(`binaryToBase64: unsupported data type: ${typeof data}`);
      return '';
    }

    const base64 = uint8ArrayToBase64(bytes);
    return base64 ? `data:image/gif;base64,${base64}` : '';
  } catch (error) {
    logger.error(`binaryToBase64 conversion error: ${error}`);
    return '';
  }
};
