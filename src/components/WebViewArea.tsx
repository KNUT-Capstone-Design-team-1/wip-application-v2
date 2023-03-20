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
    const webviewRef = useRef<Object>(null);

    const styles = StyleSheet.create({
        viewWrap: {
            flex: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: 'hidden',
        },
        webView: { flex: 1 },
    });

    /* WebView 뒤로가기 이벤트 핸들러 */
    backButtonHandler = (): boolean => {
        if (webviewRef.current) webviewRef.current.goBack()
        return currentUrl === BASE_URL ? false : true;
    }

    useEffect(() => {
        /* WebView 뒤로가기 이벤트 리스너 */
        BackHandler.addEventListener('hardwareBackPress', () => {
            return backButtonHandler(); // 첫화면에 뒤로가기 누를 시, 앱 종료. 
        });
        return () => BackHandler.removeEventListener('hardwareBackPress');
    }, []);

    return (
        <HeaderBackground>
            <View style={styles.viewWrap}>
                {/* 웹뷰 */}
                <WebView
                    source={{ uri: BASE_URL }}
                    style={styles.webView}
                    ref={webviewRef}
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