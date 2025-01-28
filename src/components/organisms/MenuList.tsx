import Button from "@/components/atoms/Button";
import { font, os } from "@/style/font";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Shadow } from "react-native-shadow-2";
import Toast from "react-native-toast-message";

const MenuList = () => {
  const nav: any = useNavigation();

  const handlePressStorageMenu = () => {
    nav.navigate('StorageStack', { screen: '보관함' });
  }

  const handlePressNeerbyMenu = () => {
    Toast.show({
      type: 'noteToast',
      text1: '현재 개발중인 기능입니다.',
    });
  }

  return (
    <View style={styles.menuListWrapper}>
      <Button.scale style={styles.menu} onPress={handlePressNeerbyMenu}>
        <Shadow distance={15} offset={[2, 4]} startColor='#00000015' style={styles.menuShadow}>
          <Image
            style={styles.menuBackgroundImage}
            source={require('@assets/images/nearby_image.png')}
          />
          <Text style={styles.menuMainText}>가까운 약국</Text>
          <Text style={styles.menuSubText}>Nearby Pharmacy</Text>
        </Shadow>
      </Button.scale>
      <Button.scale style={styles.menu} onPress={handlePressStorageMenu}>
        <Shadow distance={15} offset={[2, 4]} startColor='#00000015' style={styles.menuShadow}>
          <Image
            style={styles.menuBackgroundImage}
            source={require('@assets/images/storage_image.png')} // header에 들어갈 로고이미지.
          />
          <Text style={styles.menuMainText}>알약 보관함</Text>
          <Text style={styles.menuSubText}>Pill Storage</Text>
        </Shadow>
      </Button.scale>
    </View>
  )
}

const styles = StyleSheet.create({
  menuListWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 20,
  },
  menu: {
    position: 'relative',
    flex: 1,
    aspectRatio: '155/130',
  },
  menuMainText: {
    color: '#fff',
    fontSize: font(20),
    fontFamily: os.font(700, 700),
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
    paddingRight: 16,
    paddingBottom: 0,
    includeFontPadding: false,
  },
  menuSubText: {
    color: '#fff',
    fontSize: font(12),
    fontFamily: os.font(500, 500),
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
    paddingRight: 16,
    paddingBottom: 16,
    includeFontPadding: false,
  },
  menuBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  menuShadow: {
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    borderRadius: 20,
    overflow: 'hidden',
  },
})

export default MenuList;