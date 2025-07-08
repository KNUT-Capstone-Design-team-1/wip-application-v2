import Button from '@/components/atoms/Button';
import { Image, View, Text, StyleSheet } from 'react-native';
import { font, os } from '@/style/font';
import { useNavigation } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';

const SearchButtonList = () => {
  const nav: any = useNavigation();

  const handlePressSearchIdButton = () => {
    nav.navigate('알약 식별 검색');
  };

  const handlePressSearchImageButton = () => {
    nav.navigate('촬영 가이드');
  };

  return (
    <View style={styles.buttonListWrapper}>
      <Button.scale style={styles.button} onPress={handlePressSearchIdButton}>
        <Shadow
          distance={15}
          offset={[2, 4]}
          startColor="#00000015"
          style={styles.buttonShadow}
        >
          <Image
            style={styles.buttonBackgroundImage}
            source={require('@assets/images/searchId_image.png')}
          />
          <Text style={styles.buttonTitle}>식별 검색</Text>
          <Text style={styles.buttonContents}>Pill Id Search</Text>
        </Shadow>
      </Button.scale>
      <Button.scale
        style={styles.button}
        onPress={handlePressSearchImageButton}
      >
        <Shadow
          distance={15}
          offset={[2, 4]}
          startColor="#00000015"
          style={styles.buttonShadow}
        >
          <Image
            style={styles.buttonBackgroundImage}
            source={require('@assets/images/searchImg_image.png')}
          />
          <Text style={styles.buttonTitle}>이미지 검색</Text>
          <Text style={styles.buttonContents}>Pill Image Search</Text>
        </Shadow>
      </Button.scale>
    </View>
  );
};

const styles = StyleSheet.create({
  button: { aspectRatio: '155/130', flex: 1, position: 'relative' },
  buttonBackgroundImage: {
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  buttonContents: {
    color: '#fff',
    fontFamily: os.font(500, 500),
    fontSize: font(12),
    includeFontPadding: false,
    paddingBottom: 16,
    paddingRight: 16,
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
  },
  buttonListWrapper: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
  },
  buttonShadow: {
    borderRadius: 20,
    height: '100%',
    justifyContent: 'flex-end',
    left: 0,
    overflow: 'hidden',
    top: 0,
    width: '100%',
  },
  buttonTitle: {
    color: '#fff',
    fontFamily: os.font(700, 700),
    fontSize: font(24),
    includeFontPadding: false,
    paddingBottom: 0,
    paddingRight: 16,
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
  },
});

export default SearchButtonList;
