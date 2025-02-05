import { imgFileState } from "@/atoms/file";
import { screenState } from "@/atoms/screen";
import Button from "@/components/atoms/Button";
import Layout, { StatusBarHeight, defaultHeaderHeight, windowHeight } from "@/components/organisms/Layout";
import { font, os } from "@/style/font";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { View, StyleSheet, Platform, Image, Text, Alert, Animated, Easing } from "react-native";
import { useRecoilState } from "recoil";
import { getCropImage, getImgPath } from "@/utils/image";
import { launchImageLibrary } from "react-native-image-picker";
import { imgPickerOption } from "@/constants/options";
import ArrowLeftSvg from '@assets/svgs/arrow_left.svg';
import ArrowDownSvg from '@assets/svgs/arrow_down.svg';
import CameraSvg from '@assets/svgs/camera.svg';
import SearchSvg from '@assets/svgs/search.svg';
import ElbumSvg from '@assets/svgs/elbum.svg';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Toast from "react-native-toast-message";
import { requestCameraPermission } from "@/utils/permission";
import GoogleAdmob from "@components/screens/GoogleAdmob.tsx";
import { admobState } from "@/atoms/admob.ts";

const SearchCrop = (): JSX.Element => {
    const nav: any = useNavigation();
    const downArrowAnimation = useRef(new Animated.Value(0)).current;
    const noteOpacityAnimation = useRef(new Animated.Value(0)).current;
    const noteUpAnimation = useRef(new Animated.Value(10)).current;
    const viewShotRef = useRef<any>(null);
    const [screen, setScreen]: any = useRecoilState(screenState);
    const [imgFile, setImgFile]: any = useRecoilState(imgFileState);
    const { showInterstitial } = GoogleAdmob();
    const [admobCount, setAdmobCount] = useRecoilState(admobState);

    /** 화살표 반복 애니메이션 */
    const downArrowAni = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(downArrowAnimation, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(downArrowAnimation, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }

    /** 문구 올라오기 애니메이션 */
    const noteUpAni = () => {
        Animated.timing(noteUpAnimation, {
            toValue: 0,
            delay: 600,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }

    /** 문구 나타나기 애니메이션 */
    const noteOpacityAni = () => {
        Animated.timing(noteOpacityAnimation, {
            toValue: 1,
            delay: 600,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }

    const downArrowInterpolated = downArrowAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 8]
    });

    const handleSetScreen = () => {
        setScreen('알약 검색');
    }

    const handlePressRetry = () => {
        if (Platform.OS !== "ios" && Platform.OS !== "android") return;
        requestCameraPermission(true, () => nav.navigate('카메라'))
    }

    const handlePressRePick = async (direction: string) => {
        const response = await launchImageLibrary(imgPickerOption);
        let result;
        if (imgFile) {
            result = { ...imgFile };
        } else {
            result = { front: null, back: null };
        }

        if (response.didCancel) { }
        else if (response.errorMessage) Alert.alert('Error : ' + response.errorMessage)
        else {
            const uris: any[] = [];

            response.assets?.forEach((value) => uris.push(value));
            result[direction] = await getCropImage(uris[0], 1);
            setImgFile(result);
        }
    }

    const handlePressSearch = async () => {
        if (!!imgFile.front && !!imgFile.back) {
            showGoogleAdmobState(); // 광고 재생 성공 시 로직 카운트 적용
            mergeImages();
        } else {
            Toast.show({
                type: 'errorToast',
                text1: '검색할 알약의 사진을 선택해주세요.',
            });
        }
    }

    // 광고를 언제 한 번 보여줄지 나타내는 함수 (핸재 3번에 한 번 보여지도록)
    const showGoogleAdmobState = () => {
        setAdmobCount(prev => prev + 1);

        if(admobCount === 2) {
            showInterstitial();
            setAdmobCount(0);
        }
    }

    const mergeImages = async () => {
        if (viewShotRef.current) {
            viewShotRef.current.capture().then((uri: any) => {
                nav.replace('알약 검색 결과', { data: uri, mode: 1 });
            });
        }
    };

    useEffect(() => {
        nav.addListener('focus', () => handleSetScreen());
        return () => {
            nav.removeListener('focus', () => handleSetScreen());
        }
    }, []);

    useEffect(() => {
        downArrowAni();
        noteUpAni();
        noteOpacityAni();
    }, [])

    const styles = StyleSheet.create({
        scrollViewWrapper: {
            flex: 1,
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
        },
        viewWrapper: {
            flex: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: 'hidden',
            paddingHorizontal: 15,
            paddingBottom: 15 + (Platform.OS === 'ios' ? 28 : 0),
            backgroundColor: '#ffffff',
        },
        imgViewWrapper: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
        },
        cropImgList: {
            flexDirection: 'row',
            gap: 12,
            position: 'relative',
            width: '100%',
            marginTop: 30,
            borderColor: '#000000',
        },
        cropImgWrapper: {
            alignItems: 'center',
            position: 'relative',
            flex: 1,
        },
        cropImg: {
            width: '100%',
            aspectRatio: '1/1',
            borderRadius: 10,
        },
        emptyImg: {
            padding: 14,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            aspectRatio: '1/1',
            borderRadius: 10,
            backgroundColor: '#efeff7',
        },
        emptyImgText: {
            width: '100%',
            textAlign: 'center',
            color: '#a1a1a1',
            fontSize: font(14),
            fontFamily: os.font(400, 400),
            includeFontPadding: false,
            paddingBottom: 0,
        },
        btnWrapper: {
            flexDirection: 'row',
            gap: 8,
            height: 54,
        },
        reTryBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            height: '100%',
            paddingHorizontal: 32,
            backgroundColor: '#6A6A93',
            borderRadius: 8,
            overflow: 'hidden',
        },
        searchBtnWrapper: {
            flex: 1,
        },
        searchBtn: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
            height: '100%',
            alignItems: 'center',
            paddingHorizontal: 18,
            backgroundColor: '#7472EB',
            borderRadius: 8,
            overflow: 'hidden',
        },
        btnText: {
            textAlign: 'center',
            color: '#fff',
            fontSize: font(15),
            fontFamily: os.font(500, 600),
            paddingBottom: 2,
            includeFontPadding: false,
        },
        noteTextWrapper: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: 60,
            opacity: noteOpacityAnimation,
            transform: [{ translateY: noteUpAnimation }],
        },
        noteText: {
            textAlign: 'center',
            color: '#000',
            fontSize: font(16),
            fontFamily: os.font(500, 500),
            includeFontPadding: false,
            paddingBottom: 22,
        },
        pickButtonWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginTop: 6,
            paddingVertical: 16,
            paddingHorizontal: 16,
        },
        labelText: {
            color: '#000',
            fontSize: font(14),
            fontFamily: os.font(500, 500),
            includeFontPadding: false,
            paddingBottom: 10,
        },
        pickButton: {
            color: '#A5A5A5',
            fontSize: font(14),
            fontFamily: os.font(500, 500),
            includeFontPadding: false,
            paddingBottom: 1,
        },
        downArrow: {
            transform: [{ translateY: downArrowInterpolated }],
        }
    });

    return (
        <Layout.default>
            <ViewShot ref={viewShotRef} style={{ position: 'absolute', width: 1280, height: 640, flexDirection: 'row', zIndex: -1, opacity: 0 }} options={{ fileName: "merged", format: "jpg", quality: 1 }}>
                {imgFile?.front && <Image src={getImgPath(imgFile.front)} style={{ width: '50%', height: '100%' }} />}
                {imgFile?.back && <Image src={getImgPath(imgFile.back)} style={{ width: '50%', height: '100%' }} />}
            </ViewShot>
            <View style={styles.viewWrapper}>
                <View style={styles.imgViewWrapper}>
                    <View style={styles.cropImgList}>

                        <View style={styles.cropImgWrapper}>
                            <Text style={styles.labelText}>앞면</Text>
                            <Button.scale onPress={() => handlePressRePick('front')}>
                                {imgFile?.front ?
                                    <Image src={getImgPath(imgFile.front)} style={styles.cropImg} />
                                    :
                                    <View style={styles.emptyImg}>
                                        <Text style={styles.emptyImgText}>알약의 글자가 보이는 사진을 선택해주세요.</Text>
                                    </View>
                                }
                            </Button.scale>
                            <Button.scale onPress={() => handlePressRePick('front')}>
                                <View style={styles.pickButtonWrapper}>
                                    <ElbumSvg width={20} height={20} color={'#A5A5A5'} preserveAspectRatio="xMinYMax" />
                                    <Text style={styles.pickButton}>앨범에서 선택하기</Text>
                                </View>
                            </Button.scale>
                        </View>
                        <View style={styles.cropImgWrapper}>
                            <Text style={styles.labelText}>뒷면</Text>
                            <Button.scale onPress={() => handlePressRePick('back')}>
                                {imgFile?.back ?
                                    <Image src={getImgPath(imgFile.back)} style={styles.cropImg} />
                                    :
                                    <View style={styles.emptyImg}>
                                        <Text style={styles.emptyImgText}>알약의 반대 면의 사진을 선택해주세요.</Text>
                                    </View>
                                }
                            </Button.scale>
                            <Button.scale onPress={() => handlePressRePick('back')}>
                                <View style={styles.pickButtonWrapper}>
                                    <ElbumSvg width={20} height={20} color={'#A5A5A5'} preserveAspectRatio="xMinYMax" />
                                    <Text style={styles.pickButton}>앨범에서 선택하기</Text>
                                </View>
                            </Button.scale>
                        </View>
                    </View>

                    <Animated.View style={styles.noteTextWrapper}>
                        <Text style={styles.noteText}>{`위 알약 사진이 제대로 나왔다면,\n아래 검색 버튼을 눌러주세요!`}</Text>
                        <Animated.View style={styles.downArrow}>
                            <ArrowDownSvg />
                            <ArrowDownSvg />
                        </Animated.View>
                    </Animated.View>
                </View>
                <View style={styles.btnWrapper}>
                    <Button.scale onPress={handlePressRetry}>
                        <View style={styles.reTryBtn}>
                            <CameraSvg width={20} height={20} preserveAspectRatio="xMinYMax" />
                        </View>
                    </Button.scale>
                    <Button.scale style={styles.searchBtnWrapper} onPress={handlePressSearch}>
                        <View style={styles.searchBtn}>
                            <SearchSvg width={15} height={15} strokeWidth={1.5} preserveAspectRatio="xMinYMax" />
                            <Text style={styles.btnText}>알약 검색하기</Text>
                        </View>
                    </Button.scale>
                </View>
            </View>
        </Layout.default>
    )
}

export default SearchCrop;
