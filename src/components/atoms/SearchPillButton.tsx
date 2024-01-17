import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Shadow } from "react-native-shadow-2";

const SearchPillButton = (): JSX.Element => {
  const styles = StyleSheet.create({
    searchPillButtonWrapper: {
      width: '100%',
    },
    searchPillButton: {
      width: '100%',
      height: 140,
      borderRadius: 25,
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
      fontSize: 32,
      fontWeight: '900',
      fontFamily: 'Noto Sans',
      textAlign: 'right',
      paddingRight: 32,
      paddingBottom: 4,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 25,
    },
    searchPillSubText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
      fontFamily: 'Noto Sans',
      textAlign: 'right',
      paddingRight: 32,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 25,
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
    <View style={styles.searchPillButtonWrapper}>
      <Shadow distance={13} offset={[2, 4]} startColor='#00000015' style={styles.searchPillButton}>
        <TouchableOpacity style={styles.fill}>
          <Image
            style={styles.backgroundImage}
            source={require('@assets/images/searchPill.png')} // header에 들어갈 로고이미지.
          />
          <View style={styles.searchPillTextWrapper}>
            <Text style={styles.searchPillMainText}>알약 검색</Text>
            <Text style={styles.searchPillSubText}>Pill Search</Text>
          </View>
        </TouchableOpacity>
      </Shadow>
    </View>
  )
};




export default SearchPillButton;