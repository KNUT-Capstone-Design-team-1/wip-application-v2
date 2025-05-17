import { screenState } from "@/atoms/screen";
import Button from "@/components/atoms/Button";
import Layout from "@/components/organisms/Layout";
import { font, os } from "@/style/font";
import { gstyles } from "@/style/globalStyle";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text, Platform, Image, TouchableOpacity } from "react-native";
import { useRecoilState } from "recoil";
import CameraSvg from '@assets/svgs/camera.svg';
import ElbumSvg from '@assets/svgs/elbum.svg';
import NoteSvg from '@assets/svgs/note.svg';
import GuideFrameSvg from '@assets/svgs/guideFrame.svg';
import { imgFileState } from "@/atoms/file";
import { requestCameraPermission } from "@/utils/permission";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SvgXml } from "react-native-svg";

const SearchImage = ({ route }: any): JSX.Element => {
    const nav: any = useNavigation();
    const [screen, setScreen] = useRecoilState(screenState);
    const [imgFile, setImgFile] = useRecoilState(imgFileState);

    const [showGuide, setShowGuide] = useState<boolean | null>(null);

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
    `;

    // 물음표 아이콘
    const QUESTION_ICON = `
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="30" height="30" rx="15" fill="#A5A5A5"/>
        <path d="M16.6381 21.3C16.5448 20.6333 16.5848 20.04 16.7581 19.52C16.9315 18.9867 17.1715 18.5067 17.4781 18.08C17.7981 17.64 18.1181 17.2333 18.4381 16.86C18.7715 16.4733 19.0515 16.0933 19.2781 15.72C19.5181 15.3333 19.6381 14.92 19.6381 14.48C19.6381 14.1067 19.5581 13.78 19.3981 13.5C19.2515 13.2067 19.0315 12.9733 18.7381 12.8C18.4581 12.6267 18.1048 12.54 17.6781 12.54C17.2115 12.54 16.7715 12.6533 16.3581 12.88C15.9581 13.0933 15.5915 13.3867 15.2581 13.76L13.9581 12.58C14.4515 12.02 15.0315 11.56 15.6981 11.2C16.3648 10.84 17.1115 10.66 17.9381 10.66C18.7248 10.66 19.4115 10.8067 19.9981 11.1C20.5981 11.38 21.0581 11.7933 21.3781 12.34C21.7115 12.8733 21.8781 13.54 21.8781 14.34C21.8781 14.9133 21.7581 15.4333 21.5181 15.9C21.2915 16.3533 21.0048 16.78 20.6581 17.18C20.3115 17.58 19.9715 17.9867 19.6381 18.4C19.3181 18.8 19.0581 19.2333 18.8581 19.7C18.6581 20.1667 18.5915 20.7 18.6581 21.3H16.6381ZM17.6781 26.28C17.2381 26.28 16.8715 26.1267 16.5781 25.82C16.2848 25.5 16.1381 25.1067 16.1381 24.64C16.1381 24.16 16.2848 23.7733 16.5781 23.48C16.8715 23.1733 17.2381 23.02 17.6781 23.02C18.1181 23.02 18.4848 23.1733 18.7781 23.48C19.0848 23.7733 19.2381 24.16 19.2381 24.64C19.2381 25.1067 19.0848 25.5 18.7781 25.82C18.4848 26.1267 18.1181 26.28 17.6781 26.28Z" fill="white"/>
    </svg>
    `;

    const handleSetScreen = () => {
        setScreen('알약 검색');
    }

    /** 카메라 권한 확인 */
    const permissionCheck = async () => {
        const seen = await AsyncStorage.getItem('hasSeenShootingGuide');

        if (seen === "true") {
            if (Platform.OS !== "ios" && Platform.OS !== "android") return;
            requestCameraPermission(true, () => nav.navigate('카메라'));
        } else {
            nav.navigate('촬영 가이드');
        }
    };

    const handleGuideComplete = async () => {
        await AsyncStorage.setItem('hasSeenShootingGuide', 'true');
        setShowGuide(false);
    };

    const handlePressCameraButton = () => {
        permissionCheck();
        handleGuideComplete();
    }

    const handlePressImgPicker = async () => {
        setImgFile({ front: null, back: null })
        nav.navigate('알약 촬영');
    }

    useEffect(() => {
        const checkGuideShown = async () => {
            const hasShown = await AsyncStorage.getItem('hasSeenShootingGuide');
            setShowGuide(hasShown !== 'true'); // 처음이면 true 반환
        };
        checkGuideShown();

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
            flex: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            // overflow: 'hidden',
            paddingHorizontal: 15,
            // paddingBottom: 15 + (Platform.OS === 'ios' ? 0 : 0),
            paddingBottom: 15,
            backgroundColor: '#fff',
        },
        guideFrameWrapper: {
            position: 'relative',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            marginBottom: 30,
        },
        sampleImage: {
            top: '10%',
            height: '120%',
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
            marginTop: 30,
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
        warnText: {
            paddingLeft: 4,
            paddingBottom: 0,
            marginTop: 3,
            color: '#952323',
            fontSize: font(14),
            fontFamily: os.font(600, 600),
            includeFontPadding: false,
        },
        guideButton: {
            // paddingVertical: 10,
            // marginVertical: 5,
            // marginBottom: 10,
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
        },
        guideTextWrapper: {
            marginVertical: 8,
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: "row",
            display: "flex",
            gap: 10,
            width: "100%"
        },
        question: {
            display: "flex",
            backgroundColor: "#A5A5A5",
            color: "#fff",
            textAlign: "center",
            borderRadius: 50,
        },
        questionText: {
            width: 20,
            height: 20,
            textAlign: "center",
            color: "#fff"
        },
        guideText: {
            color: "#A5A5A5"
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
                        <Text style={styles.note}>하나의 알약만 보이도록 촬영해주세요</Text>
                        <TouchableOpacity
                          style={styles.guideTextWrapper}
                          onPress={async () => {
                              nav.navigate('촬영 가이드');
                              setScreen('촬영 가이드');

                              await AsyncStorage.clear();
                          }}
                        >
                            <View style={styles.question}>
                                {/*<Text style={styles.questionText}>?</Text>*/}
                                <SvgXml xml={QUESTION_ICON} width={20} height={20} />
                            </View>
                            <Text style={styles.guideText}>촬영 가이드</Text>
                        </TouchableOpacity>
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

export default SearchImage;
