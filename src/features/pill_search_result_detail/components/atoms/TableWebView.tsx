import { memo } from 'react';
import { useStore } from 'zustand';
import { useKeywordNavigationContext } from '../../hooks/use_keyword_navigation_context';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import { useTableWebView } from '../../hooks/use_table_webview';
import { styles } from '../../styles/atoms/TableWebView';

interface Props {
  html: string;
  targetId?: string;
}

// 표 WebView 표시.
const TableWebView = ({ html, targetId }: Props) => {
  const { store } = useKeywordNavigationContext();
  const keywords = useStore(store, (state) => state.keywords);
  const { height, source, wrapper, webView, onMessage } = useTableWebView(
    html,
    keywords,
    targetId,
  );

  return (
    <View
      ref={wrapper}
      collapsable={false}
      style={[styles.tableWrapper, { height }]}
    >
      <WebView
        ref={webView}
        source={source}
        originWhitelist={['*']}
        style={styles.tableWebView}
        onMessage={onMessage}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator
        bounces={false}
      />
    </View>
  );
};

export default memo(TableWebView);
