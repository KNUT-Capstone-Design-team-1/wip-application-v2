import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Platform } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import type { KeywordTarget } from '../types/keyword_navigation_type';
import type { TableKeywordMatch } from '../types/table_webview_type';
import { createTableLoadState } from '../utils/table_load_state';
import { buildTableWebViewHtml } from '../utils/table_webview_html';
import { parseTableWebViewMessage } from '../utils/table_webview_message';
import { useKeywordNavigationActions } from './use_keyword_navigation_actions';

// 표의 네이티브 좌표·준비 상태·키워드 선택 관리.
const useTableKeywordTargets = (sourceHtml: string, targetId?: string) => {
  const { register, select } = useKeywordNavigationActions();
  const wrapper = useRef<View>(null);
  const webView = useRef<WebView>(null);
  const matches = useRef<TableKeywordMatch[]>([]);
  const readiness = useMemo(createTableLoadState, []);

  // 현재 표의 검색 결과 측정.
  const measureTargets = useCallback(
    (searchKeywords: readonly string[]): Promise<KeywordTarget[]> =>
      new Promise((resolve) => {
        if (!wrapper.current || !targetId) {
          resolve([]);

          return;
        }

        wrapper.current.measureInWindow((_x, y) => {
          const targets = matches.current
            .filter((match) => searchKeywords.includes(match.keyword))
            .sort((a, b) => a.y - b.y || a.x - b.x || a.index - b.index)
            .map((match) => ({
              id: targetId + ':' + match.index,
              keyword: match.keyword,
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
    [targetId],
  );

  useEffect(() => {
    if (!targetId) {
      return;
    }

    return register(targetId, async (searchKeywords, prepareOnly) => {
      if (prepareOnly) {
        await readiness.wait();

        return [];
      }

      return measureTargets(searchKeywords);
    });
  }, [targetId, register, readiness, measureTargets]);

  useEffect(() => {
    readiness.reset();
    matches.current = [];

    return readiness.release;
  }, [sourceHtml, readiness]);

  // 검증된 검색 결과 목록 반영.
  const updateMatches = useCallback((items: TableKeywordMatch[]) => {
    matches.current = items;
  }, []);

  // 현재 표에 존재하는 항목만 선택.
  const selectMatch = useCallback(
    (index: number, keyword: string) => {
      if (
        !targetId ||
        !matches.current.some(
          (match) => match.index === index && match.keyword === keyword,
        )
      ) {
        return;
      }

      void select(targetId + ':' + index);
    },
    [targetId, select],
  );

  return {
    wrapper,
    webView,
    updateMatches,
    selectMatch,
    complete: readiness.complete,
  };
};

// 표 문서·높이 상태와 브라우저 메시지 연결.
export const useTableWebView = (
  html: string,
  keywords: string[],
  targetId?: string,
) => {
  const [height, setHeight] = useState(100);
  const source = useMemo(
    () => ({ html: buildTableWebViewHtml(html, keywords, Platform.OS) }),
    [html, keywords],
  );
  const { wrapper, webView, updateMatches, selectMatch, complete } =
    useTableKeywordTargets(source.html, targetId);
  const { dismiss } = useKeywordNavigationActions();

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const message = parseTableWebViewMessage(event.nativeEvent.data);

      switch (message.type) {
        case 'dismiss': {
          dismiss();

          return;
        }

        case 'keywordPress': {
          selectMatch(message.index, message.keyword);

          return;
        }

        case 'matches': {
          updateMatches(message.matches);

          return;
        }

        case 'height': {
          complete();
          setHeight(message.height);

          return;
        }

        default: {
          return;
        }
      }
    },
    [dismiss, selectMatch, updateMatches, complete],
  );

  return { height, source, wrapper, webView, onMessage };
};
