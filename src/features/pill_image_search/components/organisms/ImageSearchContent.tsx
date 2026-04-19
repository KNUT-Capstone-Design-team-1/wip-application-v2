import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../../styles/organisms/ImageSearchContent';
import {
  BEFORE_PILL_IMAGE_SEARCH,
  AFTER_PILL_IMAGE_SEARCH,
} from '../../constants/pillImageSearch';
import InfoIcon from '@assets/icons/info-icon.svg';
import SelectedImagesView from '../atoms/SelectedImagesView';

interface IImageSearchContentProps {
  contentState: boolean;
  frontImage?: string | null;
  backImage?: string | null;
}

const ImageSearchContent = ({
  contentState,
  frontImage,
  backImage,
}: IImageSearchContentProps) => {
  const content = contentState
    ? AFTER_PILL_IMAGE_SEARCH
    : BEFORE_PILL_IMAGE_SEARCH;
  const isSelectedImage = contentState && frontImage && backImage;

  // 이미지가 선택되었을 때는 선택된 이미지 표시
  if (isSelectedImage) {
    return <SelectedImagesView frontImage={frontImage} backImage={backImage} />;
  }

  // 기본 촬영 가이드 표시
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{content.title}</Text>
      <View style={styles.contentTitleWrapper}>
        <View style={styles.infoIcon}>
          <InfoIcon width={8} height={10} fill="#fff" />
        </View>
        <Text style={styles.contentTitle}>{content.contentTitle}</Text>
      </View>
      <Text style={styles.contentDescription}>
        {content.contentDescription}
      </Text>
      <Image
        source={content.contentImage}
        style={styles.contentImage}
        resizeMode="contain"
      />
    </View>
  );
};

export default ImageSearchContent;
