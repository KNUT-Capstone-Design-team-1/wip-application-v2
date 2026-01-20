import { useCallback } from 'react';
import { usePillImageStore } from '../store/pill_image_store';

/**
 * 알약 이미지 선택 로직을 관리하는 Hook
 */
export const usePillImageSelection = () => {
  const {
    pillImages,
    hasImage,
    setFrontImage,
    setBackImage,
    removeFrontImage,
    removeBackImage,
    resetPillImages,
  } = usePillImageStore();

  /**
   * 단일 이미지 선택 (카메라 촬영)
   */
  const handleImageSelect = useCallback(
    (imageUri: string) => {
      // 재촬영 시: 이미 2장이 있으면 앞면부터 다시 시작
      if (pillImages.front && pillImages.back) {
        console.log('재촬영 - 앞면부터 다시 저장');
        resetPillImages();
        setFrontImage(imageUri);
        return;
      }

      // 앞면이 비어있으면 앞면에, 아니면 뒷면에 저장
      if (!pillImages.front) {
        console.log('앞면 이미지 저장:', imageUri);
        setFrontImage(imageUri);
      } else if (!pillImages.back) {
        console.log('뒷면 이미지 저장:', imageUri);
        setBackImage(imageUri);
        setTimeout(() => {
          console.log('2장 선택 완료, UI 전환');
        }, 400);
      }
    },
    [pillImages, resetPillImages, setFrontImage, setBackImage],
  );

  /**
   * 다중 이미지 선택 (앨범에서 2장)
   */
  const handleMultipleImageSelect = useCallback(
    (images: string[]) => {
      if (images.length >= 2) {
        console.log('앨범에서 2장 선택:', images);
        resetPillImages();
        setFrontImage(images[0]);
        setBackImage(images[1]);
      }
    },
    [resetPillImages, setFrontImage, setBackImage],
  );

  /**
   * 이미지 삭제
   */
  const handleImageRemove = useCallback(
    (side: 'front' | 'back') => {
      if (side === 'front') {
        removeFrontImage();
      } else {
        removeBackImage();
      }
    },
    [removeFrontImage, removeBackImage],
  );

  /**
   * 검색하기 (API 호출)
   */
  const handleSearch = useCallback(() => {
    console.log('검색할 이미지:', pillImages);
    // TODO: 선택된 이미지로 알약 검색 API 호출
    return pillImages;
  }, [pillImages]);

  const isBothImagesSelected = !!(pillImages.front && pillImages.back);

  return {
    pillImages,
    hasImage,
    isBothImagesSelected,
    handleImageSelect,
    handleMultipleImageSelect,
    handleImageRemove,
    handleSearch,
    resetPillImages,
  };
};
