import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  FlatList,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Button from '@/components/atoms/Button';
import Layout from '@/components/organisms/Layout';
import NoteSvg from '@assets/svgs/note.svg';
import { font, os } from '@/style/font';
import CameraSvg from '@assets/svgs/camera.svg';
import { requestCameraPermission } from '@/utils/permission';
import { useNavigation } from '@react-navigation/native';
import { shootingGuideData } from '@/constants/guide';
import ElbumSvg from '@assets/svgs/elbum.svg';
import { useScreenStore } from '@/store/screen';
import { useImgFileStore } from '@/store/imgFileStore';

const { width } = Dimensions.get('window');

const ShootingGuide = () => {
  const nav: any = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const setScreen = useScreenStore((state) => state.setScreen);
  const setImgFile = useImgFileStore((state) => state.setImgFile);
  const [isAnimating, setIsAnimating] = useState(false);
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 10,
  }).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      onSlideChange(viewableItems[0].index);
    }
  }).current;

  const onSlideChange = (index: number) => {
    if (isAnimating) return;

    setIsAnimating(true);

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(index);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);
      });
    });
  };

  const permissionCheck = () => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
    requestCameraPermission(true, () => nav.navigate('카메라'));
  };

  const handlePressImgPicker = () => {
    setImgFile({ front: null, back: null });
    nav.navigate('알약 촬영');
  };

  const handleSetScreen = () => {
    setScreen('촬영 가이드');
  };

  useEffect(() => {
    handleSetScreen();
  }, []);

  return (
    <Layout.default>
      {/* 타이틀*/}
      <View style={styles.shootingGuideWrapper}>
        <View style={styles.noteHeadWrapper}>
          <NoteSvg width={18} height={18} />
          <Text style={styles.noteHead}>
            알약 사진을 찍을 때는 이렇게 찍어주세요!
          </Text>
        </View>

        {/* 슬라이드 구현 */}
        <FlatList
          data={shootingGuideData}
          horizontal
          pagingEnabled
          style={{ height: 500 }}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.slideImageWrapper}>
              <Image
                source={item.mainImage}
                resizeMode="contain"
                style={styles.slideImg}
              />
              <Image
                source={item.subImage}
                resizeMode="contain"
                style={[
                  styles.slideImg, // 태그로 지정한 스타일
                  { top: -30 }, // 인라인 스타일 추가
                ]}
              />
            </View>
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          showsHorizontalScrollIndicator={false}
        />

        {/* Animated을 사용해서 텍스트 자연스럽게 변하도록 수정 */}
        <Animated.View
          style={[styles.ShootingGuideBottom, { opacity: fadeAnim }]}
        >
          <Text style={styles.mainDescription}>
            {shootingGuideData[currentIndex].title}
          </Text>
          <Text style={styles.subDescription}>
            {shootingGuideData[currentIndex].description}
          </Text>
        </Animated.View>

        <Button.scale
          onPress={() => {
            permissionCheck();
          }}
        >
          <View style={styles.button}>
            <CameraSvg width={18} height={18} />
            <Text style={styles.buttonText}>촬영하기</Text>
          </View>
        </Button.scale>
        <Button.scale onPress={handlePressImgPicker}>
          <View style={styles.albumSelect}>
            <ElbumSvg width={18} height={18} color={'#fff'} />
            <Text style={styles.buttonText}>앨범에서 선택</Text>
          </View>
        </Button.scale>

        <View style={styles.indicatorContainer}>
          {shootingGuideData.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>
    </Layout.default>
  );
};

const styles = StyleSheet.create({
  shootingGuideWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    top: -5,
    width: Dimensions.get('window').width,
  },

  // header
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

  // slide image
  slideImageWrapper: {
    alignItems: 'center',
    height: '100%',
    marginTop: 10,
    width: width,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    backgroundColor: '#ccc',
    borderRadius: 4,
    height: 8,
    marginHorizontal: 4,
    width: 8,
  },
  activeDot: { backgroundColor: '#7472EB' },

  slideImg: {
    width: width * 0.5,
    height: '50%', // 높이 자동 계산
    aspectRatio: 1, // 정사각형
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  // 하단 텍스트
  ShootingGuideBottom: {
    alignItems: 'center',
    fontFamily: os.font(500, 500),
    gap: 10,
    height: '10%',
    justifyContent: 'center',
    position: 'relative',
    top: -30,
  },
  mainDescription: {
    color: '#333',
    fontFamily: os.font(500, 500),
    fontSize: font(16),
    fontWeight: '700',
    textAlign: 'center',
  },
  subDescription: {
    color: '#656565',
    fontFamily: os.font(500, 500),
    fontSize: font(14),
    fontWeight: '700',
    textAlign: 'center',
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#7472EB',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    height: 40,
    justifyContent: 'center',
    top: -10,
    width: 300,
  },
  buttonText: {
    color: '#fff',
    fontFamily: os.font(500, 500),
    fontSize: font(15),
    includeFontPadding: false,
    textAlign: 'center',
  },

  albumSelect: {
    alignItems: 'center',
    backgroundColor: '#95937E',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    height: 40,
    justifyContent: 'center',
    width: 300,
  },
});

export default ShootingGuide;
