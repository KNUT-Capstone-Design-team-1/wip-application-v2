// BottomSheet 에서 base64 이미지 제거 및 텍스트 길이 제한 함수
export const formatContents = (contents: string) => {
  // base64 이미지 패턴 제거 (data:image/... 형태)
  const textWithoutBase64 = contents.replace(
    /data:image\/[^;]+;base64,[^\s"]*/g,
    '',
  );

  // 100글자 넘으면 ... 처리
  if (textWithoutBase64.length > 20) {
    return textWithoutBase64.substring(0, 100) + '...';
  }
  return textWithoutBase64;
};

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
 * React Native용 토큰 생성 함수 (crypto-js 사용)
 * 원래 token.ts와 동일한 방식으로 HMAC-SHA256 서명 생성
 */
export async function getNoticeToken(): Promise<string> {
  try {
    const timestamp = Date.now().toString();
    const secretKey = process.env.EXPO_PUBLIC_CLOUD_FLARE_SECRET_KEY;

    if (!secretKey) {
      throw new Error('Secret key is not defined');
    }

    // HMAC-SHA256 서명 생성
    const signature = CryptoJS.HmacSHA256(timestamp, secretKey);

    // Base64로 인코딩
    const signatureBase64 = CryptoJS.enc.Base64.stringify(signature);

    // Base64 URL 인코딩 (-, _, padding 제거)
    const encodedSignature = encodeBase64URL(signatureBase64);

    // timestamp를 base64로 인코딩하고 서명과 결합
    return `${btoa(timestamp)}.${encodedSignature}`;
  } catch (error) {
    console.error('Failed to generate token:', error);
    throw error;
  }
}
