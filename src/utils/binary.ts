import logger from './logger';

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

  if (len === 0) {
    return '';
  }

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

// 바이너리 문자열을 바이트로 변환.
const binaryStringToBytes = (value: string): Uint8Array => {
  const bytes = new Uint8Array(value.length);

  for (let index = 0; index < value.length; index++) {
    bytes[index] = value.charCodeAt(index) & 0xff;
  }

  return bytes;
};

// 입력 형식별 바이트 배열 변환.
const toByteArray = (data: unknown): Uint8Array | null => {
  if (data instanceof Uint8Array) {
    return data;
  }

  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  }

  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  }

  if (Array.isArray(data)) {
    return new Uint8Array(data);
  }

  if (typeof data === 'string') {
    return binaryStringToBytes(data);
  }

  if (
    data &&
    typeof data === 'object' &&
    'length' in data &&
    typeof data.length === 'number'
  ) {
    return new Uint8Array(Array.from(data as ArrayLike<number>));
  }

  return null;
};

// 기존 이미지·Base64 문자열 확인.
const existingImageUri = (data: unknown): string | null => {
  if (typeof data !== 'string') {
    return null;
  }

  if (data.startsWith('data:image')) {
    return data;
  }

  const trimmed = data.trim();

  if (!/^[A-Za-z0-9+/=]+$/.test(trimmed) || trimmed.length % 4 !== 0) {
    return null;
  }

  return 'data:image/gif;base64,' + trimmed;
};

// 바이너리를 이미지 Data URI로 변환.
export const binaryToBase64 = (data: unknown): string => {
  if (!data) {
    return '';
  }

  try {
    const existing = existingImageUri(data);

    if (existing) {
      return existing;
    }

    const bytes = toByteArray(data);

    if (!bytes) {
      logger.warn('binaryToBase64: unsupported data type: ' + typeof data);

      return '';
    }

    const base64 = uint8ArrayToBase64(bytes);

    return base64 ? 'data:image/gif;base64,' + base64 : '';
  } catch (error) {
    logger.error('binaryToBase64 conversion error: ' + error);

    return '';
  }
};
