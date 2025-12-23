import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { INoticeData } from '@/types/TNoticeType';
import { INoticeListProps } from '@/types/atoms.type';
import NoticeItem from '@components/atoms/NoticeItem';
import PrevNextPagination from '@components/molecules/PrevNextPagination';
import { usePagination } from '@/hooks/usePagination';

const ITEMS_PER_PAGE = 8;

const NoticeList = ({ noticeData }: INoticeListProps) => {
  const {
    currentPage,
    totalPages,
    currentData: currentNotices,
    handlePrevious,
    handleNext,
  } = usePagination({
    data: noticeData,
    itemsPerPage: ITEMS_PER_PAGE,
  });

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
        <PrevNextPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
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
  },
});

export default NoticeList;
