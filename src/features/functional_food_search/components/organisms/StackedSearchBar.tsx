import { useCallback } from 'react';
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search } from 'lucide-react-native';
import { COLOR, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { fontPx, px } from '@utils/responsive';
import UnderlineInput from '../atoms/UnderlineInput';

interface IStackedSearchBarProps {
  nameKeyword: string;
  onChangeName: (text: string) => void;
  manufacturer: string;
  onChangeManufacturer: (text: string) => void;
  onSubmit: () => void;
  onBack?: () => void;
}

/**
 * 영양제 검색 바 (ai/img.png)
 * - 뒤로가기는 박스 "바깥" 왼쪽 상단에 위치
 * - 흰색 border·shadow 박스가 [제품명/제조사 입력 2줄] + [돋보기]만 감싼다
 */
const StackedSearchBar = ({
  nameKeyword,
  onChangeName,
  manufacturer,
  onChangeManufacturer,
  onSubmit,
  onBack,
}: IStackedSearchBarProps) => {
  const router = useRouter();

  const handleBack = onBack ?? (() => router.back());

  // 검색 실행: 키보드 내리고 검색
  const handleSearch = useCallback(() => {
    Keyboard.dismiss();
    onSubmit();
  }, [onSubmit]);

  return (
    <View style={styles.outer}>
      <TouchableOpacity
        onPress={handleBack}
        style={styles.backButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
      >
        <ChevronLeft
          size={fontPx(24)}
          color={COLOR.secondary}
          strokeWidth={2.5}
        />
      </TouchableOpacity>

      <View style={styles.searchBox}>
        <View style={styles.fields}>
          <UnderlineInput
            value={nameKeyword}
            onChangeText={onChangeName}
            onSubmit={onSubmit}
            placeholder="제품명"
          />
          <UnderlineInput
            value={manufacturer}
            onChangeText={onChangeManufacturer}
            onSubmit={onSubmit}
            placeholder="제조사"
            showUnderline={false}
          />
        </View>

        <TouchableOpacity
          onPress={handleSearch}
          style={styles.searchButton}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
        >
          <Search size={fontPx(22)} color={COLOR_TEXT.sub} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // 뒤로가기(박스 밖) + 검색 박스를 한 줄에, 뒤로가기는 상단 정렬
  outer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: px(4),
    paddingHorizontal: px(12),
    paddingVertical: px(8),
    backgroundColor: COLOR.white,
  },
  // 뒤로가기: 첫 입력줄(상단)에 맞춰 세로 중앙
  backButton: {
    width: px(28),
    height: px(54),
    alignItems: 'center',
    justifyContent: 'center',
  },
  // SearchInput과 동일한 흰색 박스 + border + shadow
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(6),
    backgroundColor: COLOR.white,
    borderRadius: px(16),
    borderWidth: px(1),
    borderColor: COLOR_LINE.border,
    paddingHorizontal: px(14),
    paddingVertical: px(8),
    // 그림자 (iOS)
    shadowColor: COLOR.shadow,
    shadowOffset: { width: 0, height: px(1) },
    shadowOpacity: 0.1,
    shadowRadius: px(2),
    // 그림자 (Android)
    elevation: px(2),
  },
  fields: {
    flex: 1,
    gap: px(4),
  },
  searchButton: {
    width: px(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StackedSearchBar;
