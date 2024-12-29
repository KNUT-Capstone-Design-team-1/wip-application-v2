import { View, Text, StyleSheet, Platform, TextInput } from "react-native";
import { SectionGrid } from "react-native-super-grid";
import { StatusBarHeight, defaultHeaderHeight, windowHeight } from "@/components/organisms/Layout";
import { idSelectData } from "@/constants/data";
import Button from "@/components/atoms/Button";
import { font, os } from "@/style/font";
import SearchSvg from "@/assets/svgs/search.svg"
import { useSelectSearchId } from "@/hooks/useSelectSearchId";
import SearchIdItem from "../atoms/SearchIdItem";

const SearchIdList = (): JSX.Element => {
  const {
    idText,
    setIdText,
    shapeSelected,
    colorSelected,
    handlePressItem,
    handlePressInit,
    handlePressSearch
  } = useSelectSearchId();

  return (
    <View style={styles.viewWrapper}>
      <SectionGrid
        itemDimension={70}
        fixed={true}
        spacing={16}
        sections={idSelectData}
        keyExtractor={(item, index) => `${item.key} - ${index}`}
        renderItem={({ item }) =>
          <SearchIdItem
            item={item}
            handlePressItem={handlePressItem}
            shapeSelected={shapeSelected}
            colorSelected={colorSelected}
          />
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
                  onChangeText={setIdText}
                  value={idText}
                  autoCapitalize="none"
                  maxLength={10}
                  autoComplete="off"
                  style={styles.sectionTextInput} />
              </View>
            }
          </View>
        }
        renderSectionFooter={() => <View style={{ marginBottom: 21 }} />}
        contentContainerStyle={{ paddingBottom: 48 }}
      />
      <View style={styles.buttonWrapper}>
        <Button.scale onPress={handlePressInit}>
          <View style={styles.resetButton}>
            <Text style={styles.buttonText}>초기화</Text>
          </View>
        </Button.scale>
        <Button.scale onPress={handlePressSearch}>
          <View style={styles.searchButton}>
            <SearchSvg width={14} height={14} color={'#fff'} />
            <Text style={{ color: '#fff', ...styles.buttonText }}>알약 검색하기</Text>
          </View>
        </Button.scale>
      </View>
    </View>
  )
}

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
  sectionHeaderWrapper: {
    width: '100%'
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
    maxHeight: font(16 * 3)
  },
  buttonWrapper: {
    position: 'absolute',
    width: '100%',
    height: 54,
    bottom: 15 + (Platform.OS === 'ios' ? 28 : 0),
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

export default SearchIdList;