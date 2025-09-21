import { View, Text, StyleSheet } from 'react-native';
import { SectionGrid } from 'react-native-super-grid';
import { idSelectData } from '@/constants/data';
import Button from '@/components/atoms/Button';
import { font, os } from '@/style/font';
import SearchSvg from '@/assets/svgs/search.svg';
import { useSelectSearchId } from '@/hooks/useSelectSearchId';
import SearchIdInput from '@/components/organisms/SearchIdInput';
import SearchIdItem from '@/components/atoms/SearchIdItem';
import SelectedMark from '@/components/organisms/SelectedMark';

const SearchIdList = (): React.JSX.Element => {
  const {
    btnState,
    idFrontText,
    idBackText,
    productText,
    companyText,
    handleSetIdText,
    shapeSelected,
    colorSelected,
    formCodeSelected,
    dividingSelected,
    handlePressItem,
    handlePressInit,
    handlePressSearch,
  } = useSelectSearchId();

  // 조건에 따른 컴포넌트 생성 방법 분리
  const renderInputByType = (section: any) => {
    // 앞면, 뒷면 문자 input
    if (section.type === 'char') {
      return (
        <SearchIdInput
          label={section.label}
          textInputs={[
            {
              placeholder: section.placeholder[0],
              placeholderTextColor: '#cacaca',
              onChangeText: (val) =>
                handleSetIdText({ text: val, direction: 'front' }),
              value: idFrontText,
            },
            {
              placeholder: section.placeholder[1],
              placeholderTextColor: '#cacaca',
              onChangeText: (val) =>
                handleSetIdText({ text: val, direction: 'back' }),
              value: idBackText,
            },
          ]}
          errorState={btnState}
          errorLabel="'*' 또는 '?'를 제외하고 입력하세요"
        />
      );
    }

    // 알약 제품명, 회사 정보 input
    if (section.type === 'info') {
      return (
        <SearchIdInput
          label={section.label}
          textInputs={[
            {
              placeholder: section.placeholder[0],
              placeholderTextColor: '#cacaca',
              onChangeText: (val) =>
                handleSetIdText({ text: val, direction: 'product' }),
              value: productText,
            },
            {
              placeholder: section.placeholder[1],
              placeholderTextColor: '#cacaca',
              onChangeText: (val) =>
                handleSetIdText({ text: val, direction: 'company' }),
              value: companyText,
            },
          ]}
          errorState={btnState}
          errorLabel="'*' 또는 '?'를 제외하고 입력하세요"
        />
      );
    }

    // 알약 마크 ui
    if (section.type === 'mark') {
      return (
        <View style={{ marginTop: '-20%' }}>
          <SelectedMark />
        </View>
      );
    }

    return null;
  };

  return (
    <>
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
                colorSelected.includes(item.category + item.key) ||
                formCodeSelected.includes(item.category + item.key) ||
                dividingSelected.includes(item.category + item.key)
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
              {section.data.length === 0 && renderInputByType(section)}
            </View>
          )}
          renderSectionFooter={() => <View style={{ marginBottom: 21 }} />}
          contentContainerStyle={{ paddingBottom: 48 }}
        />
      </View>
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
    </>
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
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'absolute',
    width: '100%',
    paddingVertical: 4,
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
    overflow: 'hidden',
    paddingTop: 21,
  },
});

export default SearchIdList;
