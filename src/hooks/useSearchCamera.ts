import { cameraDeviceOption } from '@/constants/options';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  useCameraDevice,
  Point,
  useCameraFormat,
} from 'react-native-vision-camera';
import { Accelerometer, AccelerometerMeasurement } from 'expo-sensors';

const MOVEMENT_THRESHOLD = 0.2;
const FOCUS_UI_DURATION = 4000;

/**
 * 카메라 하드웨어 설정 및 제어를 위한 커스텀 훅
 * - 후면 카메라 사용 (cameraDeviceOption 적용)
 * - Zoom 고정 (1.0)
 * - AE 비활성화 및 밝기 고정 (exposure: 0)
 * - Torch 제어
 * - Tap-to-focus 지원
 */
export const useSearchCamera = () => {
  // 하드웨어 디바이스 설정 (후면, 광각 등 옵션 적용)
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

  // Torch 상태 관리
  // device.hasTorch가 true일 때만 토치 사용 가능
  const [torchState, setTorchState] = useState<'off' | 'on'>('off');
  const isTorchAvailable = cameraDevice?.hasTorch ?? false;

  // focus 상태 관리
  const [focusXY, setFocusXY] = useState<Point>({ x: 0, y: 0 });
  const [isManualFocus, setIsManualFocus] = useState<boolean>(false);

  // focus UI 타이머 및 센서 관리
  const focusUITimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastAccelRef = useRef<AccelerometerMeasurement | null>(null);
  const accelSubscriptionRef = useRef<{ remove: () => void } | null>(null);

  // 플래시 토글
  const toggleTorch = useCallback(() => {
    if (!isTorchAvailable) return;
    setTorchState((prev) => (prev === 'off' ? 'on' : 'off'));
  }, [isTorchAvailable]);

  // Focus 제어 (Tap-to-focus only)
  // focus ui 숨기기
  const hideFocusUI = useCallback(() => {
    setFocusXY({ x: 0, y: 0 });
    setIsManualFocus(false);

    if (focusUITimerRef.current) {
      clearTimeout(focusUITimerRef.current);
      focusUITimerRef.current = null;
    }
  }, []);

  // 화면 터치 시 해당 좌표로 포커싱
  const focus = useCallback(
    async ({ x, y }: Point) => {
      try {
        if (cameraRef.current && cameraDevice?.supportsFocus) {
          if (focusUITimerRef.current) {
            clearTimeout(focusUITimerRef.current);
            focusUITimerRef.current = null;
          }

          setFocusXY({ x, y });
          setIsManualFocus(true);

          await cameraRef.current.focus({ x, y });

          focusUITimerRef.current = setTimeout(() => {
            hideFocusUI();
          }, FOCUS_UI_DURATION);
        }
      } catch (e) {
        console.warn('Focus failed:', e);
      }
    },
    [cameraDevice, hideFocusUI],
  );

  // AF 복귀 (움직임 감지 및 tap-to-focus 해제)
  useEffect(() => {
    if (!isManualFocus) {
      if (accelSubscriptionRef.current) {
        accelSubscriptionRef.current.remove();
        accelSubscriptionRef.current = null;
      }
      lastAccelRef.current = null;
      return;
    }

    Accelerometer.setUpdateInterval(100);

    accelSubscriptionRef.current = Accelerometer.addListener(
      (data: AccelerometerMeasurement) => {
        if (lastAccelRef.current) {
          const deltaX = Math.abs(data.x - lastAccelRef.current.x);
          const deltaY = Math.abs(data.y - lastAccelRef.current.y);
          const deltaZ = Math.abs(data.z - lastAccelRef.current.z);
          const totalDelta = deltaX + deltaY + deltaZ;

          if (totalDelta > MOVEMENT_THRESHOLD) {
            hideFocusUI();
          }
        }
        lastAccelRef.current = data;
      },
    );

    return () => {
      if (accelSubscriptionRef.current) {
        accelSubscriptionRef.current.remove();
        accelSubscriptionRef.current = null;
      }
    };
  }, [isManualFocus, hideFocusUI]);

  // 설정 정보 구성
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
    isManualFocus,
    torchInfo: {
      isTorchAvailable,
      torchState,
      toggleTorch,
    },
    focus,
    hideFocusUI,
  };
};
