import React, { useMemo, forwardRef } from 'react';
import { Image as ExpoImage, ImageProps, ImageStyle } from 'expo-image';
import { Image as RNImage, StyleSheet } from 'react-native';

export const Image = forwardRef<ExpoImage, ImageProps>((props, ref) => {
  const { source, style, allowDownscaling = false, ...restProps } = props;

  // 1. 에셋 원본 크기 추출을 source에만 의존하도록 분리 (불필요한 재호출 방지)
  const assetMeta = useMemo(() => {
    if (!source || Array.isArray(source) || typeof source === 'string') {
      return null;
    }
    try {
      // 웹 환경 대응을 위해 옵셔널 체이닝 적용
      const resolved = RNImage.resolveAssetSource?.(source as any);
      if (resolved?.width && resolved?.height) {
        return {
          width: resolved.width,
          height: resolved.height,
          aspectRatio: resolved.width / resolved.height,
        };
      }
    } catch {
      // 해상도 추론 실패 시 무시
    }
    return null;
  }, [source]);

  // 2. 스타일 계산: 레이아웃 제어 속성들을 모두 점검
  const computedStyle = useMemo(() => {
    if (!assetMeta) return style;

    const flat = (StyleSheet.flatten(style) as ImageStyle) || {};

    const hasWidth =
      flat.width !== undefined ||
      flat.minWidth !== undefined ||
      flat.maxWidth !== undefined;
    const hasHeight =
      flat.height !== undefined ||
      flat.minHeight !== undefined ||
      flat.maxHeight !== undefined;
    const hasAspectRatio = flat.aspectRatio !== undefined;

    // flex나 position: absolute 등으로 크기가 결정되는지 확인
    const isFlexSized =
      (flat.flex !== undefined && flat.flex > 0) ||
      (flat.flexGrow !== undefined && flat.flexGrow > 0) ||
      flat.flexBasis !== undefined;

    const isAbsoluteStretched =
      flat.position === 'absolute' &&
      ((flat.left !== undefined && flat.right !== undefined) ||
        (flat.top !== undefined && flat.bottom !== undefined));

    // Case A: Flex나 Absolute 스트레치로 레이아웃이 잡히는 경우 -> 원본 크기를 주입하지 않음
    if (isFlexSized || isAbsoluteStretched) {
      return style;
    }

    // Case B: 한쪽 축만 지정된 경우 -> aspectRatio만 자동 주입
    if ((hasWidth && !hasHeight) || (!hasWidth && hasHeight)) {
      if (!hasAspectRatio) {
        return [{ aspectRatio: assetMeta.aspectRatio }, style];
      }
      return style;
    }

    // Case C: 크기 관련 속성이 전혀 없는 경우 -> 원본 해상도(dp)를 기본값으로 부여
    if (!hasWidth && !hasHeight) {
      if (hasAspectRatio) {
        // aspectRatio만 있고 width/height가 없다면 원본 너비를 기준으로 삼음
        return [{ width: assetMeta.width }, style];
      }
      return [{ width: assetMeta.width, height: assetMeta.height }, style];
    }

    return style;
  }, [assetMeta, style]);

  return (
    <ExpoImage
      ref={ref}
      source={source}
      style={computedStyle}
      // 외부에서 allowDownscaling={true}를 넘기면 덮어쓸 수 있도록 설정
      allowDownscaling={allowDownscaling}
      {...restProps}
    />
  );
});

Image.displayName = 'CustomImage';

export default Image;
