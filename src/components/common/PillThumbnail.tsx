import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { ImageProps } from 'expo-image';
import { COLOR_BG } from '@constants/color';
import { usePillImageSource } from '@features/shared/hooks/use_pill_image_source';
import { Image } from './CustomImage';
import PillImageFallback from './PillImageFallback';

export default function PillThumbnail({
  uri,
  style,
  contentFit = 'cover',
}: {
  uri?: string | null;
  style: StyleProp<ViewStyle>;
  contentFit?: ImageProps['contentFit'];
}) {
  const { source, hasImage, onError } = usePillImageSource(uri);

  return (
    <View style={[style, styles.container]}>
      {hasImage ? (
        <Image
          source={source}
          contentFit={contentFit}
          style={styles.image}
          onError={onError}
        />
      ) : (
        <PillImageFallback />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_BG.base,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
});
