import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Platform } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { useKeywordNavigationActions } from './use_keyword_navigation_actions';
import { KeywordTarget } from '../types/keyword_navigation_type';
import { TableKeywordMatch } from '../types/table_webview_type';
import { buildTableWebViewHtml } from '../utils/table_webview_html';
import { parseTableWebViewMessage } from '../utils/table_webview_message';
import { createTableLoadState } from '../utils/table_load_state';

// 표 문서·로딩·검색 좌표 연결.
export const useTableWebView = (
  html: string,
  keywords: string[],
  targetId?: string,
) => {
  const { register } = useKeywordNavigationActions();
  const wrapper = useRef<View>(null);
  const webView = useRef<WebView>(null);
  const matches = useRef<TableKeywordMatch[]>([]);
  const readiness = useMemo(createTableLoadState, []);
  const [height, setHeight] = useState(100);
  const source = useMemo(
    () => ({ html: buildTableWebViewHtml(html, keywords, Platform.OS) }),
    [html, keywords],
  );

  // 현재 표의 검색 결과 측정.
  const measureTargets = useCallback(
    (keyword: string): Promise<KeywordTarget[]> =>
      new Promise((resolve) => {
        if (!wrapper.current || !targetId) {
          resolve([]);

          return;
        }

        wrapper.current.measureInWindow((_x, y) => {
          const targets = matches.current
            .filter((match) => match.keyword === keyword)
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

    return register(targetId, async (keyword, prepareOnly) => {
      if (prepareOnly) {
        await readiness.wait();

        return [];
      }

      return measureTargets(keyword);
    });
  }, [targetId, register, readiness, measureTargets]);

  useEffect(() => {
    readiness.reset();
    matches.current = [];

    return readiness.release;
  }, [source, readiness]);

  // 브라우저 좌표·높이 반영.
  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const message = parseTableWebViewMessage(event.nativeEvent.data);

      if (message.type === 'invalid') {
        return;
      }

      if (message.type === 'matches') {
        matches.current = message.matches;

        return;
      }

      readiness.complete();
      setHeight(message.height);
    },
    [readiness],
  );

  return { height, source, wrapper, webView, onMessage };
};
