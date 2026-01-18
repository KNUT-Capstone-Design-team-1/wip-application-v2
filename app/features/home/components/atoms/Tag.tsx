import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from '@/app/features/home/styles/atoms/Tag';

interface ITagProps {
  title: string;
  onPressHandler: () => void;
}

const Tag = ({ title, onPressHandler }: ITagProps) => {
  return (
    <TouchableOpacity style={styles.tagWrapper} onPress={onPressHandler} activeOpacity={0.5}>
      <Text style={styles.tagTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Tag;
