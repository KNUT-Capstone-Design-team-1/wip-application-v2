import { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { useStore } from 'zustand';
import { useKeywordNavigationContext } from '../../hooks/use_keyword_navigation_context';
import { useKeywordNavigationActions } from '../../hooks/use_keyword_navigation_actions';
import { styles } from '../../styles/molecules/KeywordSearchBar';

// 현재 문구의 다음 검색 결과 이동.
const KeywordSearchBar = () => {
  const { store } = useKeywordNavigationContext();
  const activeKeyword = useStore(store, (state) => state.activeKeyword);
  const status = useStore(store, (state) => state.status);
  const { jump, clear } = useKeywordNavigationActions();

  if (!activeKeyword) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.nextButton}
        accessibilityRole="button"
        accessibilityLabel={activeKeyword + ' 다음 항목'}
        onPress={() => jump(activeKeyword)}
      >
        <BaseText size={14}>
          {activeKeyword} · {status} · 다음 찾기 ↓
        </BaseText>
      </TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" onPress={clear}>
        <BaseText size={14}>닫기</BaseText>
      </TouchableOpacity>
    </View>
  );
};

export default memo(KeywordSearchBar);
