import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { COLOR_TEXT, COLOR } from '@constants/color';
import { px } from '@utils/responsive';
import { BaseText } from '@components/common/BaseText';
import { useDatabaseVersions } from '../hooks/useDatabaseVersions';
import { VersionItem } from './VersionItem';

// 전체 데이터베이스 목록과 각각의 버전 정보를 렌더링하는 컴포넌트
export const DatabaseVersionSection = () => {
  const { versions, isLoading } = useDatabaseVersions();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLOR.primary} />
      </View>
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <View style={styles.section}>
        <BaseText weight="bold" size={18} style={styles.sectionTitle}>
          데이터 버전
        </BaseText>
        <View style={styles.emptyContainer}>
          <BaseText weight="regular" size={14} style={styles.emptyText}>
            버전 정보를 불러올 수 없습니다.
          </BaseText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <BaseText weight="bold" size={18} style={styles.sectionTitle}>
        데이터 버전
      </BaseText>
      <View>
        {versions.map((info) => (
          <VersionItem
            key={info.table}
            label={info.label}
            value={`s${info.schemaVersion}-v${info.dataVersion}`}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: px(10),
  },
  sectionTitle: {
    color: COLOR_TEXT['title'],
    marginBottom: px(8),
  },
  loadingContainer: {
    paddingVertical: px(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: px(20),
    alignItems: 'center',
  },
  emptyText: {
    color: COLOR_TEXT['disabled'],
  },
});
