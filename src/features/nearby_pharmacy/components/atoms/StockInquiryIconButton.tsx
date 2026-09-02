import { memo } from 'react';
import { TouchableOpacity, GestureResponderEvent } from 'react-native';
import { Hospital } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';

interface IStockInquiryIconButtonProps {
  onPress: (e?: GestureResponderEvent) => void;
  size?: number;
  color?: string;
}

// 재고 문의 아이콘 버튼
const StockInquiryIconButton = ({
  onPress,
  size = 20,
  color = COLOR_TEXT.sub,
}: IStockInquiryIconButtonProps) => {
  return (
    <TouchableOpacity
      onPress={(e) => {
        e.stopPropagation();
        onPress(e);
      }}
      activeOpacity={0.6}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      <Hospital size={fontPx(size)} stroke={color} strokeWidth={2} />
    </TouchableOpacity>
  );
};

export default memo(StockInquiryIconButton);
