import { Image } from '@components/common/CustomImage';
import { View } from 'react-native';
import { TAKE_GUIDE } from '../../constants/TakeGuide';
import { styles } from '../../styles/organisms/TakeGuide';
import { BaseText } from '@components/common/BaseText';

const TakeGuide = () => {
  return (
    <View style={styles.guideWrapper}>
      <View style={styles.guideContentWrapper}>
        <BaseText weight={'bold'} size={13} style={styles.guideTitle}>
          {TAKE_GUIDE.title}
        </BaseText>
        <Image
          style={styles.guideAlertIcon}
          source={TAKE_GUIDE.icon}
          contentFit="cover"
        />
      </View>
    </View>
  );
};

export default TakeGuide;
