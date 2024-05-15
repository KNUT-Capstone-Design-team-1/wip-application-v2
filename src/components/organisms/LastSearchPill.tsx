import Button from "@/components/atoms/Button";
import { font, os } from "@/style/font";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";

const LastSearchPill = () => {
  const styles = StyleSheet.create({
    lastSearchPillWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingTop: 24,
      paddingBottom: 16,
    },
    lastSearchPillText: {
      color: '#000',
      fontSize: font(15),
      fontFamily: os.font(500, 600),
      includeFontPadding: false,
    },
    lastSearchIcon: {
      flex: 1,
      justifyContent: 'center',
      marginTop: 3,
    },
    lastSearchPillListWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 7,
      rowGap: 9,
      marginBottom: 30,
    },
    lastSearchPillList: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingTop: 4,
      paddingBottom: 7,
      paddingHorizontal: 13,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: '#cdcdcd'
    },
    lastSearchPillListText: {
      color: '#000',
      fontSize: font(12),
      fontFamily: os.font(400, 500),
      includeFontPadding: false,
    },
  })

  const SEARCH_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M10.115 10.0941L13 13M11.6667 6.33333C11.6667 9.27887 9.27887 11.6667 6.33333 11.6667C3.38781 11.6667 1 9.27887 1 6.33333C1 3.38781 3.38781 1 6.33333 1C9.27887 1 11.6667 3.38781 11.6667 6.33333Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `

  const lastSearchList = ['칸살탄정', '올메르탄플러스정', '펜폴캡슐', '온글라이자정', '실버셉트오디정']

  return (
    <>
      <View style={styles.lastSearchPillWrapper}>
        <SvgXml xml={SEARCH_ICON} width={16} height={16} style={styles.lastSearchIcon} />
        <Text style={styles.lastSearchPillText}>
          최근 검색한 알약
        </Text>
      </View>
      <View style={styles.lastSearchPillListWrapper}>
        {lastSearchList.map((i: string, key: number) =>
          <Button.scale activeScale={0.9} key={key}>
            <View style={styles.lastSearchPillList}>
              <Text style={styles.lastSearchPillListText}>{i}</Text>
            </View>
          </Button.scale>
        )}
      </View>
    </>
  )

}

export default LastSearchPill;