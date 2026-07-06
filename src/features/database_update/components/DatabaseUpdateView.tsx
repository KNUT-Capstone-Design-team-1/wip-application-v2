import React from 'react';
import { Image } from '@components/common/CustomImage';
import { View, Text } from 'react-native';
import SplashIcon from '@assets/icons/splash-icon.png';
import { styles } from '../styles/DatabaseUpdateView.styles';
import { IUpdateProgress } from '../types';
import { BaseText } from '@components/common/BaseText';

const DatabaseUpdateView: React.FC<IUpdateProgress> = ({
  status,
  progress,
  isUpdating,
}) => {
  return (
    <View style={styles.container}>
      {/* 로고 영역 */}
      <View style={styles.logoContainer}>
        <Image
          source={SplashIcon}
          style={{ height: '100%', width: '100%' }}
          contentFit={'contain'}
        />
      </View>

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
  );
};

export default DatabaseUpdateView;
