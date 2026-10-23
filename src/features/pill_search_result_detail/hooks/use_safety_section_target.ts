import { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import type { KeywordMeasure } from '../types/keyword_navigation_type';
import { useKeywordNavigationContext } from './use_keyword_navigation_context';

const SECTION_ID = 'pill-safety-section';

// 실제 네이티브 컨테이너 좌표를 이전·다음 이동 지점으로 등록한다.
export const useSafetySectionTarget = () => {
  const ref = useRef<View>(null);
  const { store, controller } = useKeywordNavigationContext();
  const measure = useCallback<KeywordMeasure>(
    (_keywords, prepareOnly) =>
      new Promise((resolve) => {
        const { isSearchOpen, searchQuery } = store.getState();
        if (prepareOnly || isSearchOpen || searchQuery || !ref.current) {
          resolve([]);
          return;
        }

        ref.current.measureInWindow((_x, y) =>
          resolve([
            {
              id: SECTION_ID,
              keyword: '주의 및 특수 분류 정보',
              keywords: [],
              kind: 'section',
              y,
            },
          ]),
        );
      }),
    [store],
  );

  useEffect(
    () => controller.register(SECTION_ID, measure),
    [controller, measure],
  );

  return ref;
};
