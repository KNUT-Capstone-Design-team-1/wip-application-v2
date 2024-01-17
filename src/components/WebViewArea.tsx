import { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';

import HeaderBackground from '@components/HeaderBackground';
import HeaderLogo from '@/components/HeaderLogo';
import { getStatusBarHeight } from 'react-native-safearea-height';
import { StatusBar, Platform } from 'react-native';
import BottomNavagation from '@/components/BottomNavigation';
import { SvgXml } from 'react-native-svg';
import { Shadow } from 'react-native-shadow-2';

/* 기기 별 상태바 높이 계산 */
const StatusBarHeight: number = (Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight) ?? 0;
/* OS 별 헤더 높이 */
const HeaderHeight: number = (Platform.OS === 'ios' ? 8 : 40) ?? 0;


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
            backgroundColor: 'white',
            paddingHorizontal: 15,
        },
        webView: { flex: 1 },
        updateViewWrapper: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center', gap: 6,
            paddingTop: 20,
            paddingRight: 25,
            paddingBottom: 8,
        },
        updateText: {
            fontWeight: '500',
            fontSize: 11,
            paddingBottom: 2,
            color: 'black'
        },
        searchPillButtonWrapper: {
            width: '100%',
        },
        searchPillButton: {
            width: '100%',
            height: 140,
            borderRadius: 25,
            overflow: 'hidden'
        },
        searchPillTextWrapper: {
            flex: 1,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
        },
        searchPillMainText: {
            color: 'white',
            fontSize: 32,
            fontWeight: '900',
            fontFamily: 'Noto Sans',
            textAlign: 'right',
            paddingRight: 32,
            paddingBottom: 4,
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 25,
        },
        searchPillSubText: {
            color: 'white',
            fontSize: 16,
            fontWeight: '500',
            fontFamily: 'Noto Sans',
            textAlign: 'right',
            paddingRight: 32,
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 25,
        },
        fill: {
            width: '100%',
            height: '100%',
        },
        backgroundImage: {
            position: 'absolute',
            top: '-40%',
            right: '-10%',
            width: '110%',
            height: '110%',
            transform: [{ translateY: 50 }],
        },
        lastSearchPillWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingTop: 26,
            paddingBottom: 15,
        },
        lastSearchPillText: {
            paddingBottom: 2,
            color: '#000',
            fontSize: 14,
        },
        lastSearchPillListWrapper: {
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 7,
            rowGap: 9,
            marginBottom: 25,
        },
        lastSearchPillList: {
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 4,
            paddingBottom: 7,
            paddingHorizontal: 13,
            borderRadius: 15,
            borderWidth: 1,
            borderColor: '#cdcdcd'
        },
        lastSearchPillListText: {
            color: '#000',
            fontSize: 12,
        },
        menuListWrapper: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 20,
            backgroundColor: '#fff',
            marginBottom: 20,
        },
        menu: {
            position: 'relative',
            flex: 1,
            aspectRatio: '155/130',
        },
        menuMainText: {
            color: '#fff',
            fontWeight: '900',
            fontSize: 20,
            textAlign: 'right',
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 25,
            paddingRight: 16,
        },
        menuSubText: {
            color: '#fff',
            fontSize: 12,
            textAlign: 'right',
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 25,
            paddingRight: 16,
            paddingBottom: 16,
        },
        menuBackgroundImage: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        },
        menuShadow: {
            justifyContent: 'flex-end',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            borderRadius: 25,
            overflow: 'hidden',
        },
        takeGuide: {
            gap: 6,
            alignItems: 'center',
        },
        takeGuideText1: {
            fontSize: 12,
            fontWeight: '900',
            color: '#9B0505',
        },
        takeGuideText2: {
            fontSize: 11,
            fontWeight: '500',
            color: '#000',
            paddingBottom: 3,
        },
        takeGuideButtonWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        }
    });

    const REFRESH_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M1.04255 7.1875C1.01447 6.96228 1 6.73286 1 6.5C1 3.46243 3.46243 1 6.5 1C8.21916 1 9.75407 1.78875 10.7626 3.02411M10.7626 3.02411V1M10.7626 3.02411V3.06245L8.70014 3.0625M11.9574 5.8125C11.9856 6.03773 12 6.26714 12 6.5C12 9.53758 9.53758 12 6.5 12C4.85729 12 3.3828 11.2798 2.375 10.138M2.375 10.138V9.9375H4.4375M2.375 10.138V12" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `

    const SEARCH_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M10.115 10.0941L13 13M11.6667 6.33333C11.6667 9.27887 9.27887 11.6667 6.33333 11.6667C3.38781 11.6667 1 9.27887 1 6.33333C1 3.38781 3.38781 1 6.33333 1C9.27887 1 11.6667 3.38781 11.6667 6.33333Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `

    const RIGHTARROW_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="4" height="8" viewBox="0 0 4 8" fill="none">
        <path d="M0.165111 7.82245C0.382567 8.05918 0.735166 8.05918 0.952617 7.82245L3.67418 4.85655C4.10875 4.38301 4.10858 3.61564 3.67384 3.14229L0.950613 0.177561C0.733162 -0.0591871 0.380563 -0.0591871 0.163101 0.177561C-0.0543669 0.414316 -0.0543669 0.798162 0.163101 1.03492L2.49387 3.57241C2.71138 3.80915 2.71138 4.19302 2.49387 4.42976L0.165111 6.96511C-0.0523569 7.20184 -0.0523569 7.58565 0.165111 7.82245Z" fill="#0F0F0F"/>
    </svg>
    `

    const lastSearchList = ['칸살탄정', '올메르탄플러스정', '펜폴캡슐', '온글라이자정', '실버셉트오디정']

    return (
        <HeaderBackground>
            <View style={styles.headerTitleWrapper}>
                <HeaderLogo />
            </View>
            <ScrollView style={styles.viewWrapper}>
                {/* 웹뷰 (네이티브로 개발 결정 -> 웹뷰 삭제)
                <WebView
                    source={{ uri: BASE_URL }}
                    style={styles.webView}
                    onNavigationStateChange={navState => {
                        setCanGoBack(navState.canGoBack)
                        setCurrentUrl(navState.url)
                    }}
                />
                */}
                {/* 정보 업데이트 날짜 뷰 */}
                <View style={styles.updateViewWrapper}>
                    <SvgXml xml={REFRESH_ICON} width={11} height={11} />
                    <Text style={styles.updateText}>정보 업데이트 날짜 : 2023. 03. 02</Text>
                </View>
                {/* 알약 검색 버튼 */}
                <View style={styles.searchPillButtonWrapper}>
                    <Shadow distance={13} offset={[2, 4]} startColor='#00000015' style={styles.searchPillButton}>
                        <TouchableOpacity style={styles.fill}>
                            <Image
                                style={styles.backgroundImage}
                                source={require('@assets/images/searchPill.png')} // header에 들어갈 로고이미지.
                            />
                            <View style={styles.searchPillTextWrapper}>
                                <Text style={styles.searchPillMainText}>알약 검색</Text>
                                <Text style={styles.searchPillSubText}>Pill Search</Text>
                            </View>
                        </TouchableOpacity>
                    </Shadow>
                </View>
                {/* 최근 검색 알약 */}
                <View style={styles.lastSearchPillWrapper}>
                    <SvgXml xml={SEARCH_ICON} />
                    <Text style={styles.lastSearchPillText}>
                        최근 검색한 알약
                    </Text>
                </View>
                <View style={styles.lastSearchPillListWrapper}>
                    {lastSearchList.map((i: string) =>
                        <TouchableOpacity style={styles.lastSearchPillList}>
                            <Text style={styles.lastSearchPillListText}>{i}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.menuListWrapper}>
                    <TouchableOpacity style={styles.menu}>
                        <Shadow distance={15} offset={[2, 4]} startColor='#00000015' style={styles.menuShadow}>
                            <Image
                                style={styles.menuBackgroundImage}
                                source={require('@assets/images/nearby_image.png')} // header에 들어갈 로고이미지.
                            />
                            <Text style={styles.menuMainText}>가까운 약국</Text>
                            <Text style={styles.menuSubText}>Nearby Pharmacy</Text>
                        </Shadow>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menu}>
                        <Shadow distance={15} offset={[2, 4]} startColor='#00000015' style={styles.menuShadow}>
                            <Image
                                style={styles.menuBackgroundImage}
                                source={require('@assets/images/storage_image.png')} // header에 들어갈 로고이미지.
                            />
                            <Text style={styles.menuMainText}>알약 보관함</Text>
                            <Text style={styles.menuSubText}>Pill Storage</Text>
                        </Shadow>
                    </TouchableOpacity>
                </View>
                <View style={styles.takeGuide}>
                    <Text style={styles.takeGuideText1}>
                        약의 오용과 남용은 오히려 건강을 해칠수 있습니다.
                    </Text>
                    <TouchableOpacity style={styles.takeGuideButtonWrapper}>
                        <Text style={styles.takeGuideText2}>
                            올바른 복용법 보러가기
                        </Text>
                        <SvgXml xml={RIGHTARROW_ICON} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <BottomNavagation />
        </HeaderBackground>
    )
}

export default WebViewArea;