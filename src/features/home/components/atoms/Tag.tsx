import { View, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/atoms/Tag';
import { X } from 'lucide-react-native';
import { BaseText } from '@components/common/BaseText';
import { fontPx } from '@utils/responsive';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';

interface ITagProps {
  title: string;
  onPressHandler: () => void;
  onDeleteHandler?: () => void;
  showDelete?: boolean;
  backgroundColor?: string;
}

const Tag = ({
  title,
  onPressHandler,
  onDeleteHandler,
  showDelete = false,
  backgroundColor = COLOR_BG['surface'],
}: ITagProps) => {
  return (
    <View style={[styles.tagContainer, { backgroundColor }]}>
      <TouchableOpacity
        style={styles.tagWrapper}
        onPress={onPressHandler}
        activeOpacity={0.5}
      >
        <BaseText weight={'medium'} size={14} style={styles.tagTitle}>
          {title}
        </BaseText>
      </TouchableOpacity>
      {showDelete && onDeleteHandler && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDeleteHandler}
          activeOpacity={0.7}
        >
          <X size={fontPx(14)} color={COLOR_TEXT['disabled']} strokeWidth={3} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Tag;
