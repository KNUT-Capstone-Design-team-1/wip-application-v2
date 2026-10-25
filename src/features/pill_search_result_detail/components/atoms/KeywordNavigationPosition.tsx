import { useStore } from 'zustand';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { useKeywordNavigationContext } from '../../hooks/use_keyword_navigation_context';
import { styles } from '../../styles/atoms/KeywordNavigationPosition';

// 실제 선택된 탐색 위치와 전체 이동 지점 수 표시.
const KeywordNavigationPosition = () => {
  const { store } = useKeywordNavigationContext();
  const currentIndex = useStore(store, (state) => state.currentIndex);
  const totalCount = useStore(store, (state) => state.totalCount);

  const hasNoResults = !totalCount;

  if (hasNoResults) {
    return null;
  }

  return (
    <View style={styles.label}>
      <BaseText
        size={11}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.5}
        weight="semiBold"
        style={styles.text}
        accessibilityLiveRegion="polite"
        accessibilityLabel={
          currentIndex
            ? totalCount + '개 중 ' + currentIndex + '번째'
            : '전체 ' + totalCount + '개, 선택된 위치 없음'
        }
      >
        {(currentIndex || '–') + ' / ' + totalCount}
      </BaseText>
    </View>
  );
};

export default KeywordNavigationPosition;
