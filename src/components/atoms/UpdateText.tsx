import { font, os } from "@/style/font";
import { StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";

const UpdateText = () => {
  const styles = StyleSheet.create({
    updateViewWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 6,
      paddingTop: 20,
      paddingRight: 20,
      paddingBottom: 12,
    },
    updateText: {
      fontFamily: os.font(400, 500),
      fontSize: font(12),
      color: 'black',
      includeFontPadding: false,
    },
  });

  const REFRESH_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M1.04255 7.1875C1.01447 6.96228 1 6.73286 1 6.5C1 3.46243 3.46243 1 6.5 1C8.21916 1 9.75407 1.78875 10.7626 3.02411M10.7626 3.02411V1M10.7626 3.02411V3.06245L8.70014 3.0625M11.9574 5.8125C11.9856 6.03773 12 6.26714 12 6.5C12 9.53758 9.53758 12 6.5 12C4.85729 12 3.3828 11.2798 2.375 10.138M2.375 10.138V9.9375H4.4375M2.375 10.138V12" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `

  return (
    <View style={styles.updateViewWrapper}>
      <SvgXml xml={REFRESH_ICON} width={13} height={13} />
      <Text style={styles.updateText}>정보 업데이트 날짜 : 2023. 03. 02</Text>
    </View>
  )
}

export default UpdateText;