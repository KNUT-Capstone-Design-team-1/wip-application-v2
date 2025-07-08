import { StyleSheet, View, Image } from 'react-native';

const HeaderLogo = () => {
  return (
    <View>
      <Image
        style={styles.headerLogo}
        source={require('@assets/images/logo_default.png')} // header에 들어갈 로고이미지.
      />
    </View>
  );
};
const styles = StyleSheet.create({
  headerLogo: { height: '96%', resizeMode: 'contain' },
});

export default HeaderLogo;
