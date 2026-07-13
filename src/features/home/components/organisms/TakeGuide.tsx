import { View } from 'react-native';
import { TAKE_GUIDE } from '../../constants/TakeGuide';
import { styles } from '../../styles/organisms/TakeGuide';
import { BaseText } from '@components/common/BaseText';

const TakeGuide = () => {
  return (
    <View style={styles.guideWrapper}>
      <View style={styles.guideContentWrapper}>
        <BaseText weight={'bold'} size={13} style={styles.guideTitle}>
          {TAKE_GUIDE.title1}
        </BaseText>
        <BaseText weight={'bold'} size={13} style={styles.guideTitle}>
          {TAKE_GUIDE.title2}
        </BaseText>
      </View>
    </View>
  );
};

export default TakeGuide;
