import { IModalPageNationProps } from '@/types/molecules.type';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const PAGE_GROUP_SIZE = 5; // 한 번에 보여줄 페이지 버튼 개수

const ModalPageNation = ({
  totalPages,
  page,
  setPage,
  currentGroup,
  setCurrentGroup,
}: IModalPageNationProps) => {
  // 페이지네이션 버튼 (7개씩 그룹화)
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
        </TouchableOpacity>,
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
        </TouchableOpacity>,
      );
    }

    return buttons;
  };

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

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  pageNavButton: {
    borderWidth: 1,
    borderColor: '#888',
    fontSize: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginHorizontal: 5,
    backgroundColor: '#eee',
  },
  pageNavText: {
    color: '#333',
    fontWeight: '600',
  },
  pageButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 3,
    backgroundColor: '#fff',
  },
  pageButtonActive: {
    backgroundColor: '#6563ed',
    borderColor: '#6563ed',
  },
  pageButtonText: {
    color: '#555',
    fontWeight: '600',
  },
  pageButtonTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default ModalPageNation;
