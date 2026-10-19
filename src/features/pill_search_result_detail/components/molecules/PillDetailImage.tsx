import { memo } from 'react';
import { View } from 'react-native';
import { Image } from '@components/common/CustomImage';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/PillSearchResultDetailScreen';

// 알약 사진·빈 이미지 안내 표시.
const PillDetailImage = ({ uri }: { uri?: string }) => (
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

export default memo(PillDetailImage);
