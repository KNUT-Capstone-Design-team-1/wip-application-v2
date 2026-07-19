import React, { memo, useState } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { styles } from '@features/pill_search_result_detail/styles/atoms/TableWebView';

const TableWebView = ({ html }: { html: string }) => {
  const [height, setHeight] = useState(100);

  const customHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body {
            margin: 0; padding: 0; background-color: transparent;
            font-family: -apple-system, sans-serif;
            overflow-x: auto; -webkit-overflow-scrolling: touch;
          }
          table {
            border-collapse: collapse; width: 100%; min-width: 500px;
            font-size: 13px; color: ${COLOR_TEXT['body']};
          }
          tr:first-child {
            background-color: ${COLOR_BG['base']};
          }
          td {
            border: 1px solid ${COLOR_LINE['border']}; padding: 2px; text-align: center;
            word-break: keep-all;
          }
        </style>
        <script>
          function sendHeight() {
            var height = document.documentElement.offsetHeight || document.body.offsetHeight;
            window.ReactNativeWebView.postMessage(height.toString());
          }
          window.onload = function() {
            setTimeout(sendHeight, 100);
          };
          window.addEventListener('resize', sendHeight);
        </script>
      </head>
      <body>
        <div>
          ${html.trim().startsWith('<table') ? html : `<table>${html}</table>`}
        </div>
      </body>
    </html>
  `;

  return (
    <View style={[styles.tableWrapper, { height }]}>
      <WebView
        source={{ html: customHtml }}
        originWhitelist={['*']}
        style={styles.tableWebView}
        onMessage={(event) => {
          const parsedHeight = parseInt(event.nativeEvent.data, 10);
          if (
            !isNaN(parsedHeight) &&
            parsedHeight > 0 &&
            parsedHeight !== height
          ) {
            setHeight(parsedHeight + 10); // add a little buffer
          }
        }}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={true}
        bounces={false}
      />
    </View>
  );
};

export default memo(TableWebView);
