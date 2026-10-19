import { memo, useMemo } from 'react';
import { Text } from 'react-native';
import { BaseText, IBaseTextProps } from '@components/common/BaseText';
import { useStore } from 'zustand';
import { useKeywordNavigationContext } from '../../hooks/use_keyword_navigation_context';
import { useKeywordTextTargets } from '../../hooks/use_keyword_text_targets';
import { findKeywordMatches } from '../../utils/keyword_matches';

interface Props extends IBaseTextProps {
  text: string;
  targetId?: string;
}

// 검색 문구 강조 표시.
const KeywordText = ({ text, targetId, ...props }: Props) => {
  const { store } = useKeywordNavigationContext();
  const keywords = useStore(store, (state) => state.keywords);
  const matches = useMemo(
    () => findKeywordMatches(text, keywords),
    [text, keywords],
  );
  const { ref, onTextLayout } = useKeywordTextTargets(text, matches, targetId);
  const children = useMemo(() => {
    const parts = [];
    let from = 0;

    for (const match of matches) {
      if (match.start < from) {
        continue;
      }

      parts.push(text.slice(from, match.start));
      parts.push(
        <Text
          key={match.start}
          style={{ backgroundColor: '#FFF1A8', color: '#242424' }}
        >
          {text.slice(match.start, match.end)}
        </Text>,
      );
      from = match.end;
    }

    parts.push(text.slice(from));

    return parts;
  }, [text, matches]);

  return (
    <BaseText {...props} ref={ref} onTextLayout={onTextLayout}>
      {children}
    </BaseText>
  );
};

export default memo(KeywordText);
