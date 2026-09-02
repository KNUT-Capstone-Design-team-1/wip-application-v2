import React from 'react';
import ImagePreviewSlots from './ImagePreviewSlots';
import ImageSearchGuide from './ImageSearchGuide';
import { usePillImageStore } from '../../store/pill_image_store';

const ImageSearchContent = () => {
  const pillImages = usePillImageStore((state) => state.pillImages);

  // 이미지가 선택되었을 때는 선택된 이미지 표시
  if (pillImages.front || pillImages.back) {
    return <ImagePreviewSlots />;
  }

  // 기본 촬영 가이드 표시
  return <ImageSearchGuide />;
};

export default ImageSearchContent;
