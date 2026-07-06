import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../styles/PrevNextPagination';
import { IPrevNextPaginationProps } from '../types/notice_type';

const PrevNextPagination = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: IPrevNextPaginationProps) => {
  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        onPress={onPrevious}
        disabled={currentPage === 0}
        style={[
          styles.paginationButton,
          currentPage === 0 && styles.paginationButtonDisabled,
        ]}
      >
        <BaseText
          size={14}
          weight="semiBold"
          style={[
            styles.paginationButtonText,
            currentPage === 0 && styles.paginationButtonTextDisabled,
          ]}
        >
          이전
        </BaseText>
      </TouchableOpacity>

      <BaseText size={14} weight="semiBold" style={styles.pageIndicator}>
        {currentPage + 1} / {totalPages}
      </BaseText>

      <TouchableOpacity
        onPress={onNext}
        disabled={currentPage === totalPages - 1}
        style={[
          styles.paginationButton,
          currentPage === totalPages - 1 && styles.paginationButtonDisabled,
        ]}
      >
        <BaseText
          size={14}
          weight="semiBold"
          style={[
            styles.paginationButtonText,
            currentPage === totalPages - 1 &&
              styles.paginationButtonTextDisabled,
          ]}
        >
          다음
        </BaseText>
      </TouchableOpacity>
    </View>
  );
};

export default PrevNextPagination;
