import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
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
        <Text
          style={[
            styles.paginationButtonText,
            currentPage === 0 && styles.paginationButtonTextDisabled,
          ]}
        >
          이전
        </Text>
      </TouchableOpacity>

      <Text style={styles.pageIndicator}>
        {currentPage + 1} / {totalPages}
      </Text>

      <TouchableOpacity
        onPress={onNext}
        disabled={currentPage === totalPages - 1}
        style={[
          styles.paginationButton,
          currentPage === totalPages - 1 && styles.paginationButtonDisabled,
        ]}
      >
        <Text
          style={[
            styles.paginationButtonText,
            currentPage === totalPages - 1 &&
              styles.paginationButtonTextDisabled,
          ]}
        >
          다음
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PrevNextPagination;
