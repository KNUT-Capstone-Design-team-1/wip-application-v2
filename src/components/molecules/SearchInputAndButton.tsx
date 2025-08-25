import React, { useEffect } from "react";
import SearchIdInput from '@components/organisms/SearchIdInput.tsx';
import Button from '@components/atoms/Button.tsx';
import { StyleSheet, Text, View } from 'react-native';
import SearchSvg from '@assets/svgs/search.svg';
import { font, os } from '@/style/font.ts';

const SearchInputAndButton = ({
  textInputsObject,
  buttonClickHandler,
}: any) => {
  return (
    <View style={styles.modalSearchWrapper}>
      <SearchIdInput textInputs={[textInputsObject]} errorState={false} />
      <Button.scale onPress={buttonClickHandler}>
        <View style={{ ...styles.searchButton, paddingHorizontal: 10 }}>
          <SearchSvg width={14} height={14} color={'#fff'} />
          <Text style={{ color: '#fff', ...styles.buttonText }} />
        </View>
      </Button.scale>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // 검은 배경에 60% 투명도
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ✅ 실제 모달 UI 영역 (불투명)
  modalBox: {
    backgroundColor: '#fff', // 선명한 흰색 배경
    padding: 24,
    borderRadius: 12,
    minWidth: '80%',
    elevation: 4, // 안드로이드 그림자
    shadowColor: '#000', // iOS 그림자
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  text: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    color: '#444',
  },

  modalSearchWrapper: {
    flexDirection: 'row', // 🔥 가로 배치
    alignItems: 'center', // 세로 중앙 정렬
    justifyContent: 'center',
    width: '80%',
    flex: 1,
  },

  marks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },

  mark: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
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
    paddingHorizontal: 120,
    paddingVertical: 12,
  },
  buttonText: {
    fontFamily: os.font(700, 800),
    fontSize: font(16),
    includeFontPadding: false,
    textAlign: 'center',
  },
});

export default SearchInputAndButton;
