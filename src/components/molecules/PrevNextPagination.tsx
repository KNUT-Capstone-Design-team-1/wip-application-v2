import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { IPrevNextPaginationProps } from '@/types/molecules.type';

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
            currentPage === totalPages - 1 && styles.paginationButtonTextDisabled,
          ]}
        >
          다음
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  paginationButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#5451d1',
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  paginationButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  paginationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  paginationButtonTextDisabled: {
    color: '#888888',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
});

export default PrevNextPagination;
