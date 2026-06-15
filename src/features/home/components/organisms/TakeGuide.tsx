import { Image } from '@components/common/CustomImage';
import { View, Text } from 'react-native';
import { TAKE_GUIDE } from '../../constants/TakeGuide';
import { styles } from '../../styles/organisms/TakeGuide';

const TakeGuide = () => {
  return (
    <View style={styles.guideWrapper}>
      <View style={styles.guideContentWrapper}>
        <Text style={styles.guideTitle}>{TAKE_GUIDE.title}</Text>
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
