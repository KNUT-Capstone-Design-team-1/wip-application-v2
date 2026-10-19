import { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '../../styles/organisms/PillDetailInfo';

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
}

// 상세 제원 더보기 버튼.
const PillSpecsToggle = ({ isExpanded, onToggle }: Props) => {
  const Icon = isExpanded ? ChevronUp : ChevronDown;

  return (
    <TouchableOpacity
      style={styles.infoMoreBtn}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
    >
      <View style={styles.iconPlaceholder} />
      <BaseText weight="semiBold" size={16} style={styles.infoMoreBtnText}>
        {isExpanded ? '접기' : '더보기'}
      </BaseText>
      <Icon size={fontPx(24)} color={COLOR_TEXT.sub} strokeWidth={2} />
    </TouchableOpacity>
  );
};

export default memo(PillSpecsToggle);
