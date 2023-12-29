import { useState } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';

import HeaderBackground from '@components/HeaderBackground';
import HeaderLogo from '@/components/HeaderLogo';
import { getStatusBarHeight } from 'react-native-safearea-height';
import { StatusBar, Platform } from 'react-native';

/* 기기 별 상태바 높이 계산 */
const StatusBarHeight: number = (Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight) ?? 0;
/* OS 별 헤더 높이 */
const HeaderHeight: number = (Platform.OS === 'ios' ? 10 : 40) ?? 0;


const WebViewArea = (): JSX.Element => {

    const BASE_URL = 'https://m.naver.com/'; // 메인 주소 초기화.
    const [canGoBack, setCanGoBack] = useState<boolean>(false);
    const [currentUrl, setCurrentUrl] = useState<string>('');

    const styles = StyleSheet.create({
        headerTitleWrapper: {
            height: StatusBarHeight + HeaderHeight,
            marginTop: StatusBarHeight + (HeaderHeight / 2),
            marginBottom: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        viewWrapper: {
            flex: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: 'hidden',
        },
        webView: { flex: 1 },
    });

    return (
        <HeaderBackground>
            <View style={styles.headerTitleWrapper}>
                <HeaderLogo />
            </View>
            <View style={styles.viewWrapper}>
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