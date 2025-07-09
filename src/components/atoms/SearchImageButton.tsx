import Button from '@/components/atoms/Button';
import { font, os } from '@/style/font';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

const SearchImageButton = (): JSX.Element => {
  const nav: any = useNavigation();

  const styles = StyleSheet.create({
    backgroundImage: {
      height: '110%',
      position: 'absolute',
      right: '-10%',
      top: '-40%',
      transform: [{ translateY: 50 }],
      width: '110%',
    },
    fill: { height: '100%', width: '100%' },
    searchPillButton: {
      borderRadius: 20,
      height: 140,
      overflow: 'hidden',
      width: '100%',
    },
    searchPillButtonWrapper: { paddingTop: 16, width: '100%' },
    searchPillMainText: {
      color: 'white',
      fontFamily: os.font(600, 700),
      fontSize: font(32),
      includeFontPadding: false,
      paddingRight: 32,
      textAlign: 'right',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 25,
    },
    searchPillSubText: {
      color: 'white',
      fontFamily: os.font(400, 400),
      fontSize: 16,
      includeFontPadding: false,
      paddingRight: 32,
      textAlign: 'right',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 25,
    },
    searchPillTextWrapper: {
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    },
  });

  return (
    <Button.scale
      style={styles.searchPillButtonWrapper}
      onPress={() => nav.navigate('알약 이미지 검색')}
    >
      <Shadow
        distance={13}
        offset={[2, 4]}
        startColor="#00000015"
        style={styles.searchPillButton}
      >
        <View style={styles.fill}>
          <Image
            style={styles.backgroundImage}
            source={require('@assets/images/searchPill.png')} // header에 들어갈 로고이미지.
          />
          <View style={styles.searchPillTextWrapper}>
            <Text style={styles.searchPillMainText}>이미지 검색</Text>
            <Text style={styles.searchPillSubText}>Pill Image Search</Text>
          </View>
        </View>
      </Shadow>
    </Button.scale>
  );
};

export default SearchImageButton;
