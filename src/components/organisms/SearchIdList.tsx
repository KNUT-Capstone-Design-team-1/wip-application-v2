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
    btnState,
    idFrontText,
    idBackText,
    handleSetIdText,
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
                <Text style={styles.sectionTextInputLabel}>앞면 또는 뒷면 식별 문자 (선택)</Text>
                <View style={styles.sectionTextInputSplitWrapper}>
                  <TextInput
                    placeholder="앞면 문자"
                    placeholderTextColor={"#cacaca"}
                    onChangeText={(val) => handleSetIdText({ text: val, direction: "front" })}
                    value={idFrontText}
                    autoCapitalize="none"
                    maxLength={10}
                    autoComplete="off"
                    inputMode="text"
                    style={[styles.sectionTextInput, btnState && styles.error]} />
                  <TextInput
                    placeholder="뒷면 문자"
                    placeholderTextColor={"#cacaca"}
                    onChangeText={(val) => handleSetIdText({ text: val, direction: "back" })}
                    value={idBackText}
                    autoCapitalize="none"
                    maxLength={10}
                    autoComplete="off"
                    inputMode="text"
                    style={[styles.sectionTextInput, btnState && styles.error]} />
                </View>
                <View style={styles.sectionErrorWrapper}>
                  {btnState ? <Text style={styles.sectionTextInputError}>'*' 또는 '?'를 제외하고 입력하세요</Text> : null}
                </View>
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
            <Text style={{ color: '#000', ...styles.buttonText }}>초기화</Text>
          </View>
        </Button.scale>
        <Button.scale onPress={handlePressSearch} disabled={btnState}>
          <View style={[styles.searchButton, btnState && styles.btnDisabled]}>
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
    color: '#000'
  },
  sectionTextInputWrapper: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionTextInputLabel: {
    paddingLeft: 4,
    paddingBottom: 4,
    fontSize: font(14),
    fontFamily: os.font(600, 700),
    color: "#7472EB",
    includeFontPadding: false
  },
  sectionTextInputSplitWrapper: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    width: '100%',
  },
  sectionTextInput: {
    flex: 1,
    paddingVertical: 8,
    paddingStart: 16,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#858585',
    fontSize: font(16),
    fontFamily: os.font(700, 800),
    includeFontPadding: false,
    maxHeight: font(16 * 3),
    color: "#000",
    backgroundColor: '#fff'
  },
  sectionErrorWrapper: {
    minHeight: 21
  },
  sectionTextInputError: {
    alignSelf: 'flex-start',
    paddingRight: 4,
    fontSize: font(13),
    fontFamily: os.font(600, 700),
    color: "#f00",
    includeFontPadding: false
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
    textAlign: 'center',
  },
  error: {
    borderColor: '#f00'
  },
  btnDisabled: {
    borderColor: '#cacaca',
    backgroundColor: '#cacaca'
  }
})

export default SearchIdList;