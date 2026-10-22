import { memo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from 'zustand';
import { useKeywordNavigationActions } from '../../hooks/use_keyword_navigation_actions';
import { useKeywordNavigationContext } from '../../hooks/use_keyword_navigation_context';
import { getKeywordSearchBarStyle } from '../../styles/molecules/KeywordSearchBar';
import KeywordNavigationButton from '../atoms/KeywordNavigationButton';
import KeywordNavigationPosition from '../atoms/KeywordNavigationPosition';

// 우측 하단의 이전·다음 탐색 버튼 배치와 표시 상태 관리.
const KeywordSearchBar = () => {
  const insets = useSafeAreaInsets();
  const { store } = useKeywordNavigationContext();
  const isVisible = useStore(store, (state) => state.isVisible);
  const isSearchOpen = useStore(store, (state) => state.isSearchOpen);
  const hasKeywords = useStore(store, (state) => state.keywords.length > 0);
  const canPrevious = useStore(store, (state) => state.canPrevious);
  const canNext = useStore(store, (state) => state.canNext);
  const { previous, next } = useKeywordNavigationActions();

  if (isSearchOpen || !isVisible || !hasKeywords) return null;

  return (
    <View
      pointerEvents="box-none"
      style={getKeywordSearchBarStyle(insets.bottom)}
    >
      <KeywordNavigationButton
        direction="previous"
        disabled={!canPrevious}
        onPress={previous}
      />
      <KeywordNavigationPosition />
      <KeywordNavigationButton
        direction="next"
        disabled={!canNext}
        onPress={next}
      />
    </View>
  );
};

export default memo(KeywordSearchBar);
