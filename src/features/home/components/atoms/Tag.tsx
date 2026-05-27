import { View, TouchableOpacity, Text } from 'react-native';
import { IconStyles, styles } from '../../styles/atoms/Tag';
import { X } from 'lucide-react-native';

interface ITagProps {
  title: string;
  onPressHandler: () => void;
  onDeleteHandler?: () => void;
  showDelete?: boolean;
}

const Tag = ({
  title,
  onPressHandler,
  onDeleteHandler,
  showDelete = false,
}: ITagProps) => {
  return (
    <View style={styles.tagContainer}>
      <TouchableOpacity
        style={styles.tagWrapper}
        onPress={onPressHandler}
        activeOpacity={0.5}
      >
        <Text style={styles.tagTitle}>{title}</Text>
      </TouchableOpacity>
      {showDelete && onDeleteHandler && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDeleteHandler}
          activeOpacity={0.7}
        >
          <X {...IconStyles['deleteIcon']} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Tag;
