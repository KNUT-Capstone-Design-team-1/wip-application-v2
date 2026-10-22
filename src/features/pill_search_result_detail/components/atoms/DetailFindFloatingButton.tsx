import { TouchableOpacity } from 'react-native';
import { useStore } from 'zustand';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { useKeywordNavigationContext } from '../../hooks/use_keyword_navigation_context';
import { styles } from '../../styles/atoms/DetailFindFloatingButton';
import { Search } from 'lucide-react-native';

// 검색창이 열린 동안 불투명하게 표시되는 우측 상단 검색 버튼.
const DetailFindFloatingButton = () => {
  const { store } = useKeywordNavigationContext();
  const isSearchOpen = useStore(store, (state) => state.isSearchOpen);

  return (
    <TouchableOpacity
      style={[styles.button, isSearchOpen && styles.active]}
      activeOpacity={1}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel="상세 정보에서 찾기"
      accessibilityHint="검색어를 입력해 본문에서 찾습니다"
      accessibilityState={{ expanded: isSearchOpen }}
      onPress={() => store.getState().setSearchOpen(true)}
    >
      <Search size={fontPx(24)} strokeWidth={2} color={COLOR_TEXT.white} />
    </TouchableOpacity>
  );
};

export default DetailFindFloatingButton;
