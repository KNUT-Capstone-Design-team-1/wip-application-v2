import { memo, useMemo } from 'react';
import { Text } from 'react-native';
import { useStore } from 'zustand';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/keyword';
import { useKeywordNavigationContext } from '../../hooks/use_keyword_navigation_context';
import { useKeywordTextTargets } from '../../hooks/use_keyword_text_targets';
import type { KeywordTextProps } from '../../types/pill_detail_component_type';
import { findKeywordMatches } from '../../utils/keyword_matches';

// 검색 문구 강조 표시.
const KeywordText = ({ text, targetId, ...props }: KeywordTextProps) => {
  const { store } = useKeywordNavigationContext();
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
          style={isVisible ? styles.highlight : undefined}
        >
          {text.slice(match.start, match.end)}
        </Text>,
      );
      from = match.end;
    }

    parts.push(text.slice(from));

    return parts;
  }, [text, matches, isVisible]);

  return (
    <BaseText {...props} ref={ref} onTextLayout={onTextLayout}>
      {children}
    </BaseText>
  );
};

export default memo(KeywordText);
