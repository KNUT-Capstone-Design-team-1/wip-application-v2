import { View, Text, StyleSheet, Platform } from 'react-native';
import { SectionGrid } from 'react-native-super-grid';
import {
  StatusBarHeight,
  defaultHeaderHeight,
  windowHeight,
} from '@/components/organisms/Layout';
import { idSelectData } from '@/constants/data';
import Button from '@/components/atoms/Button';
import { font, os } from '@/style/font';
import SearchSvg from '@/assets/svgs/search.svg';
import { useSelectSearchId } from '@/hooks/useSelectSearchId';
import SearchIdInput from '@/components/organisms/SearchIdInput';
import SearchIdItem from '@/components/atoms/SearchIdItem';

const SearchIdList = (): React.JSX.Element => {
  const {
    btnState,
    idFrontText,
    idBackText,
    handleSetIdText,
    shapeSelected,
    colorSelected,
    handlePressItem,
    handlePressInit,
    handlePressSearch,
  } = useSelectSearchId();

  return (
    <View style={styles.viewWrapper}>
      <SectionGrid
        itemDimension={70}
        fixed={true}
        spacing={16}
        sections={idSelectData}
        keyExtractor={(item, index) => `${item.key} - ${index}`}
        renderItem={({ item }) => (
          <SearchIdItem
            text={item.name}
            handlePressItem={() => handlePressItem(item)}
            backgroundColor={item.color}
            selectColor="#7472EB"
            isSelected={
              shapeSelected.includes(item.category + item.key) ||
                colorSelected.includes(item.category + item.key)
                ? true
                : false
            }
          >
            {item.icon ? item.icon : null}
          </SearchIdItem>
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeaderWrapper}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
            {section.data.length ? null : (
              <SearchIdInput
                label="앞면 또는 뒷면 식별 문자 (선택)"
                textInputs={[
                  {
                    placeholder: '앞면 문자',
                    placeholderTextColor: '#cacaca',
                    onChangeText: (val) =>
                      handleSetIdText({ text: val, direction: 'front' }),
                    value: idFrontText,
                  },
                  {
                    placeholder: '뒷면 문자',
                    placeholderTextColor: '#cacaca',
                    onChangeText: (val) =>
                      handleSetIdText({ text: val, direction: 'back' }),
                    value: idBackText,
                  },
                ]}
                errorState={btnState}
                errorLabel="'*' 또는 '?'를 제외하고 입력하세요"
              />
            )}
          </View>
        )}
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
            <Text style={{ color: '#fff', ...styles.buttonText }}>
              알약 검색하기
            </Text>
          </View>
        </Button.scale>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnDisabled: { backgroundColor: '#cacaca', borderColor: '#cacaca' },
  buttonText: {
    fontFamily: os.font(700, 800),
    fontSize: font(16),
    includeFontPadding: false,
    textAlign: 'center',
  },
  buttonWrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    bottom: 15 + (Platform.OS === 'ios' ? 28 : 10),
    flexDirection: 'row',
    height: 54,
    justifyContent: 'space-evenly',
    position: 'absolute',
    width: '100%',
  },
  error: { borderColor: '#f00' },
  resetButton: {
    backgroundColor: '#fff',
    borderColor: '#cacaca',
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: '#6563ed',
    borderColor: '#6563ed',
    borderRadius: 8,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  sectionHeaderText: {
    color: '#000',
    fontFamily: os.font(700, 800),
    fontSize: font(18),
    includeFontPadding: false,
    textAlign: 'center',
  },
  sectionHeaderWrapper: { width: '100%' },
  viewWrapper: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: windowHeight - (defaultHeaderHeight + StatusBarHeight),
    overflow: 'hidden',
    paddingBottom: 15 + (Platform.OS === 'ios' ? 28 : 0),
    paddingTop: 21,
  },
});

export default SearchIdList;
