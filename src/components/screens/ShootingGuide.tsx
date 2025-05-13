import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, Dimensions, FlatList, Image, Animated } from "react-native";
import Layout from "@/components/organisms/Layout";
import NoteSvg from "@assets/svgs/note.svg";
import { font, os } from "@/style/font.ts";

const shootingGuideData= [
  {
    title: '네모칸 안에 알약이 보이도록 촬영해주세요',
    description: '알약이 잘리면 정확한 결과가 안나올 수 있어요',
    mainImage: require('@/assets/images/search_step1_main.png'),
    subImage: require('@/assets/images/search_step1_sub.png') },
  {
    title: '알약에 글자가 선명히 보이도록 촬영해주세요',
    description: '알약의 글자가 잘리거나 흐리게 촬영하면 정확한 결과가 안나올 수 있어요',
    mainImage: require('@/assets/images/search_step2_main.png'),
    subImage: require('@/assets/images/search_step2_sub.png')
  },
  {
    title: '여러 알약을 촬영 시 겹치지 않게 해주세요',
    description: '붙어있거나 겹쳐있으면 정확한 결과가 안나올 수 있어요',
    mainImage: require('@assets/images/search_step3_main.png'),
    subImage: require('@/assets/images/search_step3_sub.png') },
];

const { width } = Dimensions.get('window');

const ShootingGuide = () => {
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
          <Text style={styles.subDescription}>{shootingGuideData[currentIndex].description}</Text>
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
    backgroundColor: '#000',
  },

  // 하단 텍스트
  ShootingGuideBottom: {
    position: "relative",
    alignItems: "center",
    gap: 10,
    // top: -10
  },
  mainDescription: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: font(16)
  },
  subDescription: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: font(14),
    color: "#656565"
  },
})

export default ShootingGuide;
