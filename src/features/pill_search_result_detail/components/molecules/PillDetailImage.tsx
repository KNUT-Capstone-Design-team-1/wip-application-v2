import { memo } from 'react';
import { View } from 'react-native';
import { useStore } from 'zustand';
import PillImageFallback from '@components/common/PillImageFallback';
import { usePillImageSource } from '@features/shared/hooks/use_pill_image_source';
import { Image } from '@components/common/CustomImage';
import { usePillDetailContext } from '../../hooks/use_pill_detail_context';
import { styles } from '../../styles/PillSearchResultDetailScreen';

// 알약 사진 또는 공통 대체 이미지 표시.
const PillDetailImage = () => {
  const store = usePillDetailContext();
  const imageUri = useStore(
    store,
    (state) => state.image || state.pillData?.ITEM_IMAGE,
  );

  const { source, hasImage, onError } = usePillImageSource(imageUri);

  return (
    <View style={styles.pillImgContainer}>
      <View style={styles.pillImgWrapper}>
        {hasImage ? (
          <Image
            style={styles.pillImg}
            source={source}
            contentFit="contain"
            onError={onError}
          />
        ) : (
          <View style={styles.pillDetailNoImageWrapper}>
            <PillImageFallback />
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(PillDetailImage);
