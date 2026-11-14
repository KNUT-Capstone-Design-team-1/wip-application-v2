import React from 'react';
import { View } from 'react-native';
import { COLOR } from '@constants/color';
import { Folder } from 'lucide-react-native';
import { fontPx } from '@utils/responsive';
import { PillImage } from './PillImage';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_save/styles/atoms/FolderIconPreview';

// 폴더 아이콘 또는 폴더 내 알약 썸네일(최대 4개)을 보여주는 UI 컴포넌트
export const FolderIconPreview = ({
  images,
  totalCount = 0,
}: {
  images?: string[];
  totalCount?: number;
}) => {
  if (!images || images.length === 0) {
    if (totalCount > 0) {
      return <PillImage style={styles.imageFolderWrapper} />;
    }
    return (
      <View style={styles.emptyFolderWrapper}>
        <Folder
          size={fontPx(24)}
          color={COLOR['primary']}
          fill={COLOR['primary']}
          style={styles.folderIcon}
        />
      </View>
    );
  }

  const displayImages = images.slice(0, 4);

  return (
    <View style={styles.imageFolderWrapper}>
      {displayImages.length === 1 ? (
        <PillImage uri={displayImages[0]} style={styles.fullImage} />
      ) : displayImages.length === 2 ? (
        <>
          <PillImage uri={displayImages[0]} style={styles.halfWidthImage} />
          <PillImage uri={displayImages[1]} style={styles.halfWidthImage} />
        </>
      ) : displayImages.length === 3 ? (
        <>
          <PillImage uri={displayImages[0]} style={styles.halfHeightImage} />
          <View style={styles.rowContainer}>
            <PillImage uri={displayImages[1]} style={styles.halfWidthImage} />
            <PillImage uri={displayImages[2]} style={styles.halfWidthImage} />
          </View>
        </>
      ) : (
        displayImages.map((uri, index) => (
          <PillImage key={index} uri={uri} style={styles.quarterImage} />
        ))
      )}
      {totalCount >= 5 && (
        <View style={styles.ellipsisOverlay}>
          <BaseText style={styles.ellipsisText}>...</BaseText>
        </View>
      )}
    </View>
  );
};
