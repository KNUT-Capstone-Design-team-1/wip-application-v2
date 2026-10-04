import { ScrollView, StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { ICategoryChip } from '../../types';
import CategoryChip from '../atoms/CategoryChip';

interface ICategoryChipListProps {
  chips: ICategoryChip[];
  selectedCategory: string;
  onSelectCategory: (value: string) => void;
}

const CategoryChipList = ({
  chips,
  selectedCategory,
  onSelectCategory,
}: ICategoryChipListProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {chips.map((chip) => (
        <CategoryChip
          key={chip.value || 'all'}
          label={chip.label}
          selected={selectedCategory === chip.value}
          onPress={() => onSelectCategory(chip.value)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // 가로 스크롤 영역이 세로로 늘어나지 않도록 고정
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  container: {
    // 교차축(세로) 정렬을 center로 지정해 칩이 세로로 늘어나는 것을 방지
    alignItems: 'center',
    gap: px(8),
    paddingHorizontal: px(16),
    paddingVertical: px(10),
  },
});

export default CategoryChipList;
