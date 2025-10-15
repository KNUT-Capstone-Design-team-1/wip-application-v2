import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { INoticeData } from '@/types/TNoticeType';
import { INoticeListProps } from '@/types/atoms.type';
import NoticeItem from '@components/atoms/NoticeItem';

const ITEMS_PER_PAGE = 8;

const NoticeList = ({ noticeData }: INoticeListProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(noticeData.length / ITEMS_PER_PAGE);

  // 현재 페이지에 표시할 공지사항 추출
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNotices = noticeData.slice(startIndex, endIndex);

  // 이전 페이지로 이동
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.noticeListWrapper}>
          {currentNotices.map((notice: INoticeData, index: number) => {
            return (
              <View key={index}>
                <NoticeItem noticeData={notice} />
              </View>
            );
          })}
        </View>

        {/* 페이지네이션 컨트롤 */}
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            onPress={handlePrevious}
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
            onPress={handleNext}
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 50, // 하단 여백 추가
  },
  noticeListWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
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

export default NoticeList;
