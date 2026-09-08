import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheetItem from './BottomSheetItem';
import BottomSheetPagination from './BottomSheetPagination';
import BottomSheetControl from './BottomSheetControl';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const BottomSheet = ({
  data,
  onClose,
  onNeverShowAgain,
}: IBottomSheetProps) => {
  const insets = useSafeAreaInsets();
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

  const handlePressDetail = useCallback(
    (item: INoticeData) => {
      if (isClosing.current) return;
      isClosing.current = true;

      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onClose();
        moveToDetailContent(item);
      });
    },
    [moveToDetailContent, onClose, slideAnim],
  );

  const renderItem = useCallback(
    ({ item }: { item: INoticeData }) => (
      <BottomSheetItem item={item} onPressDetail={handlePressDetail} />
    ),
    [handlePressDetail],
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
        <BottomSheetPagination
          totalCount={data.length}
          currentIndex={currentIndex}
        />
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
        <BottomSheetControl
          bottomInset={insets.bottom}
          onNeverShowAgain={handleNeverShowAgain}
          onClose={handleClose}
        />
      </Animated.View>
    </View>
  );
};

export default BottomSheet;
