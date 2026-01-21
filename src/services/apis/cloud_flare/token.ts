const encoder = new TextEncoder();

/**
 * 시크릿키 import
 * @param secret 시크릿 키
 * @returns
 */
async function importKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

/**
 * base64 URL로 인코딩
 * @param buf 버퍼
 * @returns
 */
function encodeBase64URL(buf: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * 토큰 생성
 * @returns
 */
export async function getToken() {
  const timestamp = Date.now().toString();
  const key = await importKey(process.env.EXPO_PUBLIC_CLOUD_FLARE_SECRET_KEY);

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(timestamp),
  );

  return `${btoa(timestamp)}.${encodeBase64URL(signature)}`;
}
