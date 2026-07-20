import React, { useEffect } from 'react';
import { Image } from '@components/common/CustomImage';
import { View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Character from '@assets/images/character.png';
import { styles } from '../styles/DatabaseUpdateView.styles';
import { IUpdateProgress } from '../types';
import { BaseText } from '@components/common/BaseText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ANI_DURATION = 500;

const DatabaseUpdateView: React.FC<IUpdateProgress> = ({
  status,
  progress,
  isUpdating = false,
}) => {
  const insets = useSafeAreaInsets();

  const flexValue = useSharedValue(isUpdating ? 1.7 : 1);

  useEffect(() => {
    flexValue.value = withTiming(isUpdating ? 1.7 : 1, {
      duration: ANI_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [isUpdating]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      flex: flexValue.value,
    };
  });
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 로고 영역 */}
      <View style={styles.topContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={Character}
            style={{ width: '38%' }}
            contentFit={'contain'}
          />
        </View>
        <View style={styles.topTitleWrapper}>
          <BaseText
            fontFamily="Jalnan2"
            weight="regular"
            size={21}
            style={styles.topTitle}
          >
            약 이름이 궁금할 땐
          </BaseText>
        </View>
      </View>
      <Animated.View style={[styles.downContainer, animatedStyle]}>
        <BaseText
          fontFamily="Jalnan2"
          weight="regular"
          size={48}
          style={styles.downTitle}
        >
          이게뭐약?
        </BaseText>
        {isUpdating && (
          <>
            {/* 안내 문구 */}
            <Animated.View
              entering={FadeIn.duration(ANI_DURATION)}
              style={styles.noticeContainer}
            >
              <BaseText weight={'medium'} size={16} style={styles.noticeText}>
                {`준비 중입니다.\n약 1분 정도 소요됩니다.\n완료될 때까지 이 화면을 유지해 주세요.`}
              </BaseText>
            </Animated.View>

            {/* 로딩 정보 */}
            <Animated.View
              entering={FadeIn.duration(ANI_DURATION).delay(100)}
              style={styles.infoContainer}
            >
              <BaseText weight={'bold'} size={18} style={styles.statusText}>
                {status}
              </BaseText>

              {/* 프로그레스 바 */}
              <View style={styles.progressBarContainer}>
                <View
                  style={[styles.progressBar, { width: `${progress * 100}%` }]}
                />
              </View>

              {/* 퍼센트 정보 */}
              <View style={styles.detailsContainer}>
                <BaseText weight={'bold'} size={16} style={styles.percentText}>
                  {(progress * 100).toFixed(1)}%
                </BaseText>
              </View>
            </Animated.View>
          </>
        )}
      </Animated.View>
    </View>
  );
};

export default DatabaseUpdateView;
