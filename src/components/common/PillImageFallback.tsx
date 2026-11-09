import { Image } from './CustomImage';
import { StyleSheet } from 'react-native';

export default function PillImageFallback() {
  return (
    <Image
      source={require('@assets/icons/splash-icon-no-title.png')}
      style={styles.logo}
      contentFit="contain"
      accessibilityLabel="이게뭐약 앱 로고"
    />
  );
}

const styles = StyleSheet.create({
  logo: { width: '70%', height: '70%', alignSelf: 'center' },
});
