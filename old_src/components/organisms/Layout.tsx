/* eslint-disable react-hooks/rules-of-hooks */
import HeaderBackground from '@/components/atoms/HeaderBackground';
import HeaderLogo from '@/components/atoms/HeaderLogo';
import BottomNavagation from '@/components/organisms/BottomNavigation';
import { useScreenStore } from '@/store/screen';
import { font, os } from '@/style/font';
import { gstyles } from '@/style/globalStyle';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Easing,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { getStatusBarHeight } from 'react-native-safearea-height';
import { SvgXml } from 'react-native-svg';

/* 기기 별 상태바 높이 계산 */
export const StatusBarHeight: number =
  (Platform.OS === 'ios'
    ? getStatusBarHeight(true)
    : RNStatusBar.currentHeight) ?? 0;
/* 화면 전체 높이 */
export const windowWidth: number = Dimensions.get('window').width;
/* 화면 전체 높이 */
export const windowHeight: number = Dimensions.get('window').height;
/* OS 별 헤더 높이 */
export const HeaderHeight: number =
  Platform.OS === 'ios' ? windowHeight * 0.08 : windowHeight * 0.1;
/* 총(메인) 헤더 높이 */
export const totalHeaderHeight: number = StatusBarHeight + HeaderHeight;
/* 기본 헤더 높이 */
export const defaultHeaderHeight: number =
  StatusBarHeight +
  (Platform.OS === 'ios' ? windowHeight * 0.012 : windowHeight * 0.03);

/* 뒤로가기 icon xml */
const BACKBUTTON_ICON = `
  <svg width="8" height="15" viewBox="0 0 8 15" fill="none">
    <path d="M7 14L1 7.5L7 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

const styles = StyleSheet.create({
  MaskView: {
    backgroundColor: 'white',
    height: '100%',
    position: 'absolute',
    width: '100%',
    ...gstyles.screenBorder,
  },
  MaskViewWrapper: { flex: 1, position: 'relative' },
  backButton: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'flex-start',
    marginRight: -22,
    paddingLeft: 22,
    paddingVertical: 10,
  },
  backButtonText: {
    color: '#fff',
    fontFamily: os.font(400, 400),
    fontSize: font(17),
    includeFontPadding: false,
    paddingBottom: 2,
  },
  fill: {
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  headerBackground: {
    flex: 1,
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  headerTitleWrapper: {
    alignItems: 'center',
    height: totalHeaderHeight,
    justifyContent: 'center',
    left: 0,
    marginTop: StatusBarHeight - (Platform.OS === 'ios' ? 5 : 0),
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  titleText: {
    color: '#fff',
    flex: 2,
    fontFamily: os.font(500, 500),
    fontSize: font(20),
    includeFontPadding: false,
    paddingBottom: 2.5,
    textAlign: 'center',
  },
  titleTextWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'space-between',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
});

const Layout = {
  default: ({ children }: any) => {
    const nav: any = useNavigation();
    const screen = useScreenStore((state) => state.screen);
    const heightAnimation = useRef(
      new Animated.Value(defaultHeaderHeight),
    ).current;
    const marginTopAnimation = useRef(
      new Animated.Value(defaultHeaderHeight + StatusBarHeight),
    ).current;
    const logoAnimation = useRef(new Animated.Value(1)).current;
    const titleAnimation = useRef(new Animated.Value(0)).current;
    const pressAnimation = useRef(new Animated.Value(0)).current;
    const [backAvaliableState, setBackAvaliableState] = useState<boolean>(true);

    const visibleList: string[] = [
      '홈',
      '보관함',
      '설정',
      '카메라',
      '알약 촬영',
    ];

    changeNavigationBarColor('black', false);

    /** 로고 나타나는 애니메이션 */
    const logoFadeInAni = useCallback(() => {
      Animated.timing(heightAnimation, {
        toValue: totalHeaderHeight,
        duration: 200,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
        useNativeDriver: false,
      }).start();
      Animated.timing(marginTopAnimation, {
        toValue: totalHeaderHeight + StatusBarHeight,
        duration: 200,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
        useNativeDriver: false,
      }).start();
      Animated.timing(logoAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(titleAnimation, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
    }, [heightAnimation, marginTopAnimation, logoAnimation, titleAnimation]);

    /** 로고 사라지는 애니메이션 & 화면 타이틀 나타나는 애니메이션 */
    const logoFadeOutAni = useCallback(() => {
      Animated.timing(heightAnimation, {
        toValue: defaultHeaderHeight,
        duration: 200,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
        useNativeDriver: false,
      }).start();
      Animated.timing(marginTopAnimation, {
        toValue: defaultHeaderHeight + StatusBarHeight,
        duration: 200,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
        useNativeDriver: false,
      }).start();
      Animated.timing(logoAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
      Animated.timing(titleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }, [heightAnimation, marginTopAnimation, logoAnimation, titleAnimation]);

    /** 뒤로가기 버튼 press 애니메이션 */
    const pressAni = () => {
      Animated.timing(pressAnimation, {
        toValue: -3.5,
        delay: 0,
        duration: 800,
        easing: Easing.bezier(0.14, 1.07, 0.59, 0.97),
        useNativeDriver: true,
      }).start();
    };
    /** 뒤로가기 버튼 pressOut 애니메이션 */
    const pressOutAni = () => {
      Animated.timing(pressAnimation, {
        toValue: 0,
        delay: 0,
        duration: 1000,
        easing: Easing.bezier(0.14, 1.07, 0.59, 0.97),
        useNativeDriver: true,
      }).start();
    };
    /** 뒤로가기 버튼 핸들러 */
    const handlePressBackButton = () => {
      if (backAvaliableState) {
        nav.goBack();
        setBackAvaliableState(false);
      }
    };

    useEffect(() => {
      if (screen !== '홈') {
        logoFadeOutAni();
        setBackAvaliableState(true);
      } else {
        logoFadeInAni();
      }
    }, [logoFadeInAni, logoFadeOutAni, screen]);

    return (
      <View style={styles.fill} onTouchStart={() => {}}>
        <HeaderBackground />
        <Animated.View
          style={[styles.headerTitleWrapper, { height: heightAnimation }]}
        >
          {/* 헤더 로고 */}
          <Animated.View
            style={{ opacity: logoAnimation, paddingVertical: 20 }}
          >
            <HeaderLogo />
          </Animated.View>
          {/* 헤더 타이틀 */}
          <Animated.View
            style={[styles.titleTextWrapper, { opacity: titleAnimation }]}
          >
            {/* 뒤로가기 버튼 */}
            {!visibleList.includes(screen) ? (
              <TouchableWithoutFeedback
                onPress={() => handlePressBackButton()}
                onPressIn={() => pressAni()}
                onPressOut={() => pressOutAni()}
              >
                <View style={styles.backButton}>
                  <View>
                    <SvgXml xml={BACKBUTTON_ICON} width={9} height={19} />
                  </View>
                  <Text style={styles.backButtonText}>뒤로</Text>
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <View style={{ flex: 1, backgroundColor: 'red' }} />
            )}
            {/* 현재 화면 타이틀 */}
            <Text style={styles.titleText}>
              {!!screen && screen !== '홈' ? screen : ''}
            </Text>
            {/* 헤더 메뉴 */}
            <View style={{ flex: 1, backgroundColor: 'red' }} />
          </Animated.View>
        </Animated.View>
        <Animated.View
          style={{
            position: 'relative',
            flex: 1,
            marginTop: marginTopAnimation,
            backgroundColor: 'transparent',
            overflow: 'hidden',
            ...gstyles.screenBorder,
          }}
        >
          {children}
        </Animated.View>
        <BottomNavagation />
      </View>
    );
  },
  fullscreen: ({ children }: any) => {
    changeNavigationBarColor('black', false);

    return (
      <View style={[styles.fill, { backgroundColor: '#000' }]}>{children}</View>
    );
  },
  initscreen: ({ children }: any) => {
    return (
      <View style={[styles.fill, { backgroundColor: '#222' }]}>
        <LinearGradient
          colors={['#6060dd', '#4545a7', '#4545a7', '#ffffff', '#ffffff']}
          style={styles.headerBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 2 }}
          locations={[0, 0.15, 0.5, 0.5, 1]}
        />
        {children}
      </View>
    );
  },
};

export default Layout;
