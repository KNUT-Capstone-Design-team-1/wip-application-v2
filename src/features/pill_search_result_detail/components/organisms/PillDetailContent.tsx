import { View, ScrollView } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { IPillDetail } from '../../types/pill_detail_type';
import { useKeywordNavigationActions } from '../../hooks/use_keyword_navigation_actions';
import { useKeywordNavigationInit } from '../../hooks/use_keyword_navigation_init';
import { useKeywordNavigationScroll } from '../../hooks/use_keyword_navigation_scroll';
import { usePillStockInquiryActions } from '../../hooks/use_pill_stock_inquiry_actions';
import { styles } from '../../styles/PillSearchResultDetailScreen';
import KeywordSearchBar from '../molecules/KeywordSearchBar';
import PillDetailImage from '../molecules/PillDetailImage';
import PillDetailInfo from './PillDetailInfo';

interface Props {
  data: IPillDetail;
  image?: string;
  isSaved: boolean;
  detailLoading?: boolean;
  onSaveToggle: () => void;
}

// 상세 본문 레이아웃·스크롤 연결.
const PillDetailContent = ({
  data,
  image,
  isSaved,
  detailLoading,
  onSaveToggle,
}: Props) => {
  useKeywordNavigationInit(data);
  const { dismiss } = useKeywordNavigationActions();
  const { scrollRef, onScroll, onScrollBeginDrag } =
    useKeywordNavigationScroll();
  const { onStockInquiry } = usePillStockInquiryActions(data, image);

  return (
    <View style={styles.contentWrapper}>
      <ScrollView
        ref={scrollRef}
        onTouchStart={dismiss}
        onScroll={onScroll}
        onScrollBeginDrag={onScrollBeginDrag}
        scrollEventThrottle={16}
        removeClippedSubviews={false}
        style={styles.scrollViewWrapper}
      >
        <View style={styles.viewWrapper}>
          <PillDetailImage uri={image || data.ITEM_IMAGE} />
          <PillDetailInfo
            data={data}
            saveState={isSaved}
            onSaveToggle={onSaveToggle}
            onStockInquiry={onStockInquiry}
            detailLoading={detailLoading}
          />
          <View style={styles.disclaimerWrapper}>
            <BaseText weight="semiBold" size={13} style={styles.disclaimerText}>
              본 앱의 정보는 참고용이며, 정확한 의학적 진단 및 치료를 대신할 수
              없습니다. 의약품 복용 시 반드시 의사나 약사와 상담하십시오.
            </BaseText>
          </View>
        </View>
      </ScrollView>
      <KeywordSearchBar />
    </View>
  );
};

export default PillDetailContent;
