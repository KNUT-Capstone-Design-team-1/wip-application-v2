import { TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/pill_save/styles/atoms/DeleteButton';

// 저장된 알약을 삭제하기 위한 닫기(X) 버튼 컴포넌트
export const DeleteButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    style={styles.closeButton}
    onPress={onPress}
    activeOpacity={0.6}
  >
    <X size={fontPx(14)} color={COLOR['white']} strokeWidth={4} />
  </TouchableOpacity>
);
