import { memo } from 'react';
import { TouchableOpacity, ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from 'zustand';
import { BaseText } from '@components/common/BaseText';
import StockInquiryIconButton from '@features/nearby_pharmacy/components/atoms/StockInquiryIconButton';
import { fontPx } from '@utils/responsive';
import { PILL_DETAIL_ACTION_COLOR } from '../../constants/pill_detail';
import { usePillDetailSaveActions } from '../../hooks/use_pill_detail_actions';
import { usePillDetailContext } from '../../hooks/use_pill_detail_context';
import { usePillStockInquiryActions } from '../../hooks/use_pill_stock_inquiry_actions';
import { styles } from '../../styles/molecules/PillBasicHeader';
import { Bookmark } from 'lucide-react-native';

// 저장 여부만 구독하는 폴더 선택 버튼.
const PillSaveButton = () => {
  const store = usePillDetailContext();
  const isSaved = useStore(store, (state) => state.savedFolderIds.length > 0);
  const { openFolderModal } = usePillDetailSaveActions();

  return (
    <TouchableOpacity
      style={styles.saveButton}
      onPress={openFolderModal}
      accessibilityRole="button"
      accessibilityLabel="저장 폴더 선택"
      accessibilityState={{ selected: isSaved }}
    >
      <Bookmark
        size={fontPx(24)}
        fill={isSaved ? PILL_DETAIL_ACTION_COLOR : 'none'}
        stroke={PILL_DETAIL_ACTION_COLOR}
        strokeWidth={2}
      />
    </TouchableOpacity>
  );
};

// 상세 화면 재고 문의 명령 연결.
const PillStockInquiryButton = () => {
  const { onStockInquiry } = usePillStockInquiryActions();

  return (
    <StockInquiryIconButton
      onPress={onStockInquiry}
      size={20}
      color={PILL_DETAIL_ACTION_COLOR}
    />
  );
};

// 제품명과 헤더 버튼 배치.
const PillBasicHeader = () => {
  const store = usePillDetailContext();
  const itemName = useStore(store, (state) => state.pillData?.ITEM_NAME || '');
  const itemNames = itemName.split(/(?=\()/, 2);

  return (
    <View style={styles.headerWrapper}>
      <ScrollView
        style={styles.nameScrollWrapper}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.nameViewWrapper}>
          <BaseText
            selectable={true}
            weight="bold"
            size={22}
            style={styles.name}
          >
            {itemNames[0].trim()}
          </BaseText>
          {itemNames[1] && (
            <BaseText
              selectable={true}
              weight="bold"
              size={18}
              style={styles.name}
            >
              {itemNames[1]}
            </BaseText>
          )}
        </View>
      </ScrollView>
      <LinearGradient
        colors={['rgb(255,255,255,0)', 'white']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradiant}
        pointerEvents="none"
      />
      <View style={styles.actionButtons}>
        <PillStockInquiryButton />
        <PillSaveButton />
      </View>
    </View>
  );
};

export default memo(PillBasicHeader);
