import logger from '@utils/logger';
import { useState, useCallback, useRef } from 'react';
import { Camera } from 'react-native-vision-camera';
import { ImageManipulator } from 'expo-image-manipulator';
import { Image } from 'react-native';
import { targetImageSize } from '@constants/size';

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
  const [isProcessing, setIsProcessing] = useState(false);

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
    if (!cameraRef.current || isProcessing) return;

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePhoto();
      const uri = `file://${photo.path}`;

      // EXIF가 적용된 최종 해상도
      const { actualWidth, actualHeight } = await new Promise<{
        actualWidth: number;
        actualHeight: number;
      }>((resolve, reject) => {
        Image.getSize(
          uri,
          (width, height) => {
            resolve({ actualWidth: width, actualHeight: height });
          },
          (error) => {
            reject(error);
          },
        );
      });

      const size = Math.min(actualWidth, actualHeight);

      // 이미지를 가이드라인 최적화
      let renderImage;
      if (size / 2 >= targetImageSize.width) {
        // 가이드라인이 targetImageSize 보다 클때, resize 추가
        const guideSize = size / 2;
        const originX = (actualWidth - guideSize) / 2;
        const originY = (actualHeight - guideSize) / 2;

        renderImage = await ImageManipulator.manipulate(uri)
          .crop({
            originX: originX,
            originY: originY,
            width: guideSize,
            height: guideSize,
          })
          .resize({
            width: targetImageSize.width,
            height: targetImageSize.height,
          })
          .renderAsync();
      } else {
        // 가이드라인과 targetImageSize가 같을때, resize 불필요
        const originX = (actualWidth - targetImageSize.width) / 2;
        const originY = (actualHeight - targetImageSize.height) / 2;

        renderImage = await ImageManipulator.manipulate(uri)
          .crop({
            originX: originX,
            originY: originY,
            width: targetImageSize.width,
            height: targetImageSize.height,
          })
          .renderAsync();
      }
      const result = await renderImage.saveAsync({ compress: 1 });
      const imageUri = result.uri;

      console.log('촬영 완료:', imageUri);
      onCapture(imageUri);

      onComplete?.(); // 촬영 완료 콜백
    } catch (e: any) {
      logger.error(`Failed to capture photo. ${e.stack || e}`);
    } finally {
      setIsProcessing(false);
    }
  }, [onCapture, onComplete, isProcessing]);

  return {
    showCamera,
    cameraRef,
    openCamera,
    closeCamera,
    capturePhoto,
    isProcessing,
  };
};
