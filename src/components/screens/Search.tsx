import { screenState } from "@/atoms/screen";
import Button from "@/components/atoms/Button";
import Layout, { StatusBarHeight, defaultHeaderHeight, windowHeight } from "@/components/organisms/Layout";
import { font, os } from "@/style/font";
import { gstyles } from "@/style/globalStyle";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, Platform, Image, Alert, Linking, PermissionsAndroid } from "react-native";
import { PERMISSIONS, RESULTS, check, request } from "react-native-permissions";
import { SvgXml } from "react-native-svg";
import { useRecoilState } from "recoil";

const Search = (): JSX.Element => {
    const nav: any = useNavigation();
    const [screen, setScreen]: any = useRecoilState(screenState);

    /* 샘플 사진 프레임 xml */
    const GUIDE_FRAME = `
    <svg width="233" height="269" viewBox="0 0 233 269" fill="none">
        <path d="M27.5954 1H9C4.58172 1 1 4.58172 1 9V27.5483" stroke="black" stroke-width="2"/>
        <path d="M232 27.5483L232 9C232 4.58172 228.418 1 224 1L205.405 0.999999" stroke="black" stroke-width="2"/>
        <path d="M205.405 268L224 268C228.418 268 232 264.418 232 260L232 241.452" stroke="black" stroke-width="2"/>
        <path d="M1 241.452L1 260C1 264.418 4.58172 268 9 268L27.5954 268" stroke="black" stroke-width="2"/>
    </svg>
    `
    /* 느낌표 아이콘 xml */
    const NOTE_ICON = `
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <rect width="17" height="17" fill="url(#pattern0)"/>
        <defs>
            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlink:href="#image0_207_1600" transform="scale(0.00195312)"/>
            </pattern>
            <image id="image0_207_1600" width="512" height="512" xlink:href="data:image/png;base64,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"/>
        </defs>
    </svg>
    `
    /* 물음표 아이콘 xml */
    const GUIDE_ICON = `
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 15C11.6421 15 15 11.6421 15 7.5C15 3.35786 11.6421 0 7.5 0C3.35786 0 0 3.35786 0 7.5C0 11.6421 3.35786 15 7.5 15ZM7.69729 2.74998C6.3329 2.74998 5.17512 3.64058 4.78493 4.87373C4.65998 5.26864 4.87882 5.69008 5.27374 5.81504C5.66865 5.94 6.09009 5.72116 6.21505 5.32624C6.41171 4.70471 6.99952 4.24998 7.69729 4.24998C8.56004 4.24998 9.24999 4.94279 9.24999 5.7857C9.24999 6.11879 9.16198 6.29099 9.05624 6.4222C8.93229 6.576 8.77279 6.69413 8.5112 6.88788C8.47626 6.91375 8.43951 6.94098 8.40077 6.96982C8.10311 7.19142 7.71874 7.49178 7.42431 7.9545C7.12062 8.4318 6.94729 9.02272 6.94729 9.78566C6.94729 10.1999 7.28307 10.5357 7.69729 10.5357C8.1115 10.5357 8.44729 10.1999 8.44729 9.78566C8.44729 9.26292 8.56179 8.96101 8.68985 8.75974C8.82719 8.54391 9.01849 8.37998 9.29651 8.173C9.32711 8.15022 9.3599 8.1262 9.39442 8.10092C9.63844 7.92218 9.969 7.68005 10.2241 7.36347C10.5502 6.95895 10.75 6.45259 10.75 5.7857C10.75 4.10389 9.37795 2.74998 7.69729 2.74998ZM8.44729 11.9943C8.44729 11.5801 8.1115 11.2443 7.69729 11.2443C7.28307 11.2443 6.94729 11.5801 6.94729 11.9943V12C6.94729 12.4142 7.28307 12.75 7.69729 12.75C8.1115 12.75 8.44729 12.4142 8.44729 12V11.9943Z" fill="#A5A5A5"/>
    </svg>
    `

    const handleSetScreen = () => {
        setScreen('알약 검색');
    }

    /* 카메라 권한 확인 */
    const permissionCheck = () => {
        if (Platform.OS !== "ios" && Platform.OS !== "android") return;

        const platformPermissionsCamera =
            Platform.OS === "ios"
                ? PERMISSIONS.IOS.CAMERA
                : PERMISSIONS.ANDROID.CAMERA;
        const platformPermissionsMicroPhone =
            Platform.OS === "ios"
                ? PERMISSIONS.IOS.MICROPHONE
                : PERMISSIONS.ANDROID.RECORD_AUDIO;

        // 권한 설정 이동 핸들러
        const handleOpenSettings = () => {
            Linking.openSettings();
        }
        // 취소 핸들러
        const handleCancelButton = () => { }

        // 카메라 권한 요청
        const requestCameraPermission = async (first: boolean) => {
            try {
                const result = await check(platformPermissionsCamera);
                if (result === RESULTS.GRANTED) {
                    // 카메라 권한이 허용되어 있을 때
                    nav.navigate('카메라');
                } else if (result === RESULTS.DENIED) {
                    // 카메라 권한이 설정되어 있지 않을 때
                    if (first) {
                        request(platformPermissionsCamera).then(() => requestMicroPhonePermission(true));
                    }
                } else if (result === RESULTS.BLOCKED) {
                    // 카메라 권한이 거절되어 있을 때
                    first && Alert.alert(
                        '카메라 권한', "'이게뭐약'에서 알약을 촬영하여 검색하기 위해 카메라 권한이 필요합니다.",
                        [{ text: '설정', onPress: () => handleOpenSettings(), style: "destructive", isPreferred: true },
                        { text: '취소', onPress: () => handleCancelButton() }]
                    )
                } else {
                    // 그 외 (UNAVAILABLE, LIMITED)
                    Linking.openSettings();
                }
            } catch (err) {
                Alert.alert("카메라 권한을 확인해주세요.");
                console.warn(err);
                await PermissionsAndroid.request(PERMISSIONS.ANDROID.CAMERA);
            }
        };
        // 마이크 권한 요청
        const requestMicroPhonePermission = async (first: boolean) => {
            try {
                const result = await check(platformPermissionsMicroPhone);
                if (result === RESULTS.GRANTED) {
                    // 카메라 권한이 허용되어 있을 때
                    nav.navigate('카메라');
                } else if (result === RESULTS.DENIED) {
                    // 카메라 권한이 설정되어 있지 않을 때
                    if (first) {
                        request(platformPermissionsMicroPhone).then(() => requestCameraPermission(false));
                    }
                } else if (result === RESULTS.BLOCKED) {
                    // 카메라 권한이 거절되어 있을 때
                    first && Alert.alert(
                        '카메라 권한', "'이게뭐약'에서 알약을 촬영하여 검색하기 위해 카메라 권한이 필요합니다.",
                        [{ text: '설정', onPress: () => handleOpenSettings(), style: "destructive", isPreferred: true },
                        { text: '취소', onPress: () => handleCancelButton() }]
                    )
                } else {
                    // 그 외 (UNAVAILABLE, LIMITED)
                    Linking.openSettings();
                }
            } catch (err) {
                Alert.alert("카메라 권한을 확인해주세요.");
                console.warn(err);
                await PermissionsAndroid.request(PERMISSIONS.ANDROID.RECORD_AUDIO);
            }
        };
        requestCameraPermission(true);
    };

    const handlePressCameraButton = () => {
        permissionCheck();
    }

    useEffect(() => {
        nav.addListener('focus', () => handleSetScreen());
        return () => {
            nav.removeListener('focus', () => handleSetScreen());
        }
    }, []);


    const styles = StyleSheet.create({
        scrollViewWrapper: {
            flex: 1,
            backgroundColor: '#fff',
            ...gstyles.screenBorder,
        },
        viewWrapper: {
            minHeight: windowHeight - (defaultHeaderHeight + StatusBarHeight),
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: 'hidden',
            paddingHorizontal: 15,
            paddingBottom: 15 + (Platform.OS === 'ios' ? 28 : 0),
            backgroundColor: '#ffffff',
        },
        guideFrameWrapper: {
            alignItems: 'center',
            marginTop: 30,
            marginBottom: 30,
        },
        sampleImage: {
            width: 420,
            top: -380,
            position: 'absolute',
            resizeMode: 'contain',
        },
        button: {
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 13.5,
            paddingBottom: 14.5,
            borderRadius: 8,
            backgroundColor: '#7472EB',
        },
        button2: {
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 13.5,
            paddingBottom: 14.5,
            borderRadius: 8,
            backgroundColor: '#95937E',
        },
        buttonText: {
            width: '100%',
            paddingBottom: 0,
            textAlign: 'center',
            color: '#fff',
            fontSize: font(15),
            fontFamily: os.font(500, 500),
            includeFontPadding: false,
        },
        buttonWrapper: {
            gap: 7,
        },
        noteWrapper: {
            marginTop: 30,
        },
        noteHead: {
            paddingBottom: 2,
            color: '#000',
            fontSize: font(14),
            fontFamily: os.font(600, 700),
            includeFontPadding: false,
        },
        note: {
            paddingLeft: 4,
            paddingBottom: 0,
            marginTop: 3,
            color: '#656565',
            fontSize: font(13),
            fontFamily: os.font(400, 500),
            includeFontPadding: false,
        },
        guideButton: {
            paddingVertical: 10,
            marginVertical: 5,
            marginBottom: 15,
        },
        guideButtonWrapper: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
        },
        guideButtonText: {
            paddingBottom: 2,
            color: '#A5A5A5',
            fontSize: font(15),
            fontFamily: os.font(500, 600),
            includeFontPadding: false,
        }
    });

    return (
        <Layout.default>
            <View style={styles.viewWrapper}>
                <ScrollView
                    style={{ flex: 1, paddingTop: 24 }}
                    alwaysBounceVertical={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.guideFrameWrapper}>
                        <Image
                            style={styles.sampleImage}
                            source={require('@assets/images/sampleGuide.png')}  // header에 들어갈 로고이미지.
                        />
                        <SvgXml xml={GUIDE_FRAME} width={233} height={269} />
                    </View>
                    <View style={styles.noteWrapper} >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                            <SvgXml xml={NOTE_ICON} width={17} height={17} />
                            <Text style={styles.noteHead}>알약 사진을 찍을 때는 이렇게 찍어주세요!</Text>
                        </View>
                        <Text style={styles.note}>· 네모칸 안에 알약이 보이도록 촬영해주세요</Text>
                        <Text style={styles.note}>· 알약에 글자가 선명히 보이도록 촬영해주세요</Text>
                        <Text style={styles.note}>· 여러 알약을 촬영 시 겹치지 않게 해주세요</Text>
                    </View>
                </ScrollView>
                <Button.scale style={styles.guideButton}>
                    <View style={styles.guideButtonWrapper}>
                        <SvgXml xml={GUIDE_ICON} width={16} height={16} />
                        <Text style={styles.guideButtonText}>촬영 가이드</Text>
                    </View>
                </Button.scale>
                <View style={styles.buttonWrapper}>
                    <Button.scale activeScale={0.97} onPress={() => handlePressCameraButton()}>
                        <View style={styles.button} >
                            <Text style={styles.buttonText}>촬영하기</Text>
                        </View>
                    </Button.scale >
                    <Button.scale activeScale={0.97}>
                        <View style={styles.button2} >
                            <Text style={styles.buttonText}>앨범에서 선택</Text>
                        </View>
                    </Button.scale>
                </View>
            </View >
        </Layout.default>
    )
}

export default Search;

function setOpenScanner(arg0: boolean) {
    throw new Error("Function not implemented.");
}