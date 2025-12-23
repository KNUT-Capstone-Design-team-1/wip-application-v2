import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

const HeaderLogo = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.headerLogo}
        source={require('@assets/images/logo_default.png')} // header에 들어갈 로고이미지.
        contentFit="contain"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    width: 100,
    height: '100%',
  },
});

export default HeaderLogo;
