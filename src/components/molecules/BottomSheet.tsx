import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { INoticeData } from '@/types/TNoticeType';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  data: INoticeData[];
  onClose: () => void;
  onNeverShowAgain: () => void;
}

const BottomSheet = ({ data, onClose, onNeverShowAgain }: BottomSheetProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    // 모달 열릴 때 위로 슬라이드
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, []);

  if (!data || data.length === 0) return null;

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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  const currentNotice = data[currentIndex];

  return (
    <View style={styles.bottomSheetContainer}>
      <View style={styles.darkBackground} />
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.bottomSheetContent}>
          <View style={styles.navigationContainer}>
            <TouchableOpacity onPress={handlePrev} style={styles.navButton}>
              <Text style={styles.navButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.pageIndicator}>
              {currentIndex + 1} / {data.length}
            </Text>
            <TouchableOpacity onPress={handleNext} style={styles.navButton}>
              <Text style={styles.navButtonText}>→</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{currentNotice.title}</Text>
          <Text style={styles.contents}>{currentNotice.contents}</Text>
          <Text style={styles.detailButton}>자세히 보기</Text>
        </View>
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
    height: '45%',
    backgroundColor: '#5451d1',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  bottomSheetContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 16,
    gap: 10,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#fff',
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
    width: 70,
    marginTop: 20,
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingBottom: 3,
  },
});

export default BottomSheet;
