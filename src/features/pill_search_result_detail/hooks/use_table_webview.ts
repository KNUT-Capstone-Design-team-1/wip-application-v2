import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Platform } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { useStore } from 'zustand';
import { useKeywordNavigationContext } from './use_keyword_navigation_context';
import type { KeywordTarget } from '../types/keyword_navigation_type';
import type { TableKeywordMatch } from '../types/table_webview_type';
import { createTableLoadState } from '../utils/table_load_state';
import { buildTableHighlightCommand } from '../utils/table_keyword_script';
import {
  buildTableWebViewHtml,
  hasTableKeywords,
} from '../utils/table_webview_html';
import { parseTableWebViewMessage } from '../utils/table_webview_message';

// 표의 네이티브 좌표·준비 상태 관리.
const useTableKeywordTargets = (
  html: string,
  sourceHtml: string,
  targetId?: string,
) => {
  const {
    controller: { register },
  } = useKeywordNavigationContext();
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
            .filter((match) =>
              match.keywords.some((keyword) =>
                searchKeywords.includes(keyword),
              ),
            )
            .sort((a, b) => a.y - b.y || a.x - b.x || a.index - b.index)
            .map((match) => ({
              id: targetId + ':' + match.index,
              keyword: match.keyword,
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
    [targetId],
  );

  useEffect(() => {
    if (!targetId) {
      return;
    }

    return register(targetId, async (searchKeywords, prepareOnly) => {
      if (prepareOnly) {
        const hasRelevantKeywords = hasTableKeywords(html, searchKeywords);

        if (!hasRelevantKeywords) {
          return [];
        }

        await readiness.wait();

        return [];
      }

      return measureTargets(searchKeywords);
    });
  }, [html, targetId, register, readiness, measureTargets]);

  useEffect(() => {
    readiness.reset();
    matches.current = [];

    return readiness.release;
  }, [sourceHtml, readiness]);

  // 검증된 검색 결과 목록 반영.
  const updateMatches = useCallback((items: TableKeywordMatch[]) => {
    matches.current = items;
  }, []);

  return {
    wrapper,
    webView,
    updateMatches,
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
  const { store } = useKeywordNavigationContext();
  const isVisible = useStore(store, (state) => state.isVisible);
  const source = useMemo(
    () => ({ html: buildTableWebViewHtml(html, keywords, Platform.OS) }),
    [html, keywords],
  );
  const { wrapper, webView, updateMatches, complete } = useTableKeywordTargets(
    html,
    source.html,
    targetId,
  );

  // 문서를 다시 로딩하지 않고 탐색 활성 상태에 맞춰 강조색만 전환한다.
  const updateHighlightVisibility = useCallback(() => {
    webView.current?.injectJavaScript(
      'document.documentElement.classList.toggle("keyword-highlights", ' +
        store.getState().isVisible +
        '); true;',
    );
  }, [store, webView]);

  useEffect(() => {
    updateHighlightVisibility();
  }, [isVisible, updateHighlightVisibility]);

  // WebView 메시지를 받아 강조·탐색·높이 상태에 반영한다.
  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const message = parseTableWebViewMessage(event.nativeEvent.data);

      switch (message.type) {
        case 'textNodes': {
          webView.current?.injectJavaScript(
            buildTableHighlightCommand(
              message.nodes,
              keywords,
              message.documentId,
            ),
          );

          return;
        }

        case 'matches': {
          updateMatches(message.matches);
          updateHighlightVisibility();

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
    [updateMatches, updateHighlightVisibility, complete, webView, keywords],
  );

  // 표 로딩 실패 시 검색 결과를 비우고 진행 중인 대기를 해제한다.
  const onLoadError = useCallback(() => {
    updateMatches([]);
    complete();
  }, [updateMatches, complete]);

  return { height, source, wrapper, webView, onMessage, onLoadError };
};
