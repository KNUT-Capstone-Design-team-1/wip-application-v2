import { memo } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import { useStore } from 'zustand';
import { useKeywordNavigationContext } from '../../hooks/use_keyword_navigation_context';
import { useTableWebView } from '../../hooks/use_table_webview';
import { styles, getTableWrapperStyle } from '../../styles/atoms/TableWebView';
import type { TableWebViewProps } from '../../types/pill_detail_component_type';

// 표 WebView 표시.
const TableWebView = ({ html, targetId }: TableWebViewProps) => {
  const { store } = useKeywordNavigationContext();
  const keywords = useStore(store, (state) => state.keywords);
  const { height, source, wrapper, webView, onMessage, onLoadError } =
    useTableWebView(html, keywords, targetId);

  return (
    <View
      ref={wrapper}
      collapsable={false}
      style={getTableWrapperStyle(height)}
    >
      <WebView
        ref={webView}
        source={source}
        originWhitelist={['*']}
        style={styles.tableWebView}
        onMessage={onMessage}
        onError={onLoadError}
        onHttpError={onLoadError}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator
        bounces={false}
      />
    </View>
  );
};

export default memo(TableWebView);
