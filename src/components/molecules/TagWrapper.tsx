import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Tag from '@/components/atoms/Tag';
import { LinearGradient } from 'expo-linear-gradient';

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
      <LinearGradient
        colors={['transparent', '#fff']} // 왼쪽은 진하게, 오른쪽은 희미하게
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.blurArea}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tagList.length === 0 ? (
          <Text style={styles.emptyText}>검색 조건이 선택되지 않았습니다.</Text>
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
  blurArea: {
    position: 'absolute',
    zIndex: 1,
    right: 0,
    width: 30,
    height: '100%',
  },
});

export default TagWrapper;
