import React from 'react';
import { View } from 'react-native';
import { COLOR } from '@constants/color';
import { Folder } from 'lucide-react-native';
import { fontPx } from '@utils/responsive';
import { Image } from '@components/common/CustomImage';
import { styles } from '@features/pill_save/styles/atoms/FolderIconPreview';

// 폴더 아이콘 또는 폴더 내 알약 썸네일(최대 4개)을 보여주는 UI 컴포넌트
export const FolderIconPreview = ({ images }: { images?: string[] }) => {
  if (!images || images.length === 0) {
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
        <Image
          source={{ uri: displayImages[0] }}
          style={styles.fullImage}
          contentFit="cover"
        />
      ) : displayImages.length === 2 ? (
        <>
          <Image
            source={{ uri: displayImages[0] }}
            style={styles.halfWidthImage}
            contentFit="cover"
          />
          <Image
            source={{ uri: displayImages[1] }}
            style={styles.halfWidthImage}
            contentFit="cover"
          />
        </>
      ) : displayImages.length === 3 ? (
        <>
          <Image
            source={{ uri: displayImages[0] }}
            style={styles.halfHeightImage}
            contentFit="cover"
          />
          <View style={styles.rowContainer}>
            <Image
              source={{ uri: displayImages[1] }}
              style={styles.halfWidthImage}
              contentFit="cover"
            />
            <Image
              source={{ uri: displayImages[2] }}
              style={styles.halfWidthImage}
              contentFit="cover"
            />
          </View>
        </>
      ) : (
        displayImages.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={styles.quarterImage}
            contentFit="cover"
          />
        ))
      )}
    </View>
  );
};
