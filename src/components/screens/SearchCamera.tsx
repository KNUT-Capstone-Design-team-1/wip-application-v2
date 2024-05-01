import { screenState } from "@/atoms/screen";
import Button from "@/components/atoms/Button";
import Layout, { StatusBarHeight } from "@/components/organisms/Layout";
import { font, os } from "@/style/font";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Image } from "react-native";
import Svg, { Defs, Mask, Rect, SvgXml } from "react-native-svg";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { useRecoilState } from "recoil";

/* 뒤로가기 icon xml */
const BACKBUTTON_ICON = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" >
        <path d="M13 1L1 13M1 1L13 13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

/* 촬영버튼 xml */
const TAKEPIC_BTN = `
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64ZM22.5 30.2222C22.5 25.4051 26.4051 21.5 31.2222 21.5C36.0394 21.5 39.9444 25.4051 39.9444 30.2222C39.9444 35.0394 36.0394 38.9444 31.2222 38.9444C26.4051 38.9444 22.5 35.0394 22.5 30.2222ZM31.2222 18.5C24.7482 18.5 19.5 23.7482 19.5 30.2222C19.5 36.6963 24.7482 41.9444 31.2222 41.9444C33.9269 41.9444 36.4177 41.0284 38.4012 39.4897L42.9355 44.0568C43.5192 44.6447 44.4689 44.6481 45.0568 44.0645C45.6447 43.4808 45.6481 42.5311 45.0645 41.9432L40.5183 37.3641C42.0398 35.3867 42.9444 32.9101 42.9444 30.2222C42.9444 23.7482 37.6963 18.5 31.2222 18.5Z" fill="white"/>
    </svg>
`

const SearchCamera = (): JSX.Element => {
    const nav: any = useNavigation();
    const device = useCameraDevice('back');
    const cameraRef = useRef<Camera>(null);
    const [screen, setScreen]: any = useRecoilState(screenState);
    const [cameraLoading, setCameraLoading] = useState<boolean>(true);
    const [cameraImage, setCameraImage] = useState<null | any>(null);

    const WindowWidth = Dimensions.get('window').width;
    const WindowHeight = Dimensions.get('window').height;
    const squareSize = WindowWidth / 1.4; // 정사각형 크기
    const borderRadius = 0; // 정사각형 둥근 모서리

    const handleSetScreen = () => {
        setScreen('알약 검색');
    }

    const handleTakePic = async () => {
        if (cameraRef.current === null) return;
        try {
            //Camera component를 사진으로 찍는다
            const imageData = await cameraRef.current.takePhoto();
            setCameraImage(imageData);
        } catch (e) {
            console.log(e);
        }
    }

    const handleBackBtn = () => {
        nav.goBack();
    }

    useEffect(() => {
        nav.addListener('focus', () => handleSetScreen());
        return () => {
            nav.removeListener('focus', () => handleSetScreen());
        }
    }, [handleSetScreen, nav]);

    useEffect(() => {
        if (device !== undefined) {
            setCameraLoading(false);
        }
    }, [device]);

    const styles = StyleSheet.create({
        topWrapper: {
            position: 'absolute',
            width: WindowWidth,
            top: 0,
            left: 0,
            paddingTop: StatusBarHeight + 10,
            paddingBottom: 5,
            paddingRight: 10,
            paddingLeft: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#000a'
        },
        bottomWrapper: {
            position: 'absolute',
            width: '100%',
            bottom: 0,
            left: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            paddingHorizontal: 15,
            paddingBottom: 40,
            paddingTop: 25,
            backgroundColor: '#000a'
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
        backBtn: {
            height: '100%',
            paddingHorizontal: 40,
            right: -30,
            justifyContent: 'center',
        },
        thumbnailImage: {
            width: 52,
            height: 52,
            borderRadius: 100,
            borderWidth: 1,
            borderColor: '#444'
        },
        title: {
            paddingLeft: 5,
            fontFamily: os.font(500, 500),
            fontSize: font(18),
            color: '#fff'
        }
    });

    if (cameraLoading) return <Text>Loading...</Text>

    return (
        <Layout.fullscreen>
            {device &&
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={true}
                    photo={true}
                    ref={cameraRef}
                />
            }
            <View style={{ flex: 1 }}>
                <Svg height={WindowHeight + 1} width={WindowWidth + 1}>
                    <Defs>
                        <Mask id="mask" x="0" y="0" height={WindowHeight} width={WindowWidth}>
                            <Rect height={WindowHeight} width={WindowWidth} fill="#fff" />
                            <Rect
                                x={(WindowWidth - squareSize) / 2}
                                y={(WindowHeight - squareSize) / 2}
                                width={squareSize}
                                height={squareSize}
                                rx={borderRadius} // 둥근 모서리
                                ry={borderRadius} // 둥근 모서리
                                fill="black"
                            />
                        </Mask>
                    </Defs>
                    <Rect
                        height={WindowHeight}
                        width={WindowWidth}
                        fill="rgba(0,0,0,0)"
                        mask="url(#mask)"
                    />
                </Svg>
            </View>
            <View style={styles.bottomWrapper}>
                <Button.scale activeScale={1.1}>
                    <View style={{ width: 52 }}>
                        {cameraImage && <Image src={'file://' + cameraImage.path} style={styles.thumbnailImage} />}
                    </View>
                </Button.scale>
                <TouchableOpacity style={styles.takePicBtnWrapper} onPress={handleTakePic}>
                    <SvgXml xml={TAKEPIC_BTN} width={64} height={64} />
                </TouchableOpacity>
                <View style={{ width: 52 }} />
            </View>
            <View style={styles.topWrapper}>
                <Text style={styles.title}>알약 촬영</Text>
                <TouchableOpacity style={styles.backBtn} onPress={handleBackBtn}>
                    <SvgXml xml={BACKBUTTON_ICON} width={17} height={28} />
                </TouchableOpacity>
            </View>
        </Layout.fullscreen>
    )
}

export default SearchCamera;