import { cameraDeviceOption } from '@/constants/options';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  useCameraDevice,
  Point,
  useCameraFormat,
} from 'react-native-vision-camera';

/**
 * 카메라 하드웨어 설정 및 제어를 위한 커스텀 훅
 * - 후면 카메라 사용 (cameraDeviceOption 적용)
 * - Zoom 고정 (1.0)
 * - AE 비활성화 및 밝기 고정 (exposure: 0)
 * - Torch 제어
 * - Tap-to-focus 지원
 */
export const useSearchCamera = () => {
  // 1. 하드웨어 디바이스 설정 (후면, 광각 등 옵션 적용)
  const cameraDevice = useCameraDevice('back', cameraDeviceOption);
  const cameraRef = useRef<Camera>(null);
  const cameraFormat = useCameraFormat(cameraDevice, [
    {
      photoAspectRatio: 1,
      photoHdr: false,
      autoFocusSystem: 'phase-detection',
    },
  ]);
  const [cameraLoading, setCameraLoading] = useState<boolean>(true);

  // 2. Torch 상태 관리
  // device.hasTorch가 true일 때만 토치 사용 가능
  const [torchState, setTorchState] = useState<'off' | 'on'>('off');
  const isTorchAvailable = cameraDevice?.hasTorch ?? false;
  const [focusXY, setFocusXY] = useState<Point>({ x: 0, y: 0 });

  const toggleTorch = useCallback(() => {
    if (!isTorchAvailable) return;
    setTorchState((prev) => (prev === 'off' ? 'on' : 'off'));
  }, [isTorchAvailable]);

  // 3. Focus 제어 (Tap-to-focus only)
  // 화면 터치 시 해당 좌표로 포커싱
  const focus = useCallback(
    async ({ x, y }: Point) => {
      try {
        if (cameraRef.current && cameraDevice?.supportsFocus) {
          setFocusXY({ x, y });
          await cameraRef.current.focus({ x, y });
        }
      } catch (e) {
        console.warn('Focus failed:', e);
      }
    },
    [cameraDevice],
  );

  // 4. 설정 정보 구성
  // Zoom: 1.0 고정
  // Exposure: 0 (AE 비활성화/기본 밝기 고정)
  // WhiteBalance: 별도 props 없음 (기본값 사용)
  const cameraProps = {
    device: cameraDevice,
    format: cameraFormat,
    isActive: true, // 기본 활성화
    ref: cameraRef,
    zoom: 1.0, // Zoom 고정
    exposure: 0, // 밝기 고정 (AE 비활성화 효과)
    torch: torchState,
    photo: true, // 사진 촬영용
    enableZoomGesture: false, // Zoom 제스처 비활성화 (필요 시 추가)
  };

  useEffect(() => {
    if (cameraDevice !== undefined) {
      setCameraLoading(false);
    }
  }, [cameraDevice]);

  return {
    cameraDevice,
    cameraRef,
    cameraProps,
    cameraLoading,
    focusXY,
    torchInfo: {
      isTorchAvailable,
      torchState,
      toggleTorch,
    },
    focus,
  };
};
