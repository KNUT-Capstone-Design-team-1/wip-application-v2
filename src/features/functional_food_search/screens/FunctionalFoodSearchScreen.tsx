import { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BaseText } from '@components/common/BaseText';
import NotItem from '@components/common/NotItem';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { IFunctionalFoodNutrients } from '@services/database/types';
import { useFunctionalFoodSearch } from '../hooks/use_functional_food_search';
import { useFunctionalFoodCategories } from '../hooks/use_functional_food_categories';
import StackedSearchBar from '../components/organisms/StackedSearchBar';
import CategoryChipList from '../components/organisms/CategoryChipList';
import FunctionalFoodListItem from '../components/molecules/FunctionalFoodListItem';

const FunctionalFoodSearchScreen = () => {
  const router = useRouter();

  const {
    nameKeyword,
    setNameKeyword,
    manufacturer,
    setManufacturer,
    selectedCategory,
    items,
    totalCount,
    isLoading,
    isLoadingMore,
    onSubmitSearch,
    onSelectCategory,
    loadMore,
  } = useFunctionalFoodSearch();

  const { chips } = useFunctionalFoodCategories();

  const handlePressItem = useCallback(
    (foodCode: string) => {
      router.push({
        pathname: '/functional-food-detail',
        params: { foodCode },
      });
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: IFunctionalFoodNutrients }) => (
      <FunctionalFoodListItem item={item} onPress={handlePressItem} />
    ),
    [handlePressItem],
  );

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) {
      return null;
    }

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLOR.primary} />
      </View>
    );
  }, [isLoadingMore]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return null;
    }

    return (
      <NotItem
        mainText="검색 결과가 없어요"
        subText="다른 키워드나 카테고리로 찾아보세요"
        marginTop={String(px(60))}
      />
    );
  }, [isLoading]);

  return (
    <View style={styles.container}>
      <StackedSearchBar
        nameKeyword={nameKeyword}
        onChangeName={setNameKeyword}
        manufacturer={manufacturer}
        onChangeManufacturer={setManufacturer}
        onSubmit={onSubmitSearch}
      />

      <CategoryChipList
        chips={chips}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      <View style={styles.countRow}>
        <BaseText weight="medium" size={12} style={styles.countText}>
          검색 결과{' '}
          <BaseText weight="semiBold" size={12} style={styles.countNumber}>
            {totalCount.toLocaleString()}
          </BaseText>
          건
        </BaseText>
      </View>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLOR.primary} />
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.foodCode}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={items.length === 0 && styles.emptyContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BG.surface,
  },
  list: {
    flex: 1,
  },
  countRow: {
    paddingHorizontal: px(20),
    paddingTop: px(4),
    paddingBottom: px(10),
  },
  countText: {
    color: COLOR_TEXT.sub,
  },
  countNumber: {
    color: COLOR.primary,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingVertical: px(16),
    alignItems: 'center',
  },
  emptyContainer: {
    flexGrow: 1,
  },
});

export default FunctionalFoodSearchScreen;
