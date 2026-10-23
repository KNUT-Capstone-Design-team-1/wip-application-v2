import { View, ScrollView } from 'react-native';
import { useStore } from 'zustand';
import { BaseText } from '@components/common/BaseText';
import { useKeywordNavigationActions } from '../../hooks/use_keyword_navigation_actions';
import { useKeywordNavigationInit } from '../../hooks/use_keyword_navigation_init';
import { useKeywordNavigationScroll } from '../../hooks/use_keyword_navigation_scroll';
import { usePillDetailContext } from '../../hooks/use_pill_detail_context';
import {
  usePillDetailReviewInit,
  usePillDetailMetadataInit,
} from '../../hooks/use_pill_detail_screen_init';
import { styles } from '../../styles/PillSearchResultDetailScreen';
import DetailFindBar from '../molecules/DetailFindBar';
import { useDetailFindHeader } from '../../hooks/use_detail_find_header';
import KeywordSearchBar from '../molecules/KeywordSearchBar';
import PillDetailImage from '../molecules/PillDetailImage';
import PillDetailInfo from './PillDetailInfo';

// 데이터 변경에 따른 비시각적 생명주기 격리.
const PillDetailLifecycle = () => {
  const store = usePillDetailContext();
  const data = useStore(store, (state) => state.pillData);
  useKeywordNavigationInit(data);
  useDetailFindHeader();
  usePillDetailMetadataInit(data?.ITEM_SEQ, data?.ITEM_NAME);
  usePillDetailReviewInit(data?.ITEM_SEQ);

  return null;
};

// 상세 화면 공통 참고 안내.
const PillDetailDisclaimer = () => (
  <View style={styles.disclaimerWrapper}>
    <BaseText weight="semiBold" size={13} style={styles.disclaimerText}>
      본 앱의 정보는 참고용이며, 정확한 의학적 진단 및 치료를 대신할 수
      없습니다. 의약품 복용 시 반드시 의사나 약사와 상담하십시오.
    </BaseText>
  </View>
);

// 본문 레이아웃·스크롤 연결.
const PillDetailContent = () => {
  const { dismiss } = useKeywordNavigationActions();
  const { scrollRef, onScroll, onScrollBeginDrag } =
    useKeywordNavigationScroll();

  return (
    <View style={styles.contentWrapper}>
      <PillDetailLifecycle />
      <DetailFindBar />
      <View style={styles.contentWrapper}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          ref={scrollRef}
          onTouchStart={dismiss}
          onScroll={onScroll}
          onScrollBeginDrag={onScrollBeginDrag}
          scrollEventThrottle={16}
          removeClippedSubviews={false}
          style={styles.scrollViewWrapper}
        >
          <View style={styles.viewWrapper}>
            <PillDetailImage />
            <PillDetailInfo />
            <PillDetailDisclaimer />
          </View>
        </ScrollView>
        <KeywordSearchBar />
      </View>
    </View>
  );
};

export default PillDetailContent;
