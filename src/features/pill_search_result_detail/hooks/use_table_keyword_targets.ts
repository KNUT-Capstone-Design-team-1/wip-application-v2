import { useCallback, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import { useKeywordNavigationContext } from './use_keyword_navigation_context';
import type { KeywordTarget } from '../types/keyword_navigation_type';
import type { TableKeywordMatch } from '../types/table_webview_type';
import {
  createTableLoadState,
  TableLoadError,
} from '../utils/table_load_state';
import { hasTableKeywords } from '../utils/table_webview_html';

// 표의 네이티브 좌표·준비 상태 관리.
export const useTableKeywordTargets = (
  html: string,
  documentId: string,
  targetId?: string,
) => {
  const {
    controller: { register },
  } = useKeywordNavigationContext();
  const wrapper = useRef<View>(null);
  const webView = useRef<WebView>(null);
  // source가 바뀌면 결과와 대기 상태도 새 세대의 객체로 분리한다.
  const documentState = useMemo(
    () => ({
      matches: [] as TableKeywordMatch[],
      readiness: createTableLoadState(),
    }),
    // 문서 세대가 바뀔 때만 검색 결과와 준비 상태를 초기화한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [documentId],
  );
  const { readiness } = documentState;

  // 현재 표의 검색 결과 측정.
  const measureTargets = useCallback(
    (searchKeywords: readonly string[]): Promise<KeywordTarget[]> =>
      new Promise((resolve) => {
        const nativeWrapper = wrapper.current;
        const cannotMeasure = !nativeWrapper || !targetId;

        if (cannotMeasure) {
          resolve([]);

          return;
        }

        nativeWrapper.measureInWindow((_x, y) => {
          const targets = documentState.matches
            .filter((match) =>
              match.keywords.some((keyword) =>
                searchKeywords.includes(keyword),
              ),
            )
            .sort((a, b) => a.y - b.y || a.x - b.x || a.index - b.index)
            .map((match) => ({
              id: targetId + ':' + match.index,
              keywords: match.keywords,
              y: y + match.y,
              reveal: () =>
                webView.current?.injectJavaScript(
                  'window.scrollTo(' +
                    Math.max(0, match.x - 16) +
                    ', 0); true;',
                ),
            }));
          resolve(targets);
        });
      }),
    [targetId, documentState],
  );

  useEffect(() => {
    const hasNoTarget = !targetId;

    if (hasNoTarget) {
      return;
    }

    return register(targetId, async (searchKeywords, prepareOnly) => {
      if (prepareOnly) {
        const hasRelevantKeywords = hasTableKeywords(html, searchKeywords);

        if (!hasRelevantKeywords) {
          return [];
        }

        const result = await readiness.wait();
        const isNotReady = result !== 'ready';

        if (isNotReady) {
          throw new TableLoadError(result);
        }

        return [];
      }

      return measureTargets(searchKeywords);
    });
  }, [html, targetId, register, readiness, measureTargets]);

  useEffect(() => readiness.cancel, [readiness]);

  const updateMatches = useCallback(
    (items: TableKeywordMatch[]) => {
      documentState.matches = items;
    },
    [documentState],
  );

  return {
    wrapper,
    webView,
    updateMatches,
    complete: readiness.complete,
    fail: readiness.fail,
  };
};
