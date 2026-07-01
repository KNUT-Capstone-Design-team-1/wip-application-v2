import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  BackHandler,
  Platform,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { styles } from '../styles/BottomSheet';
import { useBottomSheet } from '../hooks/use_bottom_sheet';
import { IBottomSheetProps, INoticeData } from '../types/notice_type';
import { formatContents } from '@features/notice/utils/notice';
import { px } from '@utils/responsive';
import { COLOR } from '@constants/color';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const BottomSheet = ({
  data,
  onClose,
  onNeverShowAgain,
}: IBottomSheetProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const isClosing = useRef(false);
  const { moveToDetailContent } = useBottomSheet();

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  useEffect(() => {
    // 모달 열릴 때 위로 슬라이드
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      if (isClosing.current) return true;
      isClosing.current = true;

      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onClose();
      });

      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => subscription.remove();
  }, [onClose, slideAnim]);

  const handleClose = () => {
    if (isClosing.current) return;
    isClosing.current = true;
    // 모달 닫힐 때 아래로 슬라이드
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleNeverShowAgain = () => {
    if (isClosing.current) return;
    isClosing.current = true;
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onNeverShowAgain();
    });
  };

  const renderItem = ({ item }: { item: INoticeData }) => (
    <View
      style={[
        styles.slideItem,
        { width: SCREEN_WIDTH, paddingHorizontal: px(16) },
      ]}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.contents}>{formatContents(item.contents)}</Text>
    </View>
  );

  return (
    <View style={styles.bottomSheetContainer}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.darkBackground} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.navigationContainer}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
        <FlashList
          data={data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          style={styles.flatList}
        />
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => {
            if (isClosing.current) return;
            isClosing.current = true;
            // 애니메이션 시작
            Animated.timing(slideAnim, {
              toValue: SCREEN_HEIGHT,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              // 애니메이션 완료 후 바텀시트 닫기
              onClose();
              // 네비게이션
              moveToDetailContent(data[currentIndex]);
            });
          }}
        >
          <Text style={styles.detailButtonText}>자세히 보기</Text>
        </TouchableOpacity>
        <View style={styles.bottomSheetControl}>
          <TouchableOpacity onPress={handleNeverShowAgain}>
            <Text style={styles.sheetCloseToday}>하루 동안 보지 않기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.sheetCloseButton}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default BottomSheet;
