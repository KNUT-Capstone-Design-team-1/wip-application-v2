import Button from '@/components/atoms/Button';
import Layout from '@/components/organisms/Layout';
import { font, os } from '@/style/font';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Image,
  Text,
  Animated,
} from 'react-native';
import { getImgPath } from '@/utils/image';
import {
  openPicker,
  clean as cleanPicker,
  type Image as ImageType,
} from 'react-native-image-crop-picker';
import { imgPickerOption } from '@/constants/options';
import ArrowDownSvg from '@assets/svgs/arrow_down.svg';
import CameraSvg from '@assets/svgs/camera.svg';
import SearchSvg from '@assets/svgs/search.svg';
import ElbumSvg from '@assets/svgs/elbum.svg';
import ViewShot from 'react-native-view-shot';
import Toast from 'react-native-toast-message';
import { requestCameraPermission } from '@/utils/permission';
import { useScreenStore } from '@/store/screen';
import { TImgFile, useImgFileStore } from '@/store/imgFileStore';
import { useSearchImgStore } from '@/store/searchImgStore';

const SearchCrop = (): React.JSX.Element => {
  const nav: any = useNavigation();
  const downArrowAnimation = useRef(new Animated.Value(0)).current;
  const noteOpacityAnimation = useRef(new Animated.Value(0)).current;
  const noteUpAnimation = useRef(new Animated.Value(10)).current;
  const viewShotRef = useRef<any>(null);
  const setScreen = useScreenStore((state) => state.setScreen);
  const imgFile = useImgFileStore((state) => state.imgFile);
  const setImgFile = useImgFileStore((state) => state.setImgFile);
  const setSearchImage = useSearchImgStore((state) => state.setSearchImg);

  /** 화살표 반복 애니메이션 */
  const downArrowAni = useCallback(() => {
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
        }),
      ]),
    ).start();
  }, [downArrowAnimation]);
  /** 문구 올라오기 애니메이션 */
  const noteUpAni = useCallback(() => {
    Animated.timing(noteUpAnimation, {
      toValue: 0,
      delay: 600,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [noteUpAnimation]);

  /** 문구 나타나기 애니메이션 */
  const noteOpacityAni = useCallback(() => {
    Animated.timing(noteOpacityAnimation, {
      toValue: 1,
      delay: 600,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [noteOpacityAnimation]);

  const downArrowInterpolated = downArrowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });

  const handleSetScreen = useCallback(() => {
    setScreen('알약 검색');
  }, [setScreen]);

  const handlePressRetry = () => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
    requestCameraPermission(true, () => nav.navigate('카메라'));
  };

  const handlePressRePick = async (direction: string) => {
    const response: ImageType | null = await openPicker(imgPickerOption).catch(
      (err) => {
        // when user cancel picker
        return null;
      },
    );

    let result: TImgFile;
    if (imgFile) {
      result = { ...imgFile };
    } else {
      result = { front: null, back: null };
    }

    if (response) {
      result[direction as keyof TImgFile] = response;
      setImgFile(result);
    }
  };

  const handlePressSearch = async () => {
    if (!!imgFile.front && !!imgFile.back) {
      mergeImages();
    } else {
      Toast.show({
        type: 'errorToast',
        text1: '검색할 알약의 사진을 선택해주세요.',
      });
    }
  };

  const mergeImages = async () => {
    if (viewShotRef.current) {
      viewShotRef.current.capture().then((uri: any) => {
        setSearchImage(uri);
        nav.replace('알약 검색 결과', { data: uri, mode: 1 });
      });
    }
  };

  useEffect(() => {
    nav.addListener('focus', () => handleSetScreen());
    return () => {
      nav.removeListener('focus', () => handleSetScreen());
    };
  }, [handleSetScreen, nav]);

  useEffect(() => {
    downArrowAni();
    noteUpAni();
    noteOpacityAni();
    cleanPicker();
  }, [downArrowAni, noteOpacityAni, noteUpAni]);

  return (
    <Layout.default>
      <ViewShot
        ref={viewShotRef}
        style={{
          position: 'absolute',
          width: 1280,
          height: 640,
          flexDirection: 'row',
          zIndex: -1,
          opacity: 0,
        }}
        options={{ fileName: 'merged', format: 'jpg', quality: 1 }}
      >
        {imgFile?.front && (
          <Image
            src={getImgPath(imgFile.front)}
            style={{ width: '50%', height: '100%' }}
          />
        )}
        {imgFile?.back && (
          <Image
            src={getImgPath(imgFile.back)}
            style={{ width: '50%', height: '100%' }}
          />
        )}
      </ViewShot>
      <View style={styles.viewWrapper}>
        <View style={styles.imgViewWrapper}>
          <View style={styles.cropImgList}>
            <View style={styles.cropImgWrapper}>
              <Text style={styles.labelText}>앞면</Text>
              <Button.scale onPress={() => handlePressRePick('front')}>
                {imgFile?.front ? (
                  <Image
                    src={getImgPath(imgFile.front)}
                    style={styles.cropImg}
                  />
                ) : (
                  <View style={styles.emptyImg}>
                    <Text style={styles.emptyImgText}>
                      알약의 글자가 보이는 사진을 선택해주세요.
                    </Text>
                  </View>
                )}
              </Button.scale>
              <Button.scale onPress={() => handlePressRePick('front')}>
                <View style={styles.pickButtonWrapper}>
                  <ElbumSvg
                    width={20}
                    height={20}
                    color={'#A5A5A5'}
                    preserveAspectRatio="xMinYMax"
                  />
                  <Text style={styles.pickButton}>앨범에서 선택하기</Text>
                </View>
              </Button.scale>
            </View>
            <View style={styles.cropImgWrapper}>
              <Text style={styles.labelText}>뒷면</Text>
              <Button.scale onPress={() => handlePressRePick('back')}>
                {imgFile?.back ? (
                  <Image
                    src={getImgPath(imgFile.back)}
                    style={styles.cropImg}
                  />
                ) : (
                  <View style={styles.emptyImg}>
                    <Text style={styles.emptyImgText}>
                      알약의 반대 면의 사진을 선택해주세요.
                    </Text>
                  </View>
                )}
              </Button.scale>
              <Button.scale onPress={() => handlePressRePick('back')}>
                <View style={styles.pickButtonWrapper}>
                  <ElbumSvg
                    width={20}
                    height={20}
                    color={'#A5A5A5'}
                    preserveAspectRatio="xMinYMax"
                  />
                  <Text style={styles.pickButton}>앨범에서 선택하기</Text>
                </View>
              </Button.scale>
            </View>
          </View>

          <Animated.View
            style={[
              styles.noteTextWrapper,
              {
                opacity: noteOpacityAnimation,
                transform: [{ translateY: noteUpAnimation }],
              },
            ]}
          >
            <Text
              style={styles.noteText}
            >{`위 알약 사진이 제대로 나왔다면,\n아래 검색 버튼을 눌러주세요!`}</Text>
            <Animated.View
              style={{ transform: [{ translateY: downArrowInterpolated }] }}
            >
              <ArrowDownSvg />
              <ArrowDownSvg />
            </Animated.View>
          </Animated.View>
        </View>
        <View style={styles.btnWrapper}>
          <Button.scale onPress={handlePressRetry}>
            <View style={styles.reTryBtn}>
              <CameraSvg
                width={20}
                height={20}
                preserveAspectRatio="xMinYMax"
              />
            </View>
          </Button.scale>
          <Button.scale
            style={styles.searchBtnWrapper}
            onPress={handlePressSearch}
          >
            <View style={styles.searchBtn}>
              <SearchSvg
                width={15}
                height={15}
                strokeWidth={1.5}
                preserveAspectRatio="xMinYMax"
              />
              <Text style={styles.btnText}>알약 검색하기</Text>
            </View>
          </Button.scale>
        </View>
      </View>
    </Layout.default>
  );
};

const styles = StyleSheet.create({
  btnText: {
    color: '#fff',
    fontFamily: os.font(500, 600),
    fontSize: font(15),
    includeFontPadding: false,
    paddingBottom: 2,
    textAlign: 'center',
  },
  btnWrapper: { flexDirection: 'row', gap: 8, height: 54 },
  cropImg: { aspectRatio: '1/1', borderRadius: 10, width: '100%' },
  cropImgList: {
    borderColor: '#000000',
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
    position: 'relative',
    width: '100%',
  },
  cropImgWrapper: { alignItems: 'center', flex: 1, position: 'relative' },
  emptyImg: {
    alignItems: 'center',
    aspectRatio: '1/1',
    backgroundColor: '#efeff7',
    borderRadius: 10,
    justifyContent: 'center',
    padding: 14,
    width: '100%',
  },
  emptyImgText: {
    color: '#a1a1a1',
    fontFamily: os.font(400, 400),
    fontSize: font(14),
    includeFontPadding: false,
    paddingBottom: 0,
    textAlign: 'center',
    width: '100%',
  },
  imgViewWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
  },
  labelText: {
    color: '#000',
    fontFamily: os.font(500, 500),
    fontSize: font(14),
    includeFontPadding: false,
    paddingBottom: 10,
  },
  noteText: {
    color: '#000',
    fontFamily: os.font(500, 500),
    fontSize: font(16),
    includeFontPadding: false,
    paddingBottom: 22,
    textAlign: 'center',
  },
  noteTextWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 60,
  },
  pickButton: {
    color: '#A5A5A5',
    fontFamily: os.font(500, 500),
    fontSize: font(14),
    includeFontPadding: false,
    paddingBottom: 1,
  },
  pickButtonWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  reTryBtn: {
    alignItems: 'center',
    backgroundColor: '#6A6A93',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    height: '100%',
    overflow: 'hidden',
    paddingHorizontal: 32,
  },
  scrollViewWrapper: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
  searchBtn: {
    alignItems: 'center',
    backgroundColor: '#7472EB',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 18,
  },
  searchBtnWrapper: { flex: 1 },
  viewWrapper: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    overflow: 'hidden',
    paddingBottom: 15 + (Platform.OS === 'ios' ? 28 : 0),
    paddingHorizontal: 15,
  },
});

export default SearchCrop;
