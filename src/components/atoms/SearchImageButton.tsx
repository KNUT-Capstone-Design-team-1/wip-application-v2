import Button from "@/components/atoms/Button";
import { font, os } from "@/style/font";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, View } from "react-native";
import { Shadow } from "react-native-shadow-2";

const SearchImageButton = (): JSX.Element => {
  const nav: any = useNavigation();

  const styles = StyleSheet.create({
    searchPillButtonWrapper: {
      width: '100%',
    },
    searchPillButton: {
      width: '100%',
      height: 140,
      borderRadius: 20,
      overflow: 'hidden'
    },
    searchPillTextWrapper: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
    },
    searchPillMainText: {
      color: 'white',
      fontSize: font(32),
      fontFamily: os.font(600, 700),
      textAlign: 'right',
      paddingRight: 32,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 25,
      includeFontPadding: false,
    },
    searchPillSubText: {
      color: 'white',
      fontSize: 16,
      fontFamily: os.font(400, 400),
      textAlign: 'right',
      paddingRight: 32,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 25,
      includeFontPadding: false,
    },
    fill: {
      width: '100%',
      height: '100%',
    },
    backgroundImage: {
      position: 'absolute',
      top: '-40%',
      right: '-10%',
      width: '110%',
      height: '110%',
      transform: [{ translateY: 50 }],
    },
  });

  return (
    <Button.scale
      style={styles.searchPillButtonWrapper}
      onPress={() => nav.navigate('알약 검색')}
    >
      <Shadow distance={13} offset={[2, 4]} startColor='#00000015' style={styles.searchPillButton}>
        <View style={styles.fill}>
          <Image
            style={styles.backgroundImage}
            source={require('@assets/images/searchPill.png')} // header에 들어갈 로고이미지.
          />
          <View style={styles.searchPillTextWrapper}>
            <Text style={styles.searchPillMainText}>알약 검색</Text>
            <Text style={styles.searchPillSubText}>Pill Search</Text>
          </View>
        </View>
      </Shadow>
    </Button.scale>
  )
};




export default SearchImageButton;