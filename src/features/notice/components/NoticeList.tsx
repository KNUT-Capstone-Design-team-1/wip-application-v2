import React, { memo } from 'react';
import { View } from 'react-native';
import { styles } from '@features/notice/styles/NoticeList';
import { INoticeListProps } from '@features/notice/types/notice_type';
import NoticeItem from '@features/notice/components/NoticeItem';
import PrevNextPagination from '@features/notice/components/PrevNextPagination';
import { usePagination } from '@features/notice/hooks/use_pagination';
import { ITEMS_PER_PAGE } from '@features/notice/constants/notice';
import { GlobalBannerAd } from '@features/ads/components/GlobalBannerAd';
import { BannerAdSize } from 'react-native-google-mobile-ads';

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
      <View style={styles.noticeListWrapper}>
        {currentNotices.map((notice, index) => (
          <View key={notice.idx || index} style={styles.noticeListItemWrapper}>
            <NoticeItem noticeData={notice} />
          </View>
        ))}
      </View>
      <View style={styles.noticeBottomWrapper}>
        <PaginationSection
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
        <GlobalBannerAd size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </View>
    </View>
  );
};

export default memo(NoticeList);
