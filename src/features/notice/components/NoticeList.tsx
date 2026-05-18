import React, { memo } from 'react';
import { View, ScrollView } from 'react-native';
import { styles } from '@features/notice/styles/NoticeList';
import {
  INoticeData,
  INoticeListProps,
} from '@features/notice/types/notice_type';
import NoticeItem from '@features/notice/components/NoticeItem';
import PrevNextPagination from '@features/notice/components/PrevNextPagination';
import { usePagination } from '@features/notice/hooks/use_pagination';
import { ITEMS_PER_PAGE } from '@features/notice/constants/notice';

/**
 * 공지사항 아이템들을 렌더링하는 컨테이너 컴포넌트
 */
const NoticeItemsContainer = ({ notices }: { notices: INoticeData[] }) => (
  <View style={styles.noticeListWrapper}>
    {notices.map((notice, index) => (
      <View key={notice.idx || index}>
        <NoticeItem noticeData={notice} />
      </View>
    ))}
  </View>
);

/**
 * 페이지네이션 섹션 컴포넌트
 */
const PaginationSection = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}) => (
  <PrevNextPagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPrevious={onPrevious}
    onNext={onNext}
  />
);

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
        <NoticeItemsContainer notices={currentNotices} />
        <PaginationSection
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </ScrollView>
    </View>
  );
};

export default memo(NoticeList);
