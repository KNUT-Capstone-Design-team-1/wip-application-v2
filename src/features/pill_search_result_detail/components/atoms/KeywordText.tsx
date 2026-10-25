import { memo, useMemo } from 'react';
import { Text } from 'react-native';
import { useStore } from 'zustand';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/keyword';
import { useKeywordNavigationActions } from '../../hooks/use_keyword_navigation_actions';
import { useKeywordNavigationContext } from '../../hooks/use_keyword_navigation_context';
import { useKeywordTextTargets } from '../../hooks/use_keyword_text_targets';
import type { KeywordTextProps } from '../../types/pill_detail_component_type';
import { findKeywordMatches } from '../../utils/keyword_matches';

// 검색 문구 강조 표시.
const KeywordText = ({ text, targetId, ...props }: KeywordTextProps) => {
  const { store } = useKeywordNavigationContext();
  const { select } = useKeywordNavigationActions();
  const keywords = useStore(store, (state) => state.keywords);
  const isVisible = useStore(store, (state) => state.isVisible);
  const matches = useMemo(
    () => findKeywordMatches(text, keywords),
    [text, keywords],
  );
  const { ref, onTextLayout } = useKeywordTextTargets(text, matches, targetId);
  const children = useMemo(() => {
    const parts = [];
    let from = 0;

    for (const match of matches) {
      parts.push(text.slice(from, match.start));
      parts.push(
        <Text
          key={match.start}
          accessibilityRole={targetId ? 'button' : undefined}
          accessibilityLabel={
            targetId ? match.keyword + '부터 본문 탐색' : undefined
          }
          onPress={
            targetId
              ? () => select(targetId + ':' + match.keyword + ':' + match.start)
              : undefined
          }
          style={isVisible ? styles.highlight : undefined}
        >
          {text.slice(match.start, match.end)}
        </Text>,
      );
      from = match.end;
    }

    parts.push(text.slice(from));

    return parts;
  }, [text, matches, targetId, select, isVisible]);

  return (
    <BaseText {...props} ref={ref} onTextLayout={onTextLayout}>
      {children}
    </BaseText>
  );
};

export default memo(KeywordText);
