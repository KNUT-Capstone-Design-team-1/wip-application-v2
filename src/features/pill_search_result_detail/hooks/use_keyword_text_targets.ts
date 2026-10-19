import { useCallback, useEffect, useRef } from 'react';
import { Text, TextLayoutEvent } from 'react-native';
import type {
  KeywordTarget,
  KeywordMatch,
  KeywordTextLineRange,
} from '../types/keyword_navigation_type';
import {
  buildKeywordLineRanges,
  findKeywordLineOffset,
} from '../utils/keyword_text_layout';
import { useKeywordNavigationActions } from './use_keyword_navigation_actions';

// 강조 문구의 네이티브 줄 좌표 등록.
export const useKeywordTextTargets = (
  text: string,
  matches: KeywordMatch[],
  targetId?: string,
) => {
  const { register } = useKeywordNavigationActions();
  const ref = useRef<Text>(null);
  const lines = useRef<KeywordTextLineRange[]>([]);

  // 네이티브 줄 배치 반영.
  const onTextLayout = useCallback(
    (event: TextLayoutEvent) => {
      lines.current = buildKeywordLineRanges(text, event.nativeEvent.lines);
    },
    [text],
  );

  // 모든 문구의 화면 좌표 일괄 측정.
  const measureTargets = useCallback(
    (
      keywords: readonly string[],
      prepareOnly?: boolean,
    ): Promise<KeywordTarget[]> =>
      new Promise((resolve) => {
        const relevant = matches.filter((match) =>
          keywords.includes(match.keyword),
        );

        if (prepareOnly || !targetId || !relevant.length || !ref.current) {
          resolve([]);

          return;
        }

        ref.current.measureInWindow((_x, y) =>
          resolve(
            relevant.map((match) => ({
              id: targetId + ':' + match.keyword + ':' + match.start,
              keyword: match.keyword,
              y: y + findKeywordLineOffset(lines.current, match.start),
            })),
          ),
        );
      }),
    [matches, targetId],
  );

  useEffect(() => {
    if (!targetId || !matches.length) {
      return;
    }

    return register(targetId, measureTargets);
  }, [targetId, matches.length, measureTargets, register]);

  return { ref, onTextLayout };
};
