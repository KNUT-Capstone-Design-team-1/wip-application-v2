import { screenState } from "@/atoms/screen";
import Button from "@/components/atoms/Button";
import Layout, { StatusBarHeight, windowHeight, windowWidth } from "@/components/organisms/Layout";
import { font, os } from "@/style/font";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Image, Animated, Easing, Vibration, Pressable } from "react-native";
import { SvgXml } from "react-native-svg";
import { Camera, Point, useCameraDevice, useCameraFormat } from "react-native-vision-camera";
import { useRecoilState } from "recoil";
import FrameSvg from '@assets/svgs/cameraFrame.svg';
import FlashOnSvg from '@assets/svgs/flash_on.svg';
import FlashOffSvg from '@assets/svgs/flash_off.svg';
import FocusLockSvg from '@assets/svgs/lock.svg';
import ExitSvg from '@assets/svgs/exit.svg';
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from 'react-native-reanimated';
import { trigger } from "react-native-haptic-feedback";
import { imgFileState } from "@/atoms/file";
import { cameraDeviceOption } from "@/constans/options";
import MaskedView from "@react-native-masked-view/masked-view";
import { getImgPath } from "@/utils/image";

/* 촬영버튼 xml */
const TAKEPIC_BTN = `
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64ZM22.5 30.2222C22.5 25.4051 26.4051 21.5 31.2222 21.5C36.0394 21.5 39.9444 25.4051 39.9444 30.2222C39.9444 35.0394 36.0394 38.9444 31.2222 38.9444C26.4051 38.9444 22.5 35.0394 22.5 30.2222ZM31.2222 18.5C24.7482 18.5 19.5 23.7482 19.5 30.2222C19.5 36.6963 24.7482 41.9444 31.2222 41.9444C33.9269 41.9444 36.4177 41.0284 38.4012 39.4897L42.9355 44.0568C43.5192 44.6447 44.4689 44.6481 45.0568 44.0645C45.6447 43.4808 45.6481 42.5311 45.0645 41.9432L40.5183 37.3641C42.0398 35.3867 42.9444 32.9101 42.9444 30.2222C42.9444 23.7482 37.6963 18.5 31.2222 18.5Z" fill="white"/>
    </svg>
`

const focusSize = 90;

const SearchCamera = (): JSX.Element => {
    const nav: any = useNavigation();
    const cameraDevice = useCameraDevice('back', cameraDeviceOption);
    const cameraRef = useRef<Camera>(null);
    const focusScaleAnimation = useRef(new Animated.Value(1.2)).current;
    const focusOpacityAnimation = useRef(new Animated.Value(1)).current;
    const [screen, setScreen]: any = useRecoilState(screenState);
    const [imgFile, setImgFile] = useRecoilState<any>(imgFileState);
    const [cameraLoading, setCameraLoading] = useState<boolean>(true);
    const [cameraImage, setCameraImage] = useState<null | any>(null);
    const [isTorch, setIsTorch] = useState<"off" | "on" | undefined>('off');
    const [focusXY, setFocusXY] = useState<any>({ x: 0, y: 0 });
    const [selectZoomLevel, setSelectZoomLevel] = useState<0 | 1 | 2>(1);
    const [zoomLevel, setZoomLevel] = useState<number | undefined>(cameraDevice?.neutralZoom);
    const [longFocus, setLongFocus] = useState<boolean>(false);


    const cameraFormat = useCameraFormat(cameraDevice, [
        { photoResolution: { width: 640, height: 640 } }
    ])

    /** 포커스 크기 축소 애니메이션 */
    const focusScaleAni = () => {
        Animated.timing(focusScaleAnimation, {
            toValue: 1,
            delay: 0,
            duration: 600,
            easing: Easing.bezier(.14, 1.07, .59, .97),
            useNativeDriver: false,
        }).start();
    }

    /** 포커스 반투명 애니메이션 */
    const focusOpacityAni = () => {
        Animated.timing(focusOpacityAnimation, {
            toValue: 0.5,
            delay: 1500,
            duration: 400,
            easing: Easing.bezier(.14, 1.07, .59, .97),
            useNativeDriver: false,
        }).start();
    }

    /** 수동 포커스 실행 */
    const focusOn = useCallback((point: Point) => {
        const c = cameraRef.current;
        if (c == null) return
        c.focus(point)
        focusScaleAnimation.setValue(1.2);
        focusOpacityAnimation.setValue(1);
        setFocusXY({ x: point.x, y: point.y });
        setLongFocus(false);
        focusScaleAni();
    }, []);

    /** 수동 포커스 중지 */
    const focusOff = useCallback((bool: boolean) => {
        const focusInterval = setTimeout(() => {
            const c = cameraRef.current;
            if (c == null) return;
            setFocusXY({ x: 0, y: 0 });
            c.focus({ x: windowWidth / 2, y: windowHeight / 2 });
        }, 4000);

        if (bool)
            for (let i = 0; i < Number(focusInterval); i++) clearTimeout(i);
        else
            for (let i = 0; i <= Number(focusInterval); i++) clearTimeout(i);

        focusScaleAni();
    }, []);

    /** 카메라 제스처 관리 */
    const gesture = Gesture.Simultaneous(
        Gesture.Tap().onBegin(({ x, y }) => {
            if (longFocus) {
                runOnJS(setFocusXY)({ x: 0, y: 0 });
                runOnJS(setLongFocus)(false);
            } else {
                runOnJS(focusOn)({ x, y });
            }
        }).onEnd(() => {
            runOnJS(focusOpacityAni)();
            runOnJS(focusOff)(true);
        }),
        Gesture.LongPress().onStart(() => {
            runOnJS(setLongFocus)(true);
            runOnJS(focusOff)(false);
        }).onFinalize(() => {
            runOnJS(focusOpacityAni)();
        })
    )

    const handleSetScreen = () => {
        setScreen('알약 검색');
    }

    /** 카메라 촬영 */
    const handleTakePic = async () => {
        if (cameraRef.current === null) return;
        try {
            const imageData = await cameraRef.current.takePhoto();
            setCameraImage(imageData);
            setImgFile(imageData);
            await nav.replace('알약 촬영');
        } catch (e) {
            console.log(e);
        }
    }

    const handleBackBtn = () => {
        nav.goBack();
    }

    const handleClickFlash = () => {
        if (isTorch === 'off') setIsTorch('on');
        if (isTorch === 'on') setIsTorch('off');
    }

    /** zoom level 변경 핸들러 */
    const handleClickZoomLevelButton = (z: 0 | 1 | 2): any => {
        if (cameraDevice) {
            const normal = cameraDevice.neutralZoom;
            let rate;
            switch (z) {
                case 0:
                    rate = Number(normal) / 2;
                    break;
                case 1:
                    rate = Number(normal);
                    break;
                case 2:
                    rate = Number(normal) * 2;
                    break;
            }
            setSelectZoomLevel(z);
            setZoomLevel(rate);
        }
    }

    /** 썸네일 클릭 핸들러 */
    const handlePressThumbnail = async () => {
        await nav.replace('알약 촬영');
    }

    useEffect(() => {
        nav.addListener('focus', () => handleSetScreen());
        return () => {
            nav.removeListener('focus', () => handleSetScreen());
        }
    }, [handleSetScreen, nav]);

    useEffect(() => {
        if (cameraDevice !== undefined) {
            setCameraLoading(false);
        }
    }, [cameraDevice]);

    useEffect(() => {
        if (focusXY.x !== 0 && focusXY.y !== 0) {
        }
    }, [focusXY]);

    useEffect(() => {
        const options = {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: true,
        };
        if (longFocus) {
            trigger("impactLight", options);
        }
    }, [longFocus])

    const styles = StyleSheet.create({
        topWrapper: {
            flex: 1,
            justifyContent: 'center',
            paddingTop: StatusBarHeight + 10,
            paddingBottom: 30,
            paddingRight: 10,
            paddingLeft: 12,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 10,
        },
        backBtnWrapper: {
            position: 'absolute',
            top: StatusBarHeight + 10,
            right: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
        },
        backBtn: {
            paddingHorizontal: 20,
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        noteWrapper: {
            width: '100%',
            alignItems: 'center',
            gap: 8,
            marginTop: 24,
        },
        title: {
            width: '100%',
            textAlign: 'center',
            fontFamily: os.font(500, 500),
            fontSize: font(24),
            color: '#fff',
            includeFontPadding: false,
            paddingBottom: 0,
        },
        note: {
            paddingVertical: 10,
            paddingHorizontal: 18,
            color: '#f4ffa5',
            borderRadius: 16,
            overflow: 'hidden',
        },
        mainWrapper: {
            width: '100%',
            aspectRatio: '1/1',
            pointerEvents: 'box-none',
            zIndex: 0,
        },
        bottomWrapper: {
            flex: 1,
            gap: 44,
            paddingTop: 22,
            paddingBottom: 86,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 10,
        },
        buttonWrapper: {
            height: 76,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
        },
        zoomLevelWrapper: {
        },
        zoomLevelList: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
            width: '100%',
            pointerEvents: 'box-none',
            zIndex: 10,
        },
        zoomLevelButton: {
            justifyContent: 'center',
            alignItems: 'center',
            width: 36,
            height: 36,
            borderRadius: 100,
            borderWidth: 1,
            borderColor: '#ffffff60',
            backgroundColor: 'rgba(0,0,0,0.75)'
        },
        zoomLevelText: {
            width: '100%',
            marginBottom: 1,
            textAlign: 'center',
            color: '#fff',
            fontSize: font(12),
            fontFamily: os.font(500, 500),
            includeFontPadding: false,
        },
        zoomLevelActiveText: {
            color: '#d9ff00',
            fontSize: font(11),
            fontFamily: os.font(400, 400),
        },
        zoomLevelButtonActive: {
            transform: [{
                scale: 1.3
            }],
            marginHorizontal: 6,
        },
        takePicBtnWrapper: {
            justifyContent: 'center',
            alignItems: 'center',
            width: 76,
            height: 76,
            borderRadius: 100,
            borderWidth: 3,
            borderColor: '#fff',
        },
        thumbnailImage: {
            width: 52,
            height: 52,
            borderRadius: 100,
            borderWidth: 1,
            borderColor: '#444'
        },
        frameWrapper: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
        },
        frame: {
            width: '66%',
            aspectRatio: '1/1',
            backgroundColor: '#000',
        },
        flashBtnWrapper: {
            position: 'absolute',
            right: 10,
            top: 10,
        },
        flashBtn: {
            justifyContent: 'center',
            alignItems: 'center',
            width: 40,
            height: 40,
            borderRadius: 100,
            borderWidth: 1,
            borderColor: '#ffffff60',
            backgroundColor: 'rgba(0,0,0,0.75)'
        },
        loadingTextWrapper: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            textAlign: 'center',
            paddingTop: 200,
        },
        loadingText: {
            color: '#fff',
        },
        focusDetected: {
            display: focusXY.x === 0 && focusXY.y === 0 ? 'none' : 'flex',
            position: 'absolute',
            top: focusXY.y - (focusSize / 2),
            left: focusXY.x - (focusSize / 2),
            width: focusSize,
            height: focusSize,
            transform: [{ scale: focusScaleAnimation }],
            opacity: focusOpacityAnimation,
            borderWidth: 1,
            borderColor: '#ff0c',
            pointerEvents: 'none',
        },
        LineTop: {
            position: 'absolute',
            top: 0,
            left: focusSize / 2,
            width: 1,
            height: 8,
            backgroundColor: '#ff0c'
        },
        LineLeft: {
            position: 'absolute',
            top: focusSize / 2,
            left: 0,
            width: 8,
            height: 1,
            backgroundColor: '#ff0c'
        },
        LineBottom: {
            position: 'absolute',
            bottom: 0,
            left: focusSize / 2,
            width: 1,
            height: 8,
            backgroundColor: '#ff0c'
        },
        LineRight: {
            position: 'absolute',
            top: focusSize / 2,
            right: 0,
            width: 8,
            height: 1.1,
            backgroundColor: '#ff0c'
        },
        focusLock: {
            position: 'absolute',
            top: - 20,
            left: (focusSize / 2) - 4,
        }
    });

    return (
        <Layout.fullscreen>
            <View style={styles.topWrapper}>
                <View style={styles.backBtnWrapper}>
                    <TouchableOpacity style={styles.backBtn} onPress={handleBackBtn}>
                        <ExitSvg width={17} height={17} preserveAspectRatio="xMinYMax" />
                    </TouchableOpacity>
                </View>
                <View style={styles.noteWrapper}>
                    <Text style={styles.title}>알약 촬영</Text>
                    <Text style={styles.note}>알약을 화면 중앙에 두고 촬영해주세요.</Text>
                </View>
            </View>
            <View style={styles.mainWrapper}>
                <MaskedView
                    style={{ flex: 1, height: '100%' }}
                    maskElement={
                        <View style={styles.frameWrapper}>
                            <View style={styles.frame} />
                        </View>
                    }
                >
                    {cameraDevice &&
                        <GestureDetector gesture={gesture}>
                            <Camera
                                ref={cameraRef}
                                style={StyleSheet.absoluteFill}
                                device={cameraDevice}
                                isActive={true}
                                photo={true}
                                torch={isTorch}
                                format={cameraFormat}
                                zoom={zoomLevel}
                                enableZoomGesture
                            />
                        </GestureDetector>
                    }
                    {cameraLoading &&
                        <View style={styles.loadingTextWrapper}>
                            <Text style={styles.loadingText}>카메라를 불러오는중입니다.</Text>
                        </View>
                    }
                </MaskedView>
                <Animated.View style={styles.focusDetected}>
                    <View style={styles.LineTop} />
                    <View style={styles.LineLeft} />
                    <View style={styles.LineBottom} />
                    <View style={styles.LineRight} />
                    {longFocus && <FocusLockSvg style={styles.focusLock} width={9} />}
                </Animated.View>
                <Button.scale
                    style={styles.flashBtnWrapper}
                    onPress={() => handleClickFlash()}
                    activeScale={0.85}
                >
                    <View style={styles.flashBtn}>
                        {isTorch === 'on' ?
                            <FlashOnSvg width={'70%'} />
                            :
                            <FlashOffSvg width={'70%'} />
                        }
                    </View>
                </Button.scale>
            </View>
            <View style={styles.bottomWrapper}>
                <View style={styles.zoomLevelList}>
                    <Button.scale activeScale={1.1} style={styles.zoomLevelWrapper} onPress={() => handleClickZoomLevelButton(0)}>
                        <View style={[styles.zoomLevelButton, selectZoomLevel === 0 && styles.zoomLevelButtonActive]}>
                            <Text style={[styles.zoomLevelText, selectZoomLevel === 0 && styles.zoomLevelActiveText]}>.5x</Text>
                        </View>
                    </Button.scale>
                    <Button.scale activeScale={1.1} style={[styles.zoomLevelWrapper]} onPress={() => handleClickZoomLevelButton(1)}>
                        <View style={[styles.zoomLevelButton, selectZoomLevel === 1 && styles.zoomLevelButtonActive]}>
                            <Text style={[styles.zoomLevelText, selectZoomLevel === 1 && styles.zoomLevelActiveText]}>1x</Text>
                        </View>
                    </Button.scale>
                    <Button.scale activeScale={1.1} style={[styles.zoomLevelWrapper]} onPress={() => handleClickZoomLevelButton(2)}>
                        <View style={[styles.zoomLevelButton, selectZoomLevel === 2 && styles.zoomLevelButtonActive]}>
                            <Text style={[styles.zoomLevelText, selectZoomLevel === 2 && styles.zoomLevelActiveText]}>2x</Text>
                        </View>
                    </Button.scale>
                </View>
                <View style={styles.buttonWrapper}>
                    <Button.scale activeScale={1.1} onPress={handlePressThumbnail}>
                        <View style={{ width: 50 }}>
                            {!!imgFile && <Image src={getImgPath(imgFile)} style={styles.thumbnailImage} />}
                        </View>
                    </Button.scale>
                    <TouchableOpacity style={styles.takePicBtnWrapper} onPress={handleTakePic}>
                        <SvgXml xml={TAKEPIC_BTN} width={64} height={64} />
                    </TouchableOpacity>
                    <View style={{ width: 50 }} />
                </View>
            </View>
        </Layout.fullscreen>
    )
}

export default SearchCamera;