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
import { svgData } from "@/constants/svgDatas.tsx";

const SearchImage = ({ route }: any): JSX.Element => {
    const nav: any = useNavigation();
    const [screen, setScreen] = useRecoilState(screenState);
    const [imgFile, setImgFile] = useRecoilState(imgFileState);
    const [showGuide, setShowGuide] = useState<boolean | null>(null);

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
            height: '150%',
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
                                <SvgXml xml={svgData.QUESTION_ICON} width={20} height={20} />
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
