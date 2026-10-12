import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { fontPx, px } from '@utils/responsive';

interface ISearchBarHeaderProps {
  // 검색 입력 slot (UnifiedSearchBar / SearchInput 등)
  children: ReactNode;
  // 뒤로가기 동작 (기본: router.back())
  onBack?: () => void;
}

/**
 * 뒤로가기 버튼과 검색 입력을 한 줄에 배치하는 공용 헤더 셸
 * 식별/통합 검색(SearchHeader)에서 사용한다.
 */
const SearchBarHeader = ({ children, onBack }: ISearchBarHeaderProps) => {
  const router = useRouter();

  const handleBack = onBack ?? (() => router.back());

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft
            size={fontPx(24)}
            color={COLOR.secondary}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.white,
    paddingHorizontal: px(8),
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: px(54),
    paddingRight: px(12),
    gap: px(4),
  },
  backButton: {
    width: px(40),
    height: px(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBarHeader;
