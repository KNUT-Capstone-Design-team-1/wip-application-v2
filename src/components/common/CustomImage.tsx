import React, { useMemo } from 'react';
import { Image as ExpoImage, ImageProps } from 'expo-image';
import { Image as RNImage } from 'react-native';

export const Image: React.FC<ImageProps> = (props) => {
  const intrinsicSize = useMemo(() => {
    if (props.source && !Array.isArray(props.source)) {
      try {
        // react-native의 기능을 이용해 로컬 이미지의 원본 크기를 추론합니다.
        const resolved = RNImage.resolveAssetSource(props.source as any);
        if (resolved && resolved.width && resolved.height) {
          return { width: resolved.width, height: resolved.height };
        }
      } catch (e) {
        // 해상도 추론 실패 시 무시
      }
    }
    return null;
  }, [props.source]);

  return (
    <ExpoImage
      {...props}
      // 원본 크기를 기본값으로 깔아주고, 명시된 props.style이 이를 덮어쓰도록(override) 합니다.
      style={[intrinsicSize, props.style]}
    />
  );
};

export default Image;
