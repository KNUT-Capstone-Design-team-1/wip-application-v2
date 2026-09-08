import React, { memo } from 'react';
import { View } from 'react-native';
import { styles } from '../styles/BottomSheet';

interface IBottomSheetPaginationProps {
  totalCount: number;
  currentIndex: number;
}

const BottomSheetPagination = ({
  totalCount,
  currentIndex,
}: IBottomSheetPaginationProps) => {
  return (
    <View style={styles.navigationContainer}>
      {Array.from({ length: totalCount }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, currentIndex === index && styles.activeDot]}
        />
      ))}
    </View>
  );
};

export default memo(BottomSheetPagination);
