import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/nearby_pharmacy/styles/StockInquiryCallButton';

interface IStockInquiryCallButtonProps {
  onPress: () => void;
}

// 재고 문의 풀 버튼
const StockInquiryCallButton = ({ onPress }: IStockInquiryCallButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <BaseText weight="semiBold" size={14} style={styles.text}>
        재고 문의
      </BaseText>
    </TouchableOpacity>
  );
};

export default memo(StockInquiryCallButton);
