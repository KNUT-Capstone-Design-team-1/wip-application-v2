import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { INoticeData } from '@/types/TNoticeType';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { useNoticeStore } from '@store/noticeStore';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface BottomSheetProps {
  data: INoticeData[];
  onClose: () => void;
  onNeverShowAgain: () => void;
}

const BottomSheet = ({ data, onClose, onNeverShowAgain }: BottomSheetProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const flatListRef = useRef<FlatList>(null);
  const { moveToDetailContent } = useBottomSheet();
  const isNoticeLoading = useNoticeStore((state) => state.isNoticeLoading);

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

  const handleClose = () => {
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
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onNeverShowAgain();
    });
  };

  // base64 이미지 제거 및 텍스트 길이 제한 함수
  const formatContents = (contents: string) => {
    // base64 이미지 패턴 제거 (data:image/... 형태)
    const textWithoutBase64 = contents.replace(
      /data:image\/[^;]+;base64,[^\s"]*/g,
      '',
    );

    // 100글자 넘으면 ... 처리
    if (textWithoutBase64.length > 20) {
      return textWithoutBase64.substring(0, 100) + '...';
    }
    return textWithoutBase64;
  };

  const renderItem = ({ item }: { item: INoticeData }) => (
    <View style={styles.slideItem}>
      <View style={styles.bottomSheetContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.contents}>{formatContents(item.contents)}</Text>
      </View>
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
        {isNoticeLoading ? (
          // 로딩 중일 때
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          // 데이터 로딩 완료
          <>
            <View style={styles.navigationContainer}>
              {data.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>
            <FlatList
              ref={flatListRef}
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
          </>
        )}
        <View style={styles.bottomSheetControl}>
          <TouchableOpacity onPress={handleNeverShowAgain}>
            <Text style={styles.sheetCloseToday}>하루 동안 보지 않기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClose}>
            <Text>닫기</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  darkBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    opacity: 0.5,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    width: '100%',
    height: '42%',
    backgroundColor: '#5453c8',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  flatList: {
    flex: 1,
  },
  slideItem: {
    width: SCREEN_WIDTH,
    justifyContent: 'flex-start',
  },
  bottomSheetContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 16,
    gap: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 24,
  },
  bottomSheetControl: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    color: '#444',
  },
  sheetCloseToday: {
    color: 'grey',
  },
  title: {
    fontSize: 18,
    color: '#fff',
  },
  contents: {
    fontSize: 12,
    color: '#e3e3e3',
  },
  detailButton: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 10,
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingBottom: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
});

export default BottomSheet;
