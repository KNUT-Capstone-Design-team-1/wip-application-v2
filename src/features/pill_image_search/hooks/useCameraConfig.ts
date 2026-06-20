import { useCallback, useEffect } from 'react';
import { targetImageSize } from '@constants/size';

import {
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';
import { DimensionValue } from 'react-native';

/**
 * Camera 설정 및 권한 관리 Hook
 */
export const useCameraConfig = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [
    {
      photoResolution: { width: 4000, height: 3000 }, //landscape(가로모드) 기준
      autoFocusSystem: 'phase-detection',
    },
  ]);

  // 가이드라인 크기 계산
  const getGuideWidth = useCallback((): DimensionValue => {
    if (!format) return '50%';

    return format.photoHeight / 2 >= targetImageSize.width
      ? '50%'
      : `${(targetImageSize.width / format.photoHeight) * 100}%`;
  }, [format]);

  return { device, format, hasPermission, requestPermission, getGuideWidth };
};
