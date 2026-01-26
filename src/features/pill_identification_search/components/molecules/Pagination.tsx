import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../../styles/molecules/Pagination';

interface IPaginationProps {
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
  currentGroup: number;
  setCurrentGroup: (group: number | ((prev: number) => number)) => void;
}

const PAGE_GROUP_SIZE = 5; // 한 번에 보여줄 페이지 버튼 개수

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

    // 이전 버튼
    if (currentGroup > 0) {
      buttons.push(
        <TouchableOpacity
          key="prev"
          style={styles.pageNavButton}
          onPress={() => {
            setCurrentGroup((prev: number) => prev - 1);
            setPage((currentGroup - 1) * PAGE_GROUP_SIZE + 1);
          }}
        >
          <Text style={styles.pageNavText}>←</Text>
        </TouchableOpacity>,
      );
    }

    // 페이지 버튼들
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
        </TouchableOpacity>
      );
    }

    // 다음 버튼
    if (endPage < totalPages) {
      buttons.push(
        <TouchableOpacity
          key="next"
          style={styles.pageNavButton}
          onPress={() => {
            setCurrentGroup((prev: number) => prev + 1);
            setPage((currentGroup + 1) * PAGE_GROUP_SIZE + 1);
          }}
        >
          <Text style={styles.pageNavText}>→</Text>
        </TouchableOpacity>
      );
    }

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
