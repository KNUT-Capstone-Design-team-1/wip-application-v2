import { font, os } from "@/style/font";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";

const TakeGuide = () => {
  const styles = StyleSheet.create({
    takeGuide: {
      gap: 6,
      alignItems: 'center',
      paddingBottom: 25,
    },
    takeGuideText1: {
      paddingBottom: 0,
      fontSize: font(12),
      fontFamily: os.font(700, 700),
      color: '#9B0505',
      includeFontPadding: false,
    },
    takeGuideText2: {
      paddingBottom: 3,
      fontSize: font(11),
      fontFamily: os.font(500, 500),
      color: '#000',
      includeFontPadding: false,
    },
    takeGuideButtonWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    }
  });

  const RIGHTARROW_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="4" height="8" viewBox="0 0 4 8" fill="none">
      <path d="M0.165111 7.82245C0.382567 8.05918 0.735166 8.05918 0.952617 7.82245L3.67418 4.85655C4.10875 4.38301 4.10858 3.61564 3.67384 3.14229L0.950613 0.177561C0.733162 -0.0591871 0.380563 -0.0591871 0.163101 0.177561C-0.0543669 0.414316 -0.0543669 0.798162 0.163101 1.03492L2.49387 3.57241C2.71138 3.80915 2.71138 4.19302 2.49387 4.42976L0.165111 6.96511C-0.0523569 7.20184 -0.0523569 7.58565 0.165111 7.82245Z" fill="#0F0F0F"/>
  </svg>
  `

  return (
    <View style={styles.takeGuide}>
      <Text style={styles.takeGuideText1}>
        약의 오용과 남용은 오히려 건강을 해칠수 있습니다.
      </Text>
      <TouchableOpacity style={styles.takeGuideButtonWrapper}>
        <Text style={styles.takeGuideText2}>
          올바른 복용법 보러가기
        </Text>
        <SvgXml xml={RIGHTARROW_ICON} />
      </TouchableOpacity>
    </View>
  )
}


export default TakeGuide;