import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
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

      {/* 우측에 가려진 칩이 더 있음을 암시하는 연한 페이드 */}
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.rightFade}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // 가로 스크롤 영역이 세로로 늘어나지 않도록 고정
  wrapper: {
    flexGrow: 0,
    flexShrink: 0,
  },
  container: {
    // 교차축(세로) 정렬을 center로 지정해 칩이 세로로 늘어나는 것을 방지
    alignItems: 'center',
    gap: px(8),
    paddingHorizontal: px(20),
    paddingVertical: px(8),
  },
  rightFade: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: px(56),
  },
});

export default CategoryChipList;
