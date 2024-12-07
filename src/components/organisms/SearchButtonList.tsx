import Button from "@/components/atoms/Button";
import { Image, View, Text, StyleSheet } from "react-native"
import { font, os } from "@/style/font"
import { useNavigation } from "@react-navigation/native"
import { Shadow } from "react-native-shadow-2";

const SearchButtonList = () => {
  const nav: any = useNavigation()

  const handlePressSearchIdButton = () => {
    nav.navigate('알약 식별 검색')
  }

  const handlePressSearchImageButton = () => {
    nav.navigate('알약 이미지 검색')
  }

  const styles = StyleSheet.create({
    buttonListWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 20,
    },
    button: {
      position: 'relative',
      flex: 1,
      aspectRatio: '155/130'
    },
    buttonTitle: {
      color: '#fff',
      fontSize: font(24),
      fontFamily: os.font(700, 700),
      textAlign: 'right',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 25,
      paddingRight: 16,
      paddingBottom: 0,
      includeFontPadding: false,
    },
    buttonContents: {
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
    buttonBackgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    },
    buttonShadow: {
      justifyContent: 'flex-end',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      borderRadius: 20,
      overflow: 'hidden',
    },
  })

  return (
    <View style={styles.buttonListWrapper}>
      <Button.scale style={styles.button} onPress={handlePressSearchIdButton}>
        <Shadow distance={15} offset={[2, 4]} startColor='#00000015' style={styles.buttonShadow}>
          <Image
            style={styles.buttonBackgroundImage}
            source={require('@assets/images/nearby_image.png')}
          />
          <Text style={styles.buttonTitle}>식별 검색</Text>
          <Text style={styles.buttonContents}>Pill Id Search</Text>
        </Shadow>
      </Button.scale>
      <Button.scale style={styles.button} onPress={handlePressSearchImageButton}>
        <Shadow distance={15} offset={[2, 4]} startColor='#00000015' style={styles.buttonShadow}>
          <Image
            style={styles.buttonBackgroundImage}
            source={require('@assets/images/nearby_image.png')}
          />
          <Text style={styles.buttonTitle}>이미지 검색</Text>
          <Text style={styles.buttonContents}>Pill Image Search</Text>
        </Shadow>
      </Button.scale>
    </View>
  )
}

export default SearchButtonList