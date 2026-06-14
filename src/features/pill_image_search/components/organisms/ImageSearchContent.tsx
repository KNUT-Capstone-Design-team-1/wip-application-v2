import React from 'react';
import ImagePreviewSlots from './ImagePreviewSlots';
import ImageSearchGuide from './ImageSearchGuide';

interface IImageSearchContentProps {
  frontImage: string | null;
  backImage: string | null;
  onRemove: (side: 'front' | 'back') => void;
}

const ImageSearchContent = ({
  frontImage,
  backImage,
  onRemove,
}: IImageSearchContentProps) => {
  // 이미지가 선택되었을 때는 선택된 이미지 표시
  if (frontImage || backImage) {
    return (
      <ImagePreviewSlots
        frontImage={frontImage}
        backImage={backImage}
        onRemove={onRemove}
      />
    );
  }

  // 기본 촬영 가이드 표시
  return <ImageSearchGuide />;
};

export default ImageSearchContent;
