import { View, Text, StyleSheet, Platform, TextInput } from "react-native";
import { StatusBarHeight, defaultHeaderHeight, windowHeight } from "@/components/organisms/Layout";
import { SectionGrid } from "react-native-super-grid";
import { Shadow } from "react-native-shadow-2";
import { idSelectData } from "@/constans/data";
import Button from "@/components/atoms/Button";
import { font, os } from "@/style/font";
import SearchSvg from "@/assets/svgs/search.svg"

const SearchIdList = (): JSX.Element => {
  const styles = StyleSheet.create({
    viewWrapper: {
      minHeight: windowHeight - (defaultHeaderHeight + StatusBarHeight),
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      overflow: 'hidden',
      paddingTop: 21,
      paddingBottom: 15 + (Platform.OS === 'ios' ? 28 : 0),
      backgroundColor: '#ffffff',
    },
    itemButtonWrapper: {
      width: '100%',
    },
    itemButton: {
      width: '100%',
      height: 70,
      borderRadius: 8,
      paddingVertical: 10,
    },
    itemIconWrapper: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      paddingBottom: 8,
    },
    itemTextWrapper: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
    },
    itemText: {
      fontSize: font(14),
      fontFamily: os.font(600, 700),
      includeFontPadding: false,
      textAlign: 'center',
    },
    sectionHeaderWrapper: {
    },
    sectionHeaderText: {
      fontSize: font(18),
      fontFamily: os.font(700, 800),
      textAlign: 'center',
      includeFontPadding: false,
    },
    sectionTextInputWrapper: {
      width: "100%",
      paddingHorizontal: 16,
      paddingTop: 8,
      marginBottom: 8,
    },
    sectionTextInputLabel: {
      paddingBottom: 4,
      fontSize: font(14),
      fontFamily: os.font(600, 700),
      color: "#7472EB",
      includeFontPadding: false
    },
    sectionTextInput: {
      paddingVertical: 8,
      paddingStart: 16,
      borderWidth: 2,
      borderRadius: 8,
      borderColor: '#cacaca',
      fontSize: font(16),
      fontFamily: os.font(700, 800),
      includeFontPadding: false,
    },
    buttonWrapper: {
      position: 'absolute',
      width: '100%',
      height: 54,
      bottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.8)'
    },
    resetButton: {
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 32,
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: '#cacaca',
      backgroundColor: '#fff'
    },
    searchButton: {
      flexDirection: 'row',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 32,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      borderWidth: 1.5,
      borderColor: '#7472EB',
      backgroundColor: '#7472EB'
    },
    buttonText: {
      fontSize: font(16),
      fontFamily: os.font(700, 800),
      includeFontPadding: false,
      textAlign: 'center'
    }
  })

  return (
    <View style={styles.viewWrapper}>
      <SectionGrid
        itemDimension={70}
        fixed={true}
        spacing={16}
        sections={idSelectData}
        renderItem={({ item }) =>
          <Button.scale style={styles.itemButtonWrapper}>
            <Shadow distance={6} style={styles.itemButton}>
              {item.icon ?
                <View style={styles.itemIconWrapper}>
                  {item.icon}
                </View> :
                null}
              <View style={styles.itemTextWrapper}>
                <Text style={styles.itemText}>{item.name}</Text>
              </View>
            </Shadow>
          </Button.scale>
        }
        renderSectionHeader={({ section }) =>
          <View style={styles.sectionHeaderWrapper}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
            {section.data.length ? null :
              <View style={styles.sectionTextInputWrapper}>
                <Text style={styles.sectionTextInputLabel}>앞면 또는 뒷면 식별 문자</Text>
                <TextInput
                  placeholder="식별 문자 (선택)"
                  placeholderTextColor={"#cacaca"}
                  style={styles.sectionTextInput} />
              </View>
            }
          </View>
        }
        renderSectionFooter={() => <View style={{ marginBottom: 21 }} />}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
      <View style={styles.buttonWrapper}>
        <Button.scale>
          <View style={styles.resetButton}>
            <Text style={{ ...styles.buttonText }}>초기화</Text>
          </View>
        </Button.scale>
        <Button.scale>
          <View style={styles.searchButton}>
            <SearchSvg width={14} height={14} color={'#fff'} />
            <Text style={{ color: '#fff', ...styles.buttonText }}>알약 검색하기</Text>
          </View>
        </Button.scale>
      </View>
    </View>
  )
}

export default SearchIdList;