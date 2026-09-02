import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  BackHandler,
  Platform,
  StyleProp,
  ViewStyle,
  Easing,
  useWindowDimensions,
  StyleSheet,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles/BaseBottomSheet';
import { px } from '@utils/responsive';

export interface IBaseBottomSheetProps {
  /** 바텀시트 표시 여부 */
  visible: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 바텀시트 내부 컨텐츠 */
  children?: React.ReactNode;
  /** 백드롭 커스텀 스타일 */
  backdropStyle?: StyleProp<ViewStyle>;
  /** 바텀시트 메인 뷰 컨테이너 커스텀 스타일 */
  containerStyle?: StyleProp<ViewStyle>;
  /** 애니메이션 지속 시간 (ms, 기본값: 300) */
  animationDuration?: number;
  /** 백드롭 터치 시 닫기 여부 (기본값: true) */
  closeOnBackdropPress?: boolean;
  /** 안드로이드 하드웨어 뒤로가기 키 입력 시 닫기 여부 (기본값: true) */
  closeOnBackHandler?: boolean;
  /** 아래로 드래그하여 닫기 제스처 활성화 여부 (기본값: true) */
  enablePanDownToClose?: boolean;
  /** 드래그 제스처 적용 대상 ('handle': 상단 핸들바에만 적용, 'sheet': 시트 전체에 적용, 기본값: 'handle') */
  panGestureTarget?: 'handle' | 'sheet';
  /** 상단 드래그 핸들 바(그랩바) 표시 여부 (기본값: true) */
  showDragHandle?: boolean;
  /** 드래그 핸들 바 커스텀 스타일 */
  dragHandleStyle?: StyleProp<ViewStyle>;
  /** Safe Area Insets 하단 패딩 자동 적용 여부 (기본값: true) */
  enableSafeArea?: boolean;
  /** Edge-to-edge 환경에서 Status Bar를 가리지 않도록 상단 Safe Area 및 최대 높이 자동 제한 여부 (기본값: true) */
  enableTopSafeArea?: boolean;
  /** 바텀시트 최대 높이 (기본값: screenHeight - insets.top) */
  maxHeight?: ViewStyle['maxHeight'];
  /** 상단 여백 오프셋 (기본값: 0) */
  topOffset?: number;
  /** 열림 애니메이션 완료 콜백 */
  onOpenComplete?: () => void;
  /** 닫힘 애니메이션 완료 콜백 */
  onCloseComplete?: () => void;
}

/**
 * 범용 바텀시트 컴포넌트
 * - Fade in/out 애니메이션이 적용된 BackDrop (터치 시 닫힘 및 Android BackHandler 지원)
 * - Slide in/out 애니메이션이 적용된 Bottom Sheet 메인 뷰 영역
 * - 상단 핸들 바 드래그 제스처(Pan Gesture)로 닫기 지원 (내부 컨텐츠 스크롤 간섭 없음)
 * - Edge-to-Edge 환경에서 Status Bar 보호 및 Safe Area 대응
 */
export const BaseBottomSheet: React.FC<IBaseBottomSheetProps> = ({
  visible,
  onClose,
  children,
  backdropStyle,
  containerStyle,
  animationDuration = 300,
  closeOnBackdropPress = true,
  closeOnBackHandler = true,
  enablePanDownToClose = true,
  panGestureTarget = 'handle',
  showDragHandle = true,
  dragHandleStyle,
  enableSafeArea = true,
  enableTopSafeArea = true,
  maxHeight,
  topOffset = 0,
  onOpenComplete,
  onCloseComplete,
}) => {
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [isRendered, setIsRendered] = useState(visible);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const isClosingRef = useRef(false);

  // Status Bar를 가리지 않도록 상단 안전 영역 마진 및 최대 높이 계산
  const topSafetyMargin = (enableTopSafeArea ? insets.top : 0) + topOffset;
  const defaultMaxHeight = screenHeight - topSafetyMargin;
  const resolvedMaxHeight = maxHeight ?? defaultMaxHeight;

  // 닫기 애니메이션 실행 및 콜백 호출
  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: animationDuration,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: animationDuration,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setIsRendered(false);
        isClosingRef.current = false;
        onClose();
        onCloseComplete?.();
      }
    });
  }, [
    animationDuration,
    fadeAnim,
    onClose,
    onCloseComplete,
    screenHeight,
    slideAnim,
  ]);

  const handleCloseRef = useRef(handleClose);
  handleCloseRef.current = handleClose;
  const enablePanRef = useRef(enablePanDownToClose);
  enablePanRef.current = enablePanDownToClose;
  const panTargetRef = useRef(panGestureTarget);
  panTargetRef.current = panGestureTarget;

  // 아래로 드래그하여 닫는 제스처 리스너
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        if (!enablePanRef.current || isClosingRef.current) return false;
        // 핸들 바 타겟일 때는 터치 즉시 제스처 응답
        return panTargetRef.current === 'handle';
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (!enablePanRef.current || isClosingRef.current) return false;
        return (
          gestureState.dy > 4 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        );
      },
      onPanResponderGrant: () => {
        slideAnim.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
          // 드래그 거리에 비례하여 백드롭 투명도 감쇠
          const progress = Math.max(
            0,
            Math.min(1, 1 - gestureState.dy / (screenHeight * 0.4)),
          );
          fadeAnim.setValue(progress);
        } else {
          // 위로 드래그 시 고무줄 저항감 부여
          slideAnim.setValue(gestureState.dy * 0.15);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldClose =
          gestureState.dy > 100 ||
          (gestureState.dy > 30 && gestureState.vy > 0.5);

        if (shouldClose) {
          handleCloseRef.current();
        } else {
          // 닫기 임계값을 넘지 못한 경우 원래 위치로 복귀
          Animated.parallel([
            Animated.spring(slideAnim, {
              toValue: 0,
              useNativeDriver: true,
              bounciness: 4,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  // 열기 애니메이션 실행
  const handleOpen = useCallback(() => {
    isClosingRef.current = false;
    fadeAnim.setValue(0);
    slideAnim.setValue(screenHeight);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onOpenComplete?.();
      }
    });
  }, [animationDuration, fadeAnim, onOpenComplete, screenHeight, slideAnim]);

  // visible prop 변화 감지하여 열기/닫기 애니메이션 실행
  useEffect(() => {
    if (visible) {
      setIsRendered(true);
      handleOpen();
    } else if (isRendered && !isClosingRef.current) {
      handleClose();
    }
  }, [visible, isRendered, handleOpen, handleClose]);

  // 안드로이드 하드웨어 뒤로가기 버튼 처리
  useEffect(() => {
    if (Platform.OS !== 'android' || !isRendered || !closeOnBackHandler) return;

    const onBackPress = () => {
      handleClose();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => subscription.remove();
  }, [isRendered, closeOnBackHandler, handleClose]);

  if (!isRendered) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      {/* BackDrop (fade animation) */}
      <Animated.View
        style={[
          styles.backdrop,
          backdropStyle,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableWithoutFeedback
          onPress={closeOnBackdropPress ? handleClose : undefined}
        >
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Main View Sheet */}
      <Animated.View
        {...(enablePanDownToClose && panGestureTarget === 'sheet'
          ? panResponder.panHandlers
          : {})}
        style={[
          styles.sheetContainer,
          {
            maxHeight: resolvedMaxHeight,
          },
          enableSafeArea && {
            paddingBottom: Math.max(insets.bottom, px(16)),
          },
          containerStyle,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* 상단 드래그 핸들 바 (핸들바 전용 제스처 리스너 연결) */}
        {showDragHandle && (
          <View
            {...(enablePanDownToClose && panGestureTarget === 'handle'
              ? panResponder.panHandlers
              : {})}
            style={styles.grabberContainer}
          >
            <View style={[styles.grabber, dragHandleStyle]} />
          </View>
        )}
        {children}
      </Animated.View>
    </View>
  );
};

export default BaseBottomSheet;
