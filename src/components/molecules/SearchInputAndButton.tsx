import SearchIdInput from '@components/organisms/SearchIdInput';
import Button from '@components/atoms/Button';
import { StyleSheet, Text, View } from 'react-native';
import SearchSvg from '@assets/svgs/search.svg';
import { font, os } from '@/style/font';

const SearchInputAndButton = ({
  textInputsObject,
  buttonClickHandler,
}: any) => {
  return (
    <View style={styles.modalSearchWrapper}>
      {/* input이 가로 공간을 최대한 차지하도록 flex:1 추가 */}
      <View style={{ flex: 1, marginLeft: -10 }}>
        <SearchIdInput textInputs={[textInputsObject]} errorState={false} />
      </View>

      {/* 버튼은 내용에 맞는 크기만 차지 */}
      <Button.scale onPress={buttonClickHandler}>
        <View style={styles.searchButton}>
          <SearchSvg width={16} height={16} color={'#fff'} />
          <Text style={styles.buttonText}>검색</Text>
        </View>
      </Button.scale>
    </View>
  );
};

const styles = StyleSheet.create({
  modalSearchWrapper: {
    flexDirection: 'row', // 가로 배치
    alignItems: 'center',
    width: '100%',
    height: 60,
    marginTop: -10,
  },

  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6563ed',
    borderRadius: 8,
    paddingHorizontal: 10, // ← 딱 필요한 만큼만
    height: 43,
    marginTop: 11,
  },

  buttonText: {
    marginLeft: 6,
    color: '#fff',
    fontFamily: os.font(700, 800),
    fontSize: font(12),
  },
});

export default SearchInputAndButton;
