import React, { useEffect, useRef } from 'react';
import { Image } from '@components/common/CustomImage';
import { View, Animated, Dimensions } from 'react-native';
import SplashIcon from '@assets/icons/splash-icon-no-title.png';
import { styles } from '../styles/DatabaseUpdateView.styles';
import { IUpdateProgress } from '../types';
import { BaseText } from '@components/common/BaseText';
import { COLOR } from '@constants/color';
import { px } from '@utils/responsive';

const DatabaseUpdateView: React.FC<IUpdateProgress> = ({
  status,
  progress,
  isUpdating,
}) => {
  // 스마트폰 너비 기준 특정 비율이 대략 화면 높이의 일정 비율에 해당함을 감안하여 패딩 설정
  const paddingTopAnim = useRef(
    new Animated.Value(isUpdating ? 14 : 32),
  ).current;

  useEffect(() => {
    Animated.timing(paddingTopAnim, {
      toValue: isUpdating ? 14 : 32,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isUpdating, paddingTopAnim]);

  const { height: SCREEN_HEIGHT } = Dimensions.get('window');

  const animatedPaddingTop = paddingTopAnim.interpolate({
    inputRange: [14, 32],
    outputRange: [SCREEN_HEIGHT * 0.14, SCREEN_HEIGHT * 0.32],
  });

  return (
    <Animated.View
      style={[styles.container, { paddingTop: animatedPaddingTop }]}
    >
      {/* 로고 영역 */}
      <View style={styles.logoContainer}>
        <Image
          source={SplashIcon}
          style={{ height: '100%', width: '100%' }}
          contentFit={'contain'}
        />
      </View>
      <View
        style={{
          flex: 6,
          alignItems: 'center',
          backgroundColor: COLOR['primary'],
          paddingTop: px(8),
        }}
      >
        <BaseText
          fontFamily="Jalnan2"
          weight="regular"
          size={48}
          style={{ color: 'white' }}
        >
          이게뭐약?
        </BaseText>
        {isUpdating && (
          <>
            {/* 안내 문구 */}
            <View style={styles.noticeContainer}>
              <BaseText weight={'medium'} size={16} style={styles.noticeText}>
                {`준비 중입니다.\n약 1분 정도 소요됩니다.\n완료될 때까지 이 화면을 유지해 주세요.`}
              </BaseText>
            </View>

            {/* 로딩 정보 */}
            <View style={styles.infoContainer}>
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
            </View>
          </>
        )}
      </View>
    </Animated.View>
  );
};

export default DatabaseUpdateView;
