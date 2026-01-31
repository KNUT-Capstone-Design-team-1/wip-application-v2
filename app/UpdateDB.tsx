import React from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import SplashIcon from '../assets/icons/splash-icon.png';


interface UpdateDBProps {
  status: string;
  progress: number;
  currentPage?: number;
  totalPages?: number;
}

const UpdateDB: React.FC<UpdateDBProps> = ({
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
          style={{
            width: '100%',
          }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 500,
    color: '#32D2FF',
    marginBottom: 20,
  },
  progressBarContainer: {
    width: 250,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#32D2FF',
    borderRadius: 5,
  },
  detailsContainer: {
    alignItems: 'center',
  },
  percentText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  pageText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  spinner: {
    marginVertical: 30,
  },
});

export default UpdateDB;
