import { memo } from 'react';
import { View } from 'react-native';
import { useStore } from 'zustand';
import { BaseText } from '@components/common/BaseText';
import { Image } from '@components/common/CustomImage';
import { usePillDetailContext } from '../../hooks/use_pill_detail_context';
import { styles } from '../../styles/PillSearchResultDetailScreen';

// 알약 사진·빈 이미지 안내 표시.
const PillDetailImage = () => {
  const store = usePillDetailContext();
  const uri = useStore(
    store,
    (state) => state.image || state.pillData?.ITEM_IMAGE,
  );

  return (
    <View style={styles.pillImgContainer}>
      <View style={styles.pillImgWrapper}>
        {uri ? (
          <Image style={styles.pillImg} source={{ uri }} contentFit="contain" />
        ) : (
          <View style={styles.pillDetailNoImageWrapper}>
            <BaseText
              weight="semiBold"
              size={16}
              style={styles.pillDetailNoImageText}
            >
              이미지가 없습니다
            </BaseText>
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(PillDetailImage);
