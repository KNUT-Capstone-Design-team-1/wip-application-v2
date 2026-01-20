import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../../styles/organisms/ImageSearchContent';
import { BEFORE_PILL_IMAGE_SEARCH, AFTER_PILL_IMAGE_SEARCH } from '../../constants/pillImageSearch';
import InfoIcon from '@/assets/icons/info-icon.svg';

interface IImageSearchContentProps {
  contentState: boolean;
};

const ImageSearchContent = ({ contentState }: IImageSearchContentProps) => {
  const content = contentState
    ? AFTER_PILL_IMAGE_SEARCH
    : BEFORE_PILL_IMAGE_SEARCH;

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
