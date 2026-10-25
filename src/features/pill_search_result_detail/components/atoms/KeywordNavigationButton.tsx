import { TouchableOpacity } from 'react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '../../styles/atoms/KeywordNavigationButton';
import type { KeywordNavigationButtonProps } from '../../types/pill_detail_component_type';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

const KeywordNavigationButton = ({
  direction,
  disabled,
  onPress,
}: KeywordNavigationButtonProps) => {
  const Icon = direction === 'previous' ? ChevronUp : ChevronDown;
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      hitSlop={10}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={
        direction === 'previous' ? '이전 검색 결과' : '다음 검색 결과'
      }
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
    >
      <Icon size={fontPx(24)} strokeWidth={2} color={COLOR_TEXT.white} />
    </TouchableOpacity>
  );
};

export default KeywordNavigationButton;
