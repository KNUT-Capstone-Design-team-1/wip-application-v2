import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Tag from '@/components/atoms/Tag';

interface ITagListProps {
  tagList: any[];
  wrapperWidth: any;
}

const TagWrapper = ({ tagList, wrapperWidth }: ITagListProps) => {
  return (
    <View
      style={[
        styles.container,
        { width: wrapperWidth },
        tagList.length === 0 && { alignItems: 'center' },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tagList.length === 0 ? (
          <Text style={styles.emptyText}>선택된 식별 사항이 없습니다.</Text>
        ) : (
          tagList.map((tag, index) => (
            <Tag title={tag.key} value={tag.value} key={index} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    margin: 'auto',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    display: 'flex',
    gap: 5,
  },
});

export default TagWrapper;
