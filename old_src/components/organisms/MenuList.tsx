import Button from '@/components/atoms/Button';
import { font, os } from '@/style/font';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Shadow } from 'react-native-shadow-2';
import Toast from 'react-native-toast-message';

const MenuList = () => {
  const nav: any = useNavigation();

  const handlePressStorageMenu = () => {
    nav.navigate('StorageStack', { screen: '보관함' });
  };

  const handlePressNeerbyMenu = () => {
    Toast.show({ type: 'noteToast', text1: '현재 개발중인 기능입니다.' });
  };

  return (
    <View style={styles.menuListWrapper}>
      <Button.scale style={styles.menu} onPress={handlePressNeerbyMenu}>
        <Shadow
          distance={15}
          offset={[2, 4]}
          startColor="#00000015"
          style={styles.menuShadow}
        >
          <Image
            style={styles.menuBackgroundImage}
            source={require('@assets/images/nearby_image.png')}
          />
          <Text style={styles.menuMainText}>가까운 약국</Text>
          <Text style={styles.menuSubText}>Nearby Pharmacy</Text>
        </Shadow>
      </Button.scale>
      <Button.scale style={styles.menu} onPress={handlePressStorageMenu}>
        <Shadow
          distance={15}
          offset={[2, 4]}
          startColor="#00000015"
          style={styles.menuShadow}
        >
          <Image
            style={styles.menuBackgroundImage}
            source={require('@assets/images/storage_image.png')} // header에 들어갈 로고이미지.
          />
          <Text style={styles.menuMainText}>알약 보관함</Text>
          <Text style={styles.menuSubText}>Pill Storage</Text>
        </Shadow>
      </Button.scale>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: { aspectRatio: '155/130', flex: 1, position: 'relative' },
  menuBackgroundImage: {
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  menuListWrapper: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuMainText: {
    color: '#fff',
    fontFamily: os.font(700, 700),
    fontSize: font(20),
    includeFontPadding: false,
    paddingBottom: 0,
    paddingRight: 16,
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
  },
  menuShadow: {
    borderRadius: 20,
    height: '100%',
    justifyContent: 'flex-end',
    left: 0,
    overflow: 'hidden',
    top: 0,
    width: '100%',
  },
  menuSubText: {
    color: '#fff',
    fontFamily: os.font(500, 500),
    fontSize: font(12),
    includeFontPadding: false,
    paddingBottom: 16,
    paddingRight: 16,
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
  },
});

export default MenuList;
