import Button from '@/components/atoms/Button';
import Layout, {
  StatusBarHeight,
  windowHeight,
  windowWidth,
} from '@/components/organisms/Layout';
import { font, os } from '@/style/font';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import {
  Camera,
  Point,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import CameraMaskFrame from '@assets/svgs/cameraMaskFrame.svg';
import FlashOnSvg from '@assets/svgs/flash_on.svg';
import FlashOffSvg from '@assets/svgs/flash_off.svg';
import FocusLockSvg from '@assets/svgs/lock.svg';
import ExitSvg from '@assets/svgs/exit.svg';
import ArrowRightSvg from '@assets/svgs/arrow_right.svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { trigger } from 'react-native-haptic-feedback';
import { cameraDeviceOption } from '@/constants/options';
import { getCropImage, getImgPath } from '@/utils/image';
import { useImgFileStore } from '@/store/imgFileStore';
import { useScreenStore } from '@/store/screen';

interface ICameraImg {
  front: any;
  back: any;
}

// 포커스 UI 가로,세로 크기
const focusSize = 90;

// 진동 옵션
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

const SearchCamera = (): React.JSX.Element => {
  const nav: any = useNavigation();
  const cameraDevice = useCameraDevice('back', cameraDeviceOption);
  const cameraRef = useRef<Camera>(null);
  const focusScaleAnimation = useRef(new Animated.Value(1.2)).current;
  const focusOpacityAnimation = useRef(new Animated.Value(1)).current;
  const boxGapAnimation = useRef(new Animated.Value(-60)).current;
  const boxOpacityAnimation = useRef(new Animated.Value(0)).current;
  const guideFrontTopAnimation = useRef(new Animated.Value(-100)).current;
  const guideBackTopAnimation = useRef(new Animated.Value(-100)).current;
  const guideCompleteTopAnimation = useRef(new Animated.Value(-100)).current;
  const arrowLoopAnimation = useRef(new Animated.Value(0)).current;

  const setScreen = useScreenStore((state) => state.setScreen);
  const setImgFile = useImgFileStore((state) => state.setImgFile);
  const [cameraLoading, setCameraLoading] = useState<boolean>(true);
  const [cameraImage, setCameraImage] = useState<null | ICameraImg>(null);
  const [currentDirection, setCurrentDirection] = useState<
    'front' | 'back' | 'complete'
  >('front');
  const [isTorch, setIsTorch] = useState<'off' | 'on' | undefined>('off');
  const [focusXY, setFocusXY] = useState<any>({ x: 0, y: 0 });
  const [selectZoomLevel, setSelectZoomLevel] = useState<0 | 1 | 2>(1);
  const [zoomLevel, setZoomLevel] = useState<number | undefined>(
    cameraDevice?.neutralZoom,
  );
  const [longFocus, setLongFocus] = useState<boolean>(false);

  const cameraFormat = useCameraFormat(cameraDevice, [
    { photoResolution: { width: 1280, height: 1280 } },
  ]);

  /** 포커스 크기 축소 애니메이션 */
  const focusScaleAni = useCallback(() => {
    Animated.timing(focusScaleAnimation, {
      toValue: 1,
      delay: 0,
      duration: 600,
      easing: Easing.bezier(0.14, 1.07, 0.59, 0.97),
      useNativeDriver: false,
    }).start();
  }, [focusScaleAnimation]);

  /** 포커스 반투명 애니메이션 */
  const focusOpacityAni = () => {
    Animated.timing(focusOpacityAnimation, {
      toValue: 0.5,
      delay: 1500,
      duration: 400,
      easing: Easing.bezier(0.14, 1.07, 0.59, 0.97),
      useNativeDriver: false,
    }).start();
  };

  /** 뒷면 이미지 박스 이동 애니메이션 */
  const boxGapAni = useCallback(() => {
    Animated.timing(boxGapAnimation, {
      toValue: 24,
      delay: 0,
      duration: 600,
      easing: Easing.bezier(0.14, 1.07, 0.59, 0.97),
      useNativeDriver: false,
    }).start();
  }, [boxGapAnimation]);

  /** 뒷면 이미지 박스 나타나는 애니메이션 */
  const boxOpacityAni = useCallback(() => {
    Animated.timing(boxOpacityAnimation, {
      toValue: 1,
      delay: 0,
      duration: 600,
      easing: Easing.bezier(0.14, 1.07, 0.59, 0.97),
      useNativeDriver: false,
    }).start();
  }, [boxOpacityAnimation]);

  /** 가이드 나타나는 애니메이션 */
  const guideFrontTopAni = useCallback(() => {
    Animated.timing(guideFrontTopAnimation, {
      toValue: 14,
      delay: 0,
      duration: 300,
      easing: Easing.bezier(0.14, 1.07, 0.59, 0.97),
      useNativeDriver: false,
    }).start();
  }, [guideFrontTopAnimation]);

  /** 가이드 나타나는 애니메이션 */
  const guideBackTopAni = useCallback(() => {
    Animated.timing(guideBackTopAnimation, {
      toValue: 14,
      delay: 0,
      duration: 300,
      easing: Easing.bezier(0.14, 1.07, 0.59, 0.97),
      useNativeDriver: false,
    }).start();
  }, [guideBackTopAnimation]);

  /** 가이드 나타나는 애니메이션 */
  const guideCompleteTopAni = useCallback(() => {
    Animated.timing(guideCompleteTopAnimation, {
      toValue: 14,
      delay: 0,
      duration: 300,
      easing: Easing.bezier(0.14, 1.07, 0.59, 0.97),
      useNativeDriver: false,
    }).start();
  }, [guideCompleteTopAnimation]);

  /** 화살표 반복 애니메이션 */
  const downArrowAni = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(arrowLoopAnimation, {
          toValue: 5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(arrowLoopAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [arrowLoopAnimation]);

  /** 수동 포커스 실행 */
  const focusOn = useCallback(
    (point: Point) => {
      const c = cameraRef.current;
      if (c == null) return;
      c.focus(point);
      focusScaleAnimation.setValue(1.2);
      focusOpacityAnimation.setValue(1);
      setFocusXY({ x: point.x, y: point.y });
      setLongFocus(false);
      focusScaleAni();
    },
    [focusOpacityAnimation, focusScaleAni, focusScaleAnimation],
  );

  /** 수동 포커스 중지 */
  const focusOff = useCallback(
    (bool: boolean) => {
      const focusInterval = setTimeout(() => {
        const c = cameraRef.current;
        if (c == null) return;
        setFocusXY({ x: 0, y: 0 });
        c.focus({ x: windowWidth / 2, y: windowHeight / 2 });
      }, 4000);

      if (bool) for (let i = 0; i < Number(focusInterval); i++) clearTimeout(i);
      else for (let i = 0; i <= Number(focusInterval); i++) clearTimeout(i);

      focusScaleAni();
    },
    [focusScaleAni],
  );

  /** 카메라 제스처 관리 */
  const gesture = Gesture.Simultaneous(
    Gesture.Tap()
      .onBegin(({ x, y }) => {
        'worklet';
        if (longFocus) {
          setFocusXY({ x: 0, y: 0 });
          setLongFocus(false);
        } else {
          focusOn({ x, y });
        }
      })
      .onEnd(() => {
        'worklet';
        focusOpacityAni();
        focusOff(true);
      }),
    Gesture.LongPress()
      .onStart(() => {
        'worklet';
        setLongFocus(true);
        focusOff(false);
      })
      .onFinalize(() => {
        'worklet';
        focusOpacityAni();
      }),
  );

  const handleSetScreen = useCallback(() => {
    setScreen('알약 검색');
  }, [setScreen]);

  /** 카메라 촬영 */
  const handleTakePic = async () => {
    if (cameraRef.current === null) return;
    try {
      if (currentDirection !== 'complete') {
        const imageData = await cameraRef.current.takePhoto();
        let result: null | ICameraImg = { front: null, back: null };

        if (cameraImage) {
          result = { ...cameraImage };
          if (currentDirection === 'front') {
            if (!result.back) setCurrentDirection('back');
            else setCurrentDirection('complete');
          }
          if (currentDirection === 'back') {
            if (!result.front) setCurrentDirection('front');
            else setCurrentDirection('complete');
          }
        } else {
          if (currentDirection === 'front') {
            setCurrentDirection('back');
          }
          if (currentDirection === 'back') {
            setCurrentDirection('front');
          }
        }
        result[currentDirection] = await getCropImage(imageData, 0.666);
        setCameraImage(result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleBackBtn = () => {
    nav.goBack();
  };

  const handleClickFlash = () => {
    if (isTorch === 'off') setIsTorch('on');
    if (isTorch === 'on') setIsTorch('off');
  };

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
  };

  const handlePressBox = (direction: 'front' | 'back') => {
    setCurrentDirection(direction);
  };

  const handlePressComplete = () => {
    if (cameraImage) {
      setImgFile(cameraImage);
      nav.replace('알약 촬영');
    }
  };

  useEffect(() => {
    nav.addListener('focus', () => handleSetScreen());
    return () => {
      nav.removeListener('focus', () => handleSetScreen());
    };
  }, [handleSetScreen, nav]);

  useEffect(() => {
    if (cameraDevice !== undefined) {
      setCameraLoading(false);
    }
  }, [cameraDevice]);

  useEffect(() => {
    if (longFocus) {
      trigger('impactLight', options);
    }
  }, [longFocus]);

  useEffect(() => {
    if (cameraImage) {
      boxGapAni();
      boxOpacityAni();
    }
    if (cameraImage?.front && cameraImage.back) {
      trigger('impactLight', options);
    }
  }, [boxGapAni, boxOpacityAni, cameraImage]);

  useEffect(() => {
    trigger('impactLight', options);
    guideFrontTopAnimation.setValue(-100);
    guideBackTopAnimation.setValue(-100);
    guideCompleteTopAnimation.setValue(-100);
    if (currentDirection === 'front') {
      guideFrontTopAni();
    }
    if (currentDirection === 'back') {
      guideBackTopAni();
    }
    if (currentDirection === 'complete') {
      guideCompleteTopAni();
    }
  }, [
    currentDirection,
    guideBackTopAni,
    guideBackTopAnimation,
    guideCompleteTopAni,
    guideCompleteTopAnimation,
    guideFrontTopAni,
    guideFrontTopAnimation,
  ]);

  useEffect(() => {
    downArrowAni();
  }, [downArrowAni]);

  const styles = StyleSheet.create({
    LineBottom: {
      backgroundColor: '#ff0c',
      bottom: 0,
      height: 8,
      left: focusSize / 2,
      position: 'absolute',
      width: 1,
    },
    LineLeft: {
      backgroundColor: '#ff0c',
      height: 1,
      left: 0,
      position: 'absolute',
      top: focusSize / 2,
      width: 8,
    },
    LineRight: {
      backgroundColor: '#ff0c',
      height: 1.1,
      position: 'absolute',
      right: 0,
      top: focusSize / 2,
      width: 8,
    },
    LineTop: {
      backgroundColor: '#ff0c',
      height: 8,
      left: focusSize / 2,
      position: 'absolute',
      top: 0,
      width: 1,
    },
    activeBoxWrapper: { borderColor: '#ffffa1', transform: [{ scale: 1 }] },
    backBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    backBtnWrapper: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      position: 'absolute',
      right: 0,
    },
    bottomWrapper: {
      backgroundColor: 'rgba(0, 0, 0, 1)',
      gap: Platform.OS === 'ios' ? 44 : 24,
      paddingBottom: Platform.OS === 'ios' ? 66 : 18,
      paddingTop: 20,
      zIndex: 10,
    },
    boxBack: { marginLeft: boxGapAnimation, opacity: boxOpacityAnimation },
    boxImg: { borderRadius: 10, height: '100%', width: '100%' },
    boxText: {
      color: '#fff',
      fontFamily: os.font(400, 400),
      fontSize: font(14),
      includeFontPadding: false,
      paddingBottom: 0,
    },
    boxWrapper: {
      alignItems: 'center',
      aspectRatio: '1/1',
      backgroundColor: '#1e1e26',
      borderColor: '#000',
      borderRadius: 12,
      borderWidth: 1.5,
      height: '85%',
      justifyContent: 'center',
      overflow: 'hidden',
      transform: [{ scale: 0.9 }],
    },
    buttonWrapper: {
      alignItems: 'center',
      flexDirection: 'row',
      height: 76,
      justifyContent: 'space-around',
    },
    completeArrow: {
      flexDirection: 'row',
      gap: -10,
      transform: [{ translateX: arrowLoopAnimation }],
    },
    completeBtn: { alignItems: 'center', flexDirection: 'row', gap: 6 },
    completeText: {
      color: '#fff',
      fontFamily: os.font(400, 400),
      fontSize: font(20),
      includeFontPadding: false,
      paddingBottom: 2,
    },
    flashBtn: {
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.75)',
      borderColor: '#ffffff60',
      borderRadius: 100,
      borderWidth: 1,
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    flashBtnWrapper: { bottom: 10, position: 'absolute', right: 10 },
    focusDetected: {
      borderColor: '#ff0c',
      borderWidth: 1,
      display: focusXY.x === 0 && focusXY.y === 0 ? 'none' : 'flex',
      height: focusSize,
      left: focusXY.x - focusSize / 2,
      opacity: focusOpacityAnimation,
      pointerEvents: 'none',
      position: 'absolute',
      top: focusXY.y - focusSize / 2,
      transform: [{ scale: focusScaleAnimation }],
      width: focusSize,
    },
    focusLock: { left: focusSize / 2 - 4, position: 'absolute', top: -20 },
    frame: { aspectRatio: '1/1', backgroundColor: '#000', width: '66%' },
    frameWrapper: {
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      height: '100%',
      justifyContent: 'center',
      left: 0,
      pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      width: '100%',
    },
    frontBackContainer: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      position: 'relative',
      width: '100%',
    },
    loadingText: { color: '#fff' },
    loadingTextWrapper: {
      alignItems: 'center',
      height: '100%',
      paddingTop: 200,
      position: 'absolute',
      textAlign: 'center',
      width: '100%',
    },
    mainWrapper: {
      alignItems: 'center',
      aspectRatio: '1/1',
      pointerEvents: 'box-none',
      position: 'relative',
      width: '100%',
      zIndex: 0,
    },
    note: {
      color: '#ffffff',
      fontFamily: os.font(400, 500),
      fontSize: font(14),
      includeFontPadding: false,
      paddingBottom: 0,
    },
    noteBack: { color: '#75a3ec' },
    noteBackWrapper: { top: guideBackTopAnimation },
    noteBold: {
      fontFamily: os.font(800, 800),
    },
    noteComplete: { color: '#fffa5f' },
    noteCompleteWrapper: { top: guideCompleteTopAnimation },
    noteFront: { color: '#FF6868' },
    noteFrontWrapper: { top: guideFrontTopAnimation },
    noteWrapper: {
      backgroundColor: '#00000066',
      borderRadius: 22,
      flexDirection: 'row',
      paddingHorizontal: 18,
      paddingVertical: 10,
      position: 'absolute',
    },
    takePicBtn: {
      backgroundColor: '#fff',
      borderRadius: 100,
      height: 64,
      opacity: currentDirection === 'complete' ? 0.3 : 1,
      width: 64,
    },
    takePicBtnWrapper: {
      alignItems: 'center',
      borderColor:
        currentDirection === 'complete'
          ? 'rgba(255, 255, 255 , 0.3)'
          : 'rgba(255, 255, 255, 1)',
      borderRadius: 100,
      borderWidth: 3,
      height: 76,
      justifyContent: 'center',
      width: 76,
    },
    thumbnailImage: {
      borderColor: '#444',
      borderRadius: 100,
      borderWidth: 1,
      height: 52,
      width: 52,
    },
    title: {
      color: '#fff',
      fontFamily: os.font(500, 500),
      fontSize: font(20),
      includeFontPadding: false,
      paddingBottom: 0,
      paddingLeft: 16,
      paddingTop: 2,
      textAlign: 'left',
      width: '100%',
    },
    titleWrapper: {
      flexDirection: 'row',
      marginTop: 0,
      width: '100%',
      zIndex: 10,
    },
    topWrapper: {
      backgroundColor: 'rgba(0, 0, 0, 1)',
      flex: 1,
      justifyContent: 'center',
      maxHeight: 200,
      paddingTop: StatusBarHeight + 10,
      zIndex: 10,
    },
    zoomLevelActiveText: {
      color: '#d9ff00',
      fontFamily: os.font(400, 400),
      fontSize: font(11),
    },
    zoomLevelButton: {
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.75)',
      borderColor: '#ffffff60',
      borderRadius: 100,
      borderWidth: 1,
      height: 36,
      justifyContent: 'center',
      width: 36,
    },
    zoomLevelButtonActive: { marginHorizontal: 6, transform: [{ scale: 1.3 }] },
    zoomLevelList: {
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'center',
      pointerEvents: 'box-none',
      width: '100%',
      zIndex: 10,
    },
    zoomLevelText: {
      color: '#fff',
      fontFamily: os.font(500, 500),
      fontSize: font(12),
      includeFontPadding: false,
      marginBottom: 1,
      textAlign: 'center',
      width: '100%',
    },
    zoomLevelWrapper: {},
  });

  return (
    <Layout.fullscreen>
      <View style={styles.topWrapper}>
        <View style={styles.titleWrapper}>
          <View style={styles.backBtnWrapper}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBackBtn}>
              <ExitSvg width={17} height={17} preserveAspectRatio="xMinYMax" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.frontBackContainer}>
          <Button.scale
            style={{ zIndex: 2 }}
            onPress={() => handlePressBox('front')}
          >
            <View
              style={[
                styles.boxWrapper,
                currentDirection === 'front' && styles.activeBoxWrapper,
              ]}
            >
              {cameraImage?.front ? (
                <Image
                  src={getImgPath(cameraImage.front)}
                  style={styles.boxImg}
                />
              ) : (
                <Text style={styles.boxText}>앞면</Text>
              )}
            </View>
          </Button.scale>
          {!!cameraImage && (
            <Button.scale
              style={{ zIndex: 1 }}
              onPress={() => handlePressBox('back')}
            >
              <Animated.View
                style={[
                  styles.boxWrapper,
                  currentDirection === 'back' && styles.activeBoxWrapper,
                  styles.boxBack,
                ]}
              >
                {cameraImage?.back ? (
                  <Image
                    src={getImgPath(cameraImage.back)}
                    style={styles.boxImg}
                  />
                ) : (
                  <Text style={styles.boxText}>뒷면</Text>
                )}
              </Animated.View>
            </Button.scale>
          )}
        </View>
      </View>
      <GestureDetector gesture={gesture}>
        <View style={styles.mainWrapper}>
          {cameraDevice && (
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
          )}
          {cameraLoading && (
            <View style={styles.loadingTextWrapper}>
              <Text style={styles.loadingText}>카메라를 불러오는중입니다.</Text>
            </View>
          )}
          <CameraMaskFrame
            width={'100%'}
            height={'100%'}
            style={{ pointerEvents: 'none' }}
          />
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
              {isTorch === 'on' ? (
                <FlashOnSvg width={'70%'} />
              ) : (
                <FlashOffSvg width={'70%'} />
              )}
            </View>
          </Button.scale>
          {currentDirection === 'front' && (
            <Animated.View
              style={[styles.noteWrapper, styles.noteFrontWrapper]}
            >
              <Text style={[styles.note, styles.noteBold, styles.noteFront]}>
                1. (앞면)
              </Text>
              <Text style={[styles.note, styles.noteBold]}>
                {' '}
                알약의 글자가 보이도록
              </Text>
              <Text style={styles.note}> 찍어주세요 !</Text>
            </Animated.View>
          )}
          {currentDirection === 'back' && (
            <Animated.View style={[styles.noteWrapper, styles.noteBackWrapper]}>
              <Text style={[styles.note, styles.noteBold, styles.noteBack]}>
                2. (뒷면)
              </Text>
              <Text style={[styles.note, styles.noteBold]}>
                {' '}
                알약을 뒤집어서
              </Text>
              <Text style={styles.note}> 한 번 더 찍어주세요 !</Text>
            </Animated.View>
          )}
          {currentDirection === 'complete' && (
            <Animated.View
              style={[styles.noteWrapper, styles.noteCompleteWrapper]}
            >
              <Text style={[styles.note, styles.noteBold]}>검색</Text>
              <Text style={styles.note}>하시려면 아래에</Text>
              <Text style={[styles.note, styles.noteBold, styles.noteComplete]}>
                {' '}
                완료{' '}
              </Text>
              <Text style={styles.note}>버튼을 눌러주세요 !</Text>
            </Animated.View>
          )}
        </View>
      </GestureDetector>
      <View style={styles.bottomWrapper}>
        <View style={styles.zoomLevelList}>
          <Button.scale
            activeScale={1.1}
            style={styles.zoomLevelWrapper}
            onPress={() => handleClickZoomLevelButton(0)}
          >
            <View
              style={[
                styles.zoomLevelButton,
                selectZoomLevel === 0 && styles.zoomLevelButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.zoomLevelText,
                  selectZoomLevel === 0 && styles.zoomLevelActiveText,
                ]}
              >
                .5x
              </Text>
            </View>
          </Button.scale>
          <Button.scale
            activeScale={1.1}
            style={styles.zoomLevelWrapper}
            onPress={() => handleClickZoomLevelButton(1)}
          >
            <View
              style={[
                styles.zoomLevelButton,
                selectZoomLevel === 1 && styles.zoomLevelButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.zoomLevelText,
                  selectZoomLevel === 1 && styles.zoomLevelActiveText,
                ]}
              >
                1x
              </Text>
            </View>
          </Button.scale>
          <Button.scale
            activeScale={1.1}
            style={styles.zoomLevelWrapper}
            onPress={() => handleClickZoomLevelButton(2)}
          >
            <View
              style={[
                styles.zoomLevelButton,
                selectZoomLevel === 2 && styles.zoomLevelButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.zoomLevelText,
                  selectZoomLevel === 2 && styles.zoomLevelActiveText,
                ]}
              >
                2x
              </Text>
            </View>
          </Button.scale>
        </View>
        <View style={styles.buttonWrapper}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={styles.takePicBtnWrapper}
            onPress={handleTakePic}
            disabled={currentDirection === 'complete'}
          >
            <View style={styles.takePicBtn} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            {cameraImage?.front && cameraImage.back && (
              <Button.scale onPress={handlePressComplete}>
                <View style={styles.completeBtn}>
                  <Text style={styles.completeText}>완료</Text>
                  <Animated.View style={styles.completeArrow}>
                    <ArrowRightSvg width={16} height={16} />
                    <ArrowRightSvg width={16} height={16} />
                  </Animated.View>
                </View>
              </Button.scale>
            )}
          </View>
        </View>
      </View>
    </Layout.fullscreen>
  );
};

export default SearchCamera;
