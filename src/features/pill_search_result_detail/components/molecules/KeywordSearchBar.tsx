import { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from 'zustand';
import { COLOR_TEXT } from '@constants/color';
import { fontPx, px } from '@utils/responsive';
import { KEYWORD_HIGHLIGHT_STYLE } from '../../constants/keyword_highlight';
import { useKeywordNavigationActions } from '../../hooks/use_keyword_navigation_actions';
import { useKeywordNavigationContext } from '../../hooks/use_keyword_navigation_context';
import { styles } from '../../styles/molecules/KeywordSearchBar';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

// 본문 위에 고정되는 이전·다음 원형 버튼.
const KeywordSearchBar = () => {
  const insets = useSafeAreaInsets();
  const { store } = useKeywordNavigationContext();
  const isVisible = useStore(store, (state) => state.isVisible);
  const isSearchOpen = useStore(store, (state) => state.isSearchOpen);
  const hasKeywords = useStore(store, (state) => state.keywords.length > 0);
  const canPrevious = useStore(store, (state) => state.canPrevious);
  const canNext = useStore(store, (state) => state.canNext);
  const { previous, next } = useKeywordNavigationActions();

  if (isSearchOpen || !isVisible || !hasKeywords) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, { bottom: insets.bottom + px(16) }]}
    >
      <TouchableOpacity
        style={[styles.button, !canPrevious && styles.disabled]}
        hitSlop={4}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="이전 주의 키워드 찾기"
        accessibilityState={{ disabled: !canPrevious }}
        disabled={!canPrevious}
        onPress={previous}
      >
        <ChevronUp
          size={fontPx(24)}
          strokeWidth={2.5}
          color={
            canPrevious ? KEYWORD_HIGHLIGHT_STYLE.color : COLOR_TEXT.disabled
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, !canNext && styles.disabled]}
        hitSlop={4}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="다음 주의 키워드 찾기"
        accessibilityState={{ disabled: !canNext }}
        disabled={!canNext}
        onPress={next}
      >
        <ChevronDown
          size={fontPx(24)}
          strokeWidth={2.5}
          color={canNext ? KEYWORD_HIGHLIGHT_STYLE.color : COLOR_TEXT.disabled}
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(KeywordSearchBar);
