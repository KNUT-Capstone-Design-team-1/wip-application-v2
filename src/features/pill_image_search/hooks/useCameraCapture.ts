import { useState, useCallback, useRef } from 'react';
import { Camera } from 'react-native-vision-camera';

interface UseCameraCaptureProps {
  onCapture: (imageUri: string) => void;
  onComplete?: () => void;
}

/**
 * 카메라 촬영 로직을 관리하는 Hook
 */
export const useCameraCapture = ({
  onCapture,
  onComplete,
}: UseCameraCaptureProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<Camera>(null);

  /**
   * 카메라 열기
   */
  const openCamera = useCallback(() => {
    setShowCamera(true);
  }, []);

  /**
   * 카메라 닫기
   */
  const closeCamera = useCallback(() => {
    setShowCamera(false);
  }, []);

  /**
   * 사진 촬영
   */
  const capturePhoto = useCallback(async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: 'balanced',
      });
      const imageUri = `file://${photo.path}`;

      console.log('촬영 완료:', imageUri);
      onCapture(imageUri);

      // 촬영 완료 콜백
      onComplete?.();
    } catch (error) {
      console.error('촬영 실패:', error);
    }
  }, [onCapture, onComplete]);

  return {
    showCamera,
    cameraRef,
    openCamera,
    closeCamera,
    capturePhoto,
  };
};
