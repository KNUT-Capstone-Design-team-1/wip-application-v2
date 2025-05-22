import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Platform, FlatList, Image, Animated, Button, TouchableOpacity } from "react-native";
import Layout from "@/components/organisms/Layout";
import NoteSvg from "@assets/svgs/note.svg";
import { font, os } from "@/style/font.ts";
import CameraSvg from "@assets/svgs/camera.svg";
import { requestCameraPermission } from "@/utils/permission";
import { useNavigation } from "@react-navigation/native";
import { shootingGuideData } from "@/constants/guide";

const { width } = Dimensions.get('window');

const ShootingGuide = () => {
  const nav: any = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 10 }).current;
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
    if (Platform.OS !== "ios" && Platform.OS !== "android") return;
    requestCameraPermission(true, () => nav.navigate('카메라'));
  }

  return (
    <Layout.default>
      {/* 타이틀*/}
      <View style={styles.ShootingGuideWrapper}>
        <View style={styles.noteHeadWrapper}>
          <NoteSvg width={18} height={18} />
          <Text style={styles.noteHead}>알약 사진을 찍을 때는 이렇게 찍어주세요!</Text>
        </View>

        {/* 슬라이드 구현 */}
        <FlatList
          data={shootingGuideData}
          horizontal
          pagingEnabled
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.slideImageWrapper}>
              <Image source={item.mainImage} resizeMode="cover" />
              <Image source={item.subImage} resizeMode="cover" />
            </View>
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          showsHorizontalScrollIndicator={false}
        />

        {/* Animated을 사용해서 텍스트 자연스럽게 변하도록 수정 */}
        <Animated.View style={[styles.ShootingGuideBottom, { opacity: fadeAnim }]}>
          <Text style={styles.mainDescription}>{shootingGuideData[currentIndex].title}</Text>
          {
            currentIndex === 2
              ?
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  permissionCheck();
                }}
              >
                <CameraSvg width={18} height={18} />
                <Text style={styles.buttonText}>촬영하기</Text>
              </TouchableOpacity>
              : <Text style={styles.subDescription}>{shootingGuideData[currentIndex].description}</Text>
          }
        </Animated.View>

        <View style={styles.indicatorContainer}>
          {shootingGuideData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </View>
    </Layout.default>
  );
};

const styles = StyleSheet.create({
  ShootingGuideWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    top: -5
  },

  // header
  noteHead: {
    paddingBottom: 2,
    color: '#000',
    fontSize: font(14),
    fontFamily: os.font(600, 700),
    includeFontPadding: false,
  },
  noteHeadWrapper: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  // slide image
  slideImageWrapper: {
    alignItems: "center",
    width: width,
    marginTop: 10
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#7472EB',
  },

  // 하단 텍스트
  ShootingGuideBottom: {
    position: "relative",
    alignItems: "center",
    gap: 10,
    fontFamily: os.font(500, 500),
  },
  mainDescription: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: font(16),
    fontFamily: os.font(500, 500),
  },
  subDescription: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: font(14),
    color: "#656565",
    fontFamily: os.font(500, 500),
  },

  button: {
    width: 300,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#7472EB',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: font(15),
    fontFamily: os.font(500, 500),
    includeFontPadding: false,
  },
})

export default ShootingGuide;
