import { memo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from 'zustand';
import { useKeywordNavigationContext } from '../../hooks/use_keyword_navigation_context';
import { getKeywordSearchBarStyle } from '../../styles/molecules/KeywordSearchBar';
import KeywordNavigationButton from '../atoms/KeywordNavigationButton';
import KeywordNavigationPosition from '../atoms/KeywordNavigationPosition';

// 우측 하단의 이전·다음 탐색 버튼 배치와 표시 상태 관리.
const KeywordSearchBar = () => {
  const insets = useSafeAreaInsets();
  const { store, controller } = useKeywordNavigationContext();
  const isVisible = useStore(store, (state) => state.isVisible);
  const isSearchOpen = useStore(store, (state) => state.isSearchOpen);
  const hasSearchResults = useStore(
    store,
    (state) => !!state.searchQuery && state.totalCount > 0,
  );
  const canPrevious = useStore(store, (state) => state.canPrevious);
  const canNext = useStore(store, (state) => state.canNext);

  if (!isSearchOpen || !isVisible || !hasSearchResults) return null;

  return (
    <View
      pointerEvents="box-none"
      style={getKeywordSearchBarStyle(insets.bottom)}
    >
      <KeywordNavigationPosition />
      <KeywordNavigationButton
        direction="previous"
        disabled={!canPrevious}
        onPress={controller.previous}
      />
      <KeywordNavigationButton
        direction="next"
        disabled={!canNext}
        onPress={controller.next}
      />
    </View>
  );
};

export default memo(KeywordSearchBar);
