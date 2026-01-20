import { View, Text, Image, TouchableOpacity } from 'react-native';
import { TAKE_GUIDE } from '../../constants/TakeGuide';
import { styles } from '../../styles/organisms/TakeGuide';
import { useRouter } from 'expo-router';

const TakeGuide = () => {
  const router = useRouter();

  return (
    <View style={styles.guideWrapper}>
      <Text style={styles.guideTitle}>{TAKE_GUIDE.title}</Text>
      <TouchableOpacity
        style={styles.guideMethod}
        // path 변경 예정
        onPress={() => router.push('/storage')}
        activeOpacity={0.7}
      >
        <Text>{TAKE_GUIDE.guideMethod}</Text>
      </TouchableOpacity>
      <Image
        style={styles.guideAlertIcon}
        source={TAKE_GUIDE.icon}
        resizeMode="cover"
      />
    </View>
  );
};

export default TakeGuide;
