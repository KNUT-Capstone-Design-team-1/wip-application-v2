import { View, Text, StyleSheet } from 'react-native';
import { ITagProps } from '@/types/atoms.type';
import { getMappedTitle } from '@utils/tag';
import { useTagValue } from '@/hooks/useTagValue';

const Tag = ({ title, value }: ITagProps) => {
  const displayTitle = getMappedTitle(title);
  const tagValue = useTagValue(title, value);

  return (
    <View style={styles.tagWrapper}>
      <Text style={styles.tagTitle}>{displayTitle} : </Text>
      <Text style={styles.tagValue}>{tagValue}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tagWrapper: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#7472EB',
    color: '#4c4ae8',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
    fontWeight: '600',
  },
  tagTitle: {
    fontWeight: '600',
    color: '#444',
  },
  tagValue: {
    color: '#424242',
  },
});

export default Tag;
