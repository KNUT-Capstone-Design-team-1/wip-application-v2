import { View, Text, StyleSheet, Platform } from "react-native";
import { SectionGrid } from "react-native-super-grid";
import { StatusBarHeight, defaultHeaderHeight, windowHeight } from "@/components/organisms/Layout";
import { idSelectData } from "@/constants/data";
import Button from "@/components/atoms/Button";
import { font, os } from "@/style/font";
import SearchSvg from "@/assets/svgs/search.svg"
import { useSelectSearchId } from "@/hooks/useSelectSearchId";
import SearchIdItem from "../atoms/SearchIdItem";
import SearchIdInput from "@/components/organisms/SearchIdInput";

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
            text={item.name}
            handlePressItem={() => handlePressItem(item)}
            backgroundColor={item.color}
            selectColor='#7472EB'
            isSelected={shapeSelected.includes(item.category + item.key) || colorSelected.includes(item.category + item.key) ? true : false}
          >{item.icon ? item.icon : null}</SearchIdItem>
        }
        renderSectionHeader={({ section }) =>
          <View style={styles.sectionHeaderWrapper}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
            {section.data.length ? null :
              <SearchIdInput
                label="앞면 또는 뒷면 식별 문자 (선택)"
                textInputs={
                  [
                    {
                      placeholder: "앞면 문자",
                      placeholderTextColor: "#cacaca",
                      onChangeText: (val) => handleSetIdText({ text: val, direction: "front" }),
                      value: idFrontText,
                    },
                    {
                      placeholder: "뒷면 문자",
                      placeholderTextColor: "#cacaca",
                      onChangeText: (val) => handleSetIdText({ text: val, direction: "back" }),
                      value: idBackText,
                    }
                  ]
                }
                errorState={btnState}
                errorLabel="'*' 또는 '?'를 제외하고 입력하세요"
              />
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