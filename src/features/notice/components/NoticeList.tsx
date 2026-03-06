import React, { useEffect } from "react";
import { View, ScrollView } from 'react-native';
import { styles } from '../styles/NoticeList';
import { INoticeData } from '../types/notice_type';
import { INoticeListProps } from '../types/notice_type';
import NoticeItem from '../components/NoticeItem';
import PrevNextPagination from './PrevNextPagination';
import { usePagination } from '../hooks/use_pagination';
import { ITEMS_PER_PAGE } from '../constants/notice';

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

  useEffect(() => {
    console.log('currentNotices', currentNotices);
  }, []);

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

export default NoticeList;
