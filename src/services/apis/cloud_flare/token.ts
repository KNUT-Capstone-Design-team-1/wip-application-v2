import CryptoJS from 'crypto-js';

/**
 * base64 URL로 인코딩
 * @param base64String 일반 base64 문자열
 * @returns base64 URL 인코딩된 문자열
 */
function encodeBase64URL(base64String: string): string {
  return base64String
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * 토큰 생성 (React Native 호환용 crypto-js 사용)
 * @returns
 */
export async function getToken() {
  const timestamp = Date.now().toString();
  const secretKey = process.env.EXPO_PUBLIC_CLOUD_FLARE_SECRET_KEY;

  if (!secretKey) {
    console.error('EXPO_PUBLIC_CLOUD_FLARE_SECRET_KEY is missing');
    return '';
  }

  // HMAC-SHA256 서명 생성
  const hash = CryptoJS.HmacSHA256(timestamp, secretKey);
  const signature = CryptoJS.enc.Base64.stringify(hash);

  // timestamp도 base64 인코딩
  const timestampBase64 = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(timestamp),
  );

  return `${timestampBase64}.${encodeBase64URL(signature)}`;
}
