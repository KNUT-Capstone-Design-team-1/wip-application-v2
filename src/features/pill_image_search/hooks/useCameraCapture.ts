import logger from '@utils/logger';
import { useState, useCallback, useRef } from 'react';
import { Camera } from 'react-native-vision-camera';
import { ImageManipulator } from 'expo-image-manipulator';
import { Image, Alert } from 'react-native';
import { targetImageSize } from '@constants/size';

// 이미지의 실제 해상도(EXIF 적용)를 가져오는 비동기 함수
const getImageSize = (
  uri: string,
): Promise<{ actualWidth: number; actualHeight: number }> => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ actualWidth: width, actualHeight: height }),
      (error) => reject(error),
    );
  });
};

// 촬영된 이미지를 가이드라인에 맞게 크롭 및 리사이즈하는 헬퍼 함수
const processCapturedImage = async (
  uri: string,
  actualWidth: number,
  actualHeight: number,
) => {
  const size = Math.min(actualWidth, actualHeight);
  const needsResize = size / 2 >= targetImageSize.width;

  if (needsResize) {
    // 가이드라인이 targetImageSize 보다 클 때, 리사이즈 포함 최적화
    const guideSize = size / 2;
    const originX = (actualWidth - guideSize) / 2;
    const originY = (actualHeight - guideSize) / 2;

    return ImageManipulator.manipulate(uri)
      .crop({
        originX,
        originY,
        width: guideSize,
        height: guideSize,
      })
      .resize({
        width: targetImageSize.width,
        height: targetImageSize.height,
      })
      .renderAsync();
  }

  // 가이드라인과 targetImageSize가 같을 때, 단순 크롭만 진행 (리사이즈 불필요)
  const originX = (actualWidth - targetImageSize.width) / 2;
  const originY = (actualHeight - targetImageSize.height) / 2;

  return ImageManipulator.manipulate(uri)
    .crop({
      originX,
      originY,
      width: targetImageSize.width,
      height: targetImageSize.height,
    })
    .renderAsync();
};

// 카메라 촬영 동작에 필요한 콜백 속성 정의
interface UseCameraCaptureProps {
  onCapture: (imageUri: string) => void; // 촬영 성공 시 이미지 URI를 전달받는 콜백
  onComplete?: () => void; // 촬영 후가공(Crop/Resize) 프로세스 완료 시 호출되는 콜백
}

// 카메라 렌더링, 사진 촬영 및 이미지 최적화(Crop & Resize) 로직을 관리하는 커스텀 Hook
export const useCameraCapture = ({
  onCapture,
  onComplete,
}: UseCameraCaptureProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const cameraRef = useRef<Camera>(null);

  // 카메라 모달 열기
  const openCamera = useCallback(() => {
    setShowCamera(true);
  }, []);

  // 카메라 모달 닫기
  const closeCamera = useCallback(() => {
    setShowCamera(false);
  }, []);

  // 실제 디바이스 카메라 사진 촬영 및 EXIF 기준 최적화(자르기, 크기 조정) 진행
  const capturePhoto = useCallback(async () => {
    if (!cameraRef.current || isProcessing) return;

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePhoto();
      const uri = `file://${photo.path}`;

      // EXIF가 적용된 최종 해상도 가져오기
      const { actualWidth, actualHeight } = await getImageSize(uri);

      // 이미지를 가이드라인에 맞게 최적화 (자르기/리사이징)
      const renderImage = await processCapturedImage(
        uri,
        actualWidth,
        actualHeight,
      );

      const result = await renderImage.saveAsync({ compress: 1 });
      const imageUri = result.uri;

      onCapture(imageUri);

      onComplete?.(); // 촬영 완료 콜백
    } catch (e: any) {
      logger.error(`Failed to capture photo. ${e.stack || e}`);

      Alert.alert('오류', '카메라 실행 중 오류가 발생했습니다.');
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
