import { imgFileState } from "@/atoms/file";
import { screenState } from "@/atoms/screen";
import Button from "@/components/atoms/Button";
import Layout, { StatusBarHeight, defaultHeaderHeight, windowHeight } from "@/components/organisms/Layout";
import { font, os } from "@/style/font";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { View, StyleSheet, Platform, Image, Text, Alert, Animated, Easing } from "react-native";
import { useRecoilState } from "recoil";
import { convertImgToBase64, getImgPath } from "@/utils/image";
import { launchImageLibrary } from "react-native-image-picker";
import { imgPickerOption } from "@/constans/options";
import ArrowLeftSvg from '@assets/svgs/arrow_left.svg';
import ArrowDownSvg from '@assets/svgs/arrow_down.svg';
import CameraSvg from '@assets/svgs/camera.svg';
import SearchSvg from '@assets/svgs/search.svg';
import ElbumSvg from '@assets/svgs/elbum.svg';

const SearchCrop = (): JSX.Element => {
    const nav: any = useNavigation();
    const downArrowAnimation = useRef(new Animated.Value(0)).current;
    const noteOpacityAnimation = useRef(new Animated.Value(0)).current;
    const noteUpAnimation = useRef(new Animated.Value(10)).current;
    const [screen, setScreen]: any = useRecoilState(screenState);
    const [imgFile, setImgFile]: any = useRecoilState(imgFileState);

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
        nav.navigate('카메라');
    }

    const handlePressRePick = async () => {
        const response = await launchImageLibrary(imgPickerOption)

        if (response.didCancel) { } // 앨범에서 선택이 취소되었을 때
        else if (response.errorMessage) Alert.alert('Error : ' + response.errorMessage)
        else {
            const uris: any[] = [];

            response.assets?.forEach((value) => uris.push(value)); // 선택한 사진 순서와 상관없이 들어옴
            setImgFile(uris[0]);
        }
    }

    const handlePressSearch = () => {
        nav.navigate('알약 검색 결과');
    }

    useEffect(() => {
        nav.addListener('focus', () => handleSetScreen());
        return () => {
            nav.removeListener('focus', () => handleSetScreen());
        }
    }, []);

    useEffect(() => {
        if (imgFile) {
            convertImgToBase64(imgFile).then((base64String: any) => {
                console.log('Base64 string:', base64String.slice(0, 10));
            }).catch((error) => {
                console.error('Error:', error);
            });
        }
    }, [imgFile])

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
            minHeight: windowHeight - (defaultHeaderHeight + StatusBarHeight),
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
            paddingHorizontal: 10,
        },
        cropImgWrapper: {
            width: '100%',
            aspectRatio: 304 / 352,
            marginTop: 30,
            borderRadius: 10,
            borderColor: '#000000',
            overflow: 'hidden',
        },
        cropImg: {
            height: '100%',
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
            justifyContent: 'center',
            marginBottom: 14,
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
            <View style={styles.viewWrapper}>
                <View style={styles.imgViewWrapper}>
                    <View style={styles.cropImgWrapper}>
                        {imgFile && <Image src={getImgPath(imgFile)} style={styles.cropImg} />}
                    </View>
                    <Button.scale onPress={handlePressRePick}>
                        <View style={styles.pickButtonWrapper}>
                            <ElbumSvg width={20} height={20} color={'#A5A5A5'} preserveAspectRatio="xMinYMax" />
                            <Text style={styles.pickButton}>앨범에서 다시 선택하기</Text>
                        </View>
                    </Button.scale>
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