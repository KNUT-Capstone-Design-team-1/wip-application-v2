/**
 * BottomSheet 에서 base64 이미지 제거 및 텍스트 길이 제한
 */
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
