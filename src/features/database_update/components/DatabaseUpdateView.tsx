import React from 'react';
import { View, Image, Text, ActivityIndicator } from 'react-native';
import SplashIcon from '@assets/icons/splash-icon.png';
import { styles } from '../styles/DatabaseUpdateView.styles';
import { IUpdateProgress } from '../types';

const DatabaseUpdateView: React.FC<IUpdateProgress> = ({
  status,
  progress,
  currentPage,
  totalPages,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 로고 영역 */}
        <Image
          source={SplashIcon}
          style={{ width: '100%' }}
          resizeMode={'contain'}
        />

        {/* 스피너 */}
        {progress === 0 && (
          <ActivityIndicator
            size="large"
            color="#7472EB"
            style={styles.spinner}
          />
        )}

        {/* 로딩 정보 */}
        <View style={styles.infoContainer}>
          <Text style={styles.statusText}>{status}</Text>

          {/* 프로그레스 바 */}
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${progress * 100}%` }]}
            />
          </View>

          {/* 퍼센트 및 페이지 정보 */}
          <View style={styles.detailsContainer}>
            <Text style={styles.percentText}>
              {(progress * 100).toFixed(1)}%
            </Text>
            {currentPage && totalPages && (
              <Text style={styles.pageText}>
                {currentPage} / {totalPages} 페이지
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default DatabaseUpdateView;
