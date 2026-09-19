export const normalizeImageUri = (uri?: string | null): string | null => {
  if (!uri) return null;

  const trimmed = uri.trim();
  // http 또는 https 프로토콜 유효성 검증 (강제 치환 X, 원본 유지)
  if (
    !trimmed ||
    (!trimmed.startsWith('http://') && !trimmed.startsWith('https://'))
  ) {
    return null;
  }

  // 한글 파일명이나 공백(%20) 등 비표준 문자열 안전 인코딩
  return encodeURI(trimmed);
};
