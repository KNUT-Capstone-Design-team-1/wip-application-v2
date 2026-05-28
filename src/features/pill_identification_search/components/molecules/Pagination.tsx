import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/molecules/Pagination';
import { IPaginationProps } from '@features/pill_identification_search/types/search_id_types';
import { PAGE_GROUP_SIZE } from '@features/pill_identification_search/constants/identificationSearch';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { COLOR_PRIMARY } from '@constants/color';

const Pagination = ({
  totalPages,
  page,
  setPage,
  currentGroup,
  setCurrentGroup,
}: IPaginationProps) => {
  // 페이지네이션 버튼 렌더링
  const renderPageButtons = () => {
    const startPage = currentGroup * PAGE_GROUP_SIZE + 1;
    const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);

    const buttons = [];

    // 이전 버튼 (<)
    buttons.push(
      <TouchableOpacity
        key="prev"
        style={[styles.pageNavButton, currentGroup <= 0 && { opacity: 0 }]}
        onPress={() => {
          setCurrentGroup(currentGroup - 1);
        }}
        disabled={currentGroup <= 0}
      >
        <ChevronLeft size={16} color={COLOR_PRIMARY[400]} strokeWidth={2} />
      </TouchableOpacity>,
    );

    // 페이지 버튼들 (1, 2, 3, 4, 5)
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          style={[styles.pageButton, i === page && styles.pageButtonActive]}
          onPress={() => setPage(i)}
        >
          <Text
            style={
              i === page ? styles.pageButtonTextActive : styles.pageButtonText
            }
          >
            {i}
          </Text>
        </TouchableOpacity>,
      );
    }

    // 다음 버튼 (>)
    buttons.push(
      <TouchableOpacity
        key="next"
        style={[styles.pageNavButton, endPage >= totalPages && { opacity: 0 }]}
        onPress={() => {
          setCurrentGroup(currentGroup + 1);
        }}
        disabled={endPage >= totalPages}
      >
        <ChevronRight size={16} color={COLOR_PRIMARY[400]} strokeWidth={2} />
      </TouchableOpacity>,
    );

    return buttons;
  };

  if (totalPages <= 1) {
    return null; // 페이지가 1개 이하면 표시 안 함
  }

  return (
    <View style={styles.paginationContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        {renderPageButtons()}
      </ScrollView>
    </View>
  );
};

export default Pagination;
