import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import * as Application from 'expo-application';
import { COLOR_TEXT, COLOR, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';
import { BaseText } from '@components/common/BaseText';
import { useDatabaseVersions } from '../hooks/useDatabaseVersions';
import { VersionItem } from './VersionItem';

// 앱 및 데이터베이스 버전 정보를 렌더링하는 컴포넌트
export const VersionList = () => {
  const { versions, isLoading } = useDatabaseVersions();

  const renderDatabaseVersions = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLOR.primary} />
        </View>
      );
    }

    if (!versions || versions.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <BaseText weight="regular" size={14} style={styles.emptyText}>
            버전 정보를 불러올 수 없습니다.
          </BaseText>
        </View>
      );
    }

    return (
      <>
        {versions.map((info, index) => (
          <React.Fragment key={info.table}>
            <VersionItem
              label={`${info.label} 버전`}
              value={`s${info.schemaVersion}-d${info.dataVersion}`}
            />
            {index < versions.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <View>
      <VersionItem
        label="현재 앱 버전"
        value={`v${Application.nativeApplicationVersion}`}
      />
      {versions && versions.length > 0 && <View style={styles.separator} />}
      {renderDatabaseVersions()}
    </View>
  );
};

const styles = StyleSheet.create({
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
  separator: {
    height: 1,
    backgroundColor: COLOR_LINE['border'],
    marginHorizontal: px(8),
  },
});
