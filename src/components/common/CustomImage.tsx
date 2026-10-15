import React, { useMemo, forwardRef } from 'react';
import { Image as ExpoImage, ImageProps } from 'expo-image';
import { Image as RNImage, StyleSheet } from 'react-native';

export const Image = forwardRef<ExpoImage, ImageProps>((props, ref) => {
  const intrinsicSize = useMemo(() => {
    if (props.source && !Array.isArray(props.source)) {
      try {
        // react-native 기능으로 로컬 이미지의 원본 크기 추론
        const resolved = RNImage.resolveAssetSource(props.source as any);
        if (resolved && resolved.width && resolved.height) {
          return { width: resolved.width, height: resolved.height };
        }
      } catch {
        // 해상도 추론 실패 시 무시
      }
    }
    return null;
  }, [props.source]);

  return (
    <ExpoImage
      ref={ref}
      {...props}
      // 원본 크기를 기본값으로 설정, 명시된 props.style이 덮어쓰도록(override) 함
      style={StyleSheet.flatten([intrinsicSize, props.style])}
    />
  );
});

Image.displayName = 'CustomImage';

export default Image;
