import { screenState } from "@/atoms/screen";
import Button from "@/components/atoms/Button";
import Layout, { StatusBarHeight, defaultHeaderHeight, windowHeight } from "@/components/organisms/Layout";
import { font, os } from "@/style/font";
import { gstyles } from "@/style/globalStyle";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { View, StyleSheet, Text, Platform, Image, Alert, Linking, PermissionsAndroid } from "react-native";
import { PERMISSIONS, RESULTS, check, request } from "react-native-permissions";
import { SvgXml } from "react-native-svg";
import { useRecoilState } from "recoil";
import CameraSvg from '@assets/svgs/camera.svg';
import ElbumSvg from '@assets/svgs/elbum.svg';
import NoteSvg from '@assets/svgs/note.svg';
import GuideFrameSvg from '@assets/svgs/guideFrame.svg';
import { ImageLibraryOptions, launchImageLibrary } from "react-native-image-picker";
import { imgFileState } from "@/atoms/file";
import { requestCameraPermission } from "@/utils/permission";
import { imgPickerOption } from "@/constans/options";

const Search = ({ route }: any): JSX.Element => {
    const nav: any = useNavigation();
    const [screen, setScreen] = useRecoilState(screenState);
    const [imgFile, setImgFile] = useRecoilState(imgFileState);

    /* 샘플 사진 프레임 xml */
    const GUIDE_FRAME = `
    <svg width="233" height="269" viewBox="0 0 233 269" fill="none">
        <path d="M27.5954 1H9C4.58172 1 1 4.58172 1 9V27.5483" stroke="black" stroke-width="2.5"/>
        <path d="M232 27.5483L232 9C232 4.58172 228.418 1 224 1L205.405 0.999999" stroke="black" stroke-width="2.5"/>
        <path d="M205.405 268L224 268C228.418 268 232 264.418 232 260L232 241.452" stroke="black" stroke-width="2.5"/>
        <path d="M1 241.452L1 260C1 264.418 4.58172 268 9 268L27.5954 268" stroke="black" stroke-width="2.5"/>
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

    /** 카메라 권한 확인 */
    const permissionCheck = () => {
        if (Platform.OS !== "ios" && Platform.OS !== "android") return;
        requestCameraPermission(true, () => nav.navigate('카메라'));
    };

    const handlePressCameraButton = () => {
        permissionCheck();
    }

    const handlePressImgPicker = async () => {
        const response = await launchImageLibrary(imgPickerOption)

        if (response.didCancel) { } // 앨범에서 선택이 취소되었을 때
        else if (response.errorMessage) Alert.alert('Error : ' + response.errorMessage)
        else {
            const uris: any[] = [];

            response.assets?.forEach((value) => uris.push(value)); // 선택한 사진 순서와 상관없이 들어옴
            setImgFile(uris[0]);
            nav.navigate('알약 촬영');
        }
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
            position: 'relative',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
            marginBottom: 30,
        },
        sampleImage: {
            top: '-10%',
            height: '180%',
            resizeMode: 'contain',
        },
        button: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            height: 54,
            borderRadius: 8,
            backgroundColor: '#7472EB',
        },
        button2: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            height: 54,
            borderRadius: 8,
            backgroundColor: '#95937E',
        },
        buttonText: {
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
            marginTop: '4%',
            marginBottom: '4%',
            alignItems: 'center',
        },
        noteHeadWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
        },
        noteHead: {
            paddingBottom: 2,
            color: '#000',
            fontSize: font(16),
            fontFamily: os.font(600, 700),
            includeFontPadding: false,
        },
        note: {
            paddingLeft: 4,
            paddingBottom: 0,
            marginTop: 3,
            color: '#656565',
            fontSize: font(14),
            fontFamily: os.font(400, 500),
            includeFontPadding: false,
        },
        guideButton: {
            paddingVertical: 10,
            marginVertical: 5,
            marginBottom: 10,
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
        },
        buttonImg: {
            width: 20,
            height: 20
        }
    });

    return (
        <Layout.default>
            <View style={styles.viewWrapper}>
                <View
                    style={{ flex: 1, paddingTop: '10%' }}
                >
                    <View style={styles.guideFrameWrapper}>
                        <Image
                            style={styles.sampleImage}
                            source={require('@assets/images/sampleGuide.png')}  // header에 들어갈 로고이미지.
                        />
                        <GuideFrameSvg style={{ position: 'absolute' }} width={233} height={269} preserveAspectRatio="xMinYMax" />
                    </View>
                    <View style={styles.noteWrapper} >
                        <View style={styles.noteHeadWrapper}>
                            <NoteSvg width={18} height={18} />
                            <Text style={styles.noteHead}>알약 사진을 찍을 때는 이렇게 찍어주세요!</Text>
                        </View>
                        <Text style={styles.note}>네모칸 안에 알약이 보이도록 촬영해주세요</Text>
                        <Text style={styles.note}>알약에 글자가 선명히 보이도록 촬영해주세요</Text>
                        <Text style={styles.note}>여러 알약을 촬영 시 겹치지 않게 해주세요</Text>
                    </View>
                </View>

                <Button.scale style={styles.guideButton}>
                    {/* 임시 삭제
                        <View style={styles.guideButtonWrapper}>
                            <SvgXml xml={GUIDE_ICON} width={16} height={16} />
                            <Text style={styles.guideButtonText}>촬영 가이드</Text>
                        </View>
                     */}
                </Button.scale>
                <View style={styles.buttonWrapper}>
                    <Button.scale
                        activeScale={0.97}
                        onPress={() => handlePressCameraButton()}
                    >
                        <View style={styles.button} >
                            <CameraSvg width={18} height={18} />
                            <Text style={styles.buttonText}>촬영하기</Text>
                        </View>
                    </Button.scale >
                    <Button.scale
                        activeScale={0.97}
                        onPress={handlePressImgPicker}
                    >
                        <View style={styles.button2} >
                            <ElbumSvg width={18} height={18} color={'#fff'} />
                            <Text style={styles.buttonText}>앨범에서 선택</Text>
                        </View>
                    </Button.scale>
                </View>
            </View >
        </Layout.default>
    )
}

export default Search;