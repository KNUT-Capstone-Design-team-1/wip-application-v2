import React, { memo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR } from '@constants/color';
import MarkList from './MarkList';
import { IMarkModalContentProps } from '@features/pill_identification_search/types';
import { styles } from '../../styles/molecules/MarkModalContent';

// 마크 모달 내부 결과 리스트 및 로딩/에러/빈화면 컴포넌트
const MarkModalContent = memo(
  ({ loading, error, markDataList, onSelect }: IMarkModalContentProps) => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <BaseText style={styles.errorText} size={13} weight="bold">
            {error}
          </BaseText>
        </View>
      );
    }

    return (
      <View style={styles.markListContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLOR['primary']} />
            <BaseText style={styles.loadingText} size={16} weight="bold">
              검색 중...
            </BaseText>
          </View>
        ) : markDataList.length === 0 ? (
          <View style={styles.emptyState}>
            <BaseText style={styles.emptyText} size={16} weight="bold">
              검색어를 입력하여 마크를 검색해주세요
            </BaseText>
          </View>
        ) : (
          <MarkList data={markDataList} onSelect={onSelect} />
        )}
      </View>
    );
  },
);

MarkModalContent.displayName = 'MarkModalContent';

export default MarkModalContent;
