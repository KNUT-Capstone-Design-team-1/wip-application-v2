import Button from '@/components/atoms/Button';
import Layout from '@/components/organisms/Layout';
import { font, os } from '@/style/font';
import { gstyles } from '@/style/globalStyle';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import CameraSvg from '@assets/svgs/camera.svg';
import ElbumSvg from '@assets/svgs/elbum.svg';
import NoteSvg from '@assets/svgs/note.svg';
import GuideFrameSvg from '@assets/svgs/guideFrame.svg';
import { requestCameraPermission } from '@/utils/permission';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SvgXml } from 'react-native-svg';
import { useScreenStore } from '@/store/screen';
import { useImgFileStore } from '@/store/imgFileStore';
import { svgData } from '@/constants/svgDatas';

const SearchImage = ({ route }: any): React.JSX.Element => {
  const nav: any = useNavigation();
  const setScreen = useScreenStore((state) => state.setScreen);
  const setImgFile = useImgFileStore((state) => state.setImgFile);
  const [showGuide, setShowGuide] = useState<boolean | null>(null);

  const handleSetScreen = () => {
    setScreen('알약 검색');
  };

  /** 카메라 권한 확인 */
  const permissionCheck = async () => {
    const seen = await AsyncStorage.getItem('hasSeenShootingGuide');

    if (seen === 'true') {
      if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
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
  };

  const handlePressImgPicker = async () => {
    setImgFile({ front: null, back: null });
    nav.navigate('알약 촬영');
  };

  useEffect(() => {
    const checkGuideShown = async () => {
      const hasShown = await AsyncStorage.getItem('hasSeenShootingGuide');
      setShowGuide(hasShown !== 'true'); // 처음이면 true 반환
    };
    checkGuideShown();

    nav.addListener('focus', () => handleSetScreen());
    return () => {
      nav.removeListener('focus', () => handleSetScreen());
    };
  }, []);

  const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      backgroundColor: '#7472EB',
      borderRadius: 8,
      flexDirection: 'row',
      gap: 8,
      height: 54,
      justifyContent: 'center',
    },
    button2: {
      alignItems: 'center',
      backgroundColor: '#95937E',
      borderRadius: 8,
      flexDirection: 'row',
      gap: 8,
      height: 54,
      justifyContent: 'center',
    },
    buttonImg: { height: 20, width: 20 },
    buttonText: {
      color: '#fff',
      fontFamily: os.font(500, 500),
      fontSize: font(15),
      includeFontPadding: false,
      textAlign: 'center',
    },
    buttonWrapper: { gap: 7 },
    guideButton: {
      // paddingVertical: 10,
      // marginVertical: 5,
      // marginBottom: 10,
    },
    guideButtonText: {
      color: '#A5A5A5',
      fontFamily: os.font(500, 600),
      fontSize: font(15),
      includeFontPadding: false,
      paddingBottom: 2,
    },
    guideButtonWrapper: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
    },
    guideFrameWrapper: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      marginBottom: 30,
      marginTop: 10,
      position: 'relative',
    },
    guideText: { color: '#A5A5A5' },
    guideTextWrapper: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'center',
      marginTop: 20,
      marginVertical: 8,
      width: '100%',
    },
    note: {
      color: '#656565',
      fontFamily: os.font(400, 500),
      fontSize: font(14),
      includeFontPadding: false,
      marginTop: 3,
      paddingBottom: 0,
      paddingLeft: 4,
    },
    noteHead: {
      color: '#000',
      fontFamily: os.font(600, 700),
      fontSize: font(16),
      includeFontPadding: false,
      paddingBottom: 2,
    },
    noteHeadWrapper: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 7,
      marginTop: 30,
    },
    noteWrapper: { alignItems: 'center', marginBottom: '4%', marginTop: '4%' },
    question: {
      backgroundColor: '#A5A5A5',
      borderRadius: 50,
      color: '#fff',
      display: 'flex',
      textAlign: 'center',
    },
    questionText: { color: '#fff', height: 20, textAlign: 'center', width: 20 },
    sampleImage: { height: '150%', top: '10%' },
    scrollViewWrapper: {
      backgroundColor: '#fff',
      flex: 1,
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
    warnText: {
      color: '#952323',
      fontFamily: os.font(600, 600),
      fontSize: font(14),
      includeFontPadding: false,
      marginTop: 3,
      paddingBottom: 0,
      paddingLeft: 4,
    },
  });

  return (
    <Layout.default>
      <View style={styles.viewWrapper}>
        <View style={{ flex: 1, paddingTop: '10%' }}>
          <View style={styles.guideFrameWrapper}>
            <Image
              style={styles.sampleImage}
              source={require('@assets/images/sampleGuide.png')} // header에 들어갈 로고이미지.
            />
          </View>
          <View style={styles.noteWrapper}>
            <View style={styles.noteHeadWrapper}>
              <NoteSvg width={18} height={18} />
              <Text style={styles.noteHead}>
                알약 사진을 찍을 때는 이렇게 찍어주세요!
              </Text>
            </View>
            <Text style={styles.note}>
              네모칸 안에 알약이 보이도록 촬영해주세요
            </Text>
            <Text style={styles.note}>
              알약에 글자가 선명히 보이도록 촬영해주세요
            </Text>
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
            <View style={styles.button}>
              <CameraSvg width={18} height={18} />
              <Text style={styles.buttonText}>촬영하기</Text>
            </View>
          </Button.scale>
          <Button.scale activeScale={0.97} onPress={handlePressImgPicker}>
            <View style={styles.button2}>
              <ElbumSvg width={18} height={18} color={'#fff'} />
              <Text style={styles.buttonText}>앨범에서 선택</Text>
            </View>
          </Button.scale>
        </View>
      </View>
    </Layout.default>
  );
};

export default SearchImage;
