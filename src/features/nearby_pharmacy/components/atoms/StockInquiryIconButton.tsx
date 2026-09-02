import { memo } from 'react';
import { TouchableOpacity, GestureResponderEvent } from 'react-native';
import { Hospital } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/nearby_pharmacy/styles/StockInquiryIconButton';

interface IStockInquiryIconButtonProps {
  onPress: (e?: GestureResponderEvent) => void;
  size?: number;
}

// 재고 문의 아이콘 버튼
const StockInquiryIconButton = ({
  onPress,
  size = 20,
}: IStockInquiryIconButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={(e) => {
        e.stopPropagation();
        onPress(e);
      }}
      activeOpacity={0.6}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      <Hospital size={fontPx(size)} stroke={COLOR['primary']} strokeWidth={2} />
    </TouchableOpacity>
  );
};

export default memo(StockInquiryIconButton);
