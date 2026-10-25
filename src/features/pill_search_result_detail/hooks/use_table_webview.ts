import { useCallback, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import type { WebViewMessageEvent } from 'react-native-webview';
import { useTableKeywordTargets } from './use_table_keyword_targets';
import { buildTableHighlightCommand } from '../utils/table_keyword_script';
import { buildTableWebViewHtml } from '../utils/table_webview_html';
import { parseTableWebViewMessage } from '../utils/table_webview_message';

let tableDocumentSequence = 0;

// 표 문서·높이 상태와 브라우저 메시지 연결.
export const useTableWebView = (
  html: string,
  keywords: string[],
  targetId?: string,
) => {
  const [height, setHeight] = useState(100);
  const document = useMemo(() => {
    const documentId = 'pill-table-' + ++tableDocumentSequence;

    return {
      documentId,
      source: {
        html: buildTableWebViewHtml(html, keywords, Platform.OS, documentId),
      },
    };
  }, [html, keywords]);
  const { documentId, source } = document;
  const currentDocumentId = useRef(documentId);
  currentDocumentId.current = documentId;
  const { wrapper, webView, updateMatches, complete, fail } =
    useTableKeywordTargets(html, documentId, targetId);

  // WebView 메시지를 받아 강조·탐색·높이 상태에 반영한다.
  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const message = parseTableWebViewMessage(
        event.nativeEvent.data,
        currentDocumentId.current,
      );
      const isStaleDocument = currentDocumentId.current !== documentId;

      if (isStaleDocument) {
        return;
      }

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
    [documentId, updateMatches, complete, webView, keywords],
  );

  // 표 로딩 실패 시 검색 결과를 비우고 진행 중인 대기를 해제한다.
  const onLoadError = useCallback(() => {
    const isStaleDocument = currentDocumentId.current !== documentId;

    if (isStaleDocument) {
      return;
    }

    updateMatches([]);
    fail();
  }, [documentId, updateMatches, fail]);

  return {
    documentId,
    height,
    source,
    wrapper,
    webView,
    onMessage,
    onLoadError,
  };
};
