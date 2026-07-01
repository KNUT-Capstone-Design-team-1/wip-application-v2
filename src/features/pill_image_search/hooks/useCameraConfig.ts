import { useCallback } from 'react';
import { targetImageSize } from '@constants/size';

import {
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';
import { DimensionValue } from 'react-native';

// Camera 기기 설정, 포맷, 권한 및 뷰파인더 가이드라인 크기를 관리하는 커스텀 Hook
export const useCameraConfig = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [
    {
      photoResolution: { width: 4000, height: 3000 }, //landscape(가로모드) 기준
      autoFocusSystem: 'phase-detection',
    },
  ]);

  // 기기 포맷과 타겟 해상도에 맞춰 UI 뷰파인더 가이드라인 너비(%)를 계산하는 함수
  const getGuideWidth = useCallback((): DimensionValue => {
    if (!format) {
      return '50%';
    }

    const isFormatLargeEnough = format.photoHeight / 2 >= targetImageSize.width;

    if (isFormatLargeEnough) {
      return '50%';
    }

    const guidePercentage = (targetImageSize.width / format.photoHeight) * 100;

    return `${guidePercentage}%`;
  }, [format]);

  return { device, format, hasPermission, requestPermission, getGuideWidth };
};
