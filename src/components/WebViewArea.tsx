import { useRef, useState, useEffect } from 'react';
import {
    StyleSheet,
    BackHandler,
    Text,
    View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';

import HeaderBackground from '@components/HeaderBackground';


const WebViewArea = (): JSX.Element => {

    const BASE_URL = 'https://m.naver.com/'; // 메인 주소 초기화.
    const [canGoBack, setCanGoBack] = useState<boolean>(false);
    const [currentUrl, setCurrentUrl] = useState<string>('');

    const styles = StyleSheet.create({
        viewWrap: {
            flex: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: 'hidden',
        },
        webView: { flex: 1 },
    });

    return (
        <HeaderBackground>
            <View style={styles.viewWrap}>
                {/* 웹뷰 */}
                <WebView
                    source={{ uri: BASE_URL }}
                    style={styles.webView}
                    onNavigationStateChange={navState => {
                        setCanGoBack(navState.canGoBack)
                        setCurrentUrl(navState.url)
                    }}
                />
            </View>
        </HeaderBackground>
    )
}

export default WebViewArea;