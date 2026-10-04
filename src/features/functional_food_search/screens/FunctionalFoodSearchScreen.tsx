import { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BaseText } from '@components/common/BaseText';
import NotItem from '@components/common/NotItem';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { IFunctionalFoodNutrients } from '@services/database/types';
import SearchBarHeader from '@features/shared/components/SearchBarHeader';
import SearchInput from '@features/shared/components/SearchInput';
import { useFunctionalFoodSearch } from '../hooks/use_functional_food_search';
import CategoryChipList from '../components/organisms/CategoryChipList';
import FunctionalFoodListItem from '../components/molecules/FunctionalFoodListItem';

const FunctionalFoodSearchScreen = () => {
  const router = useRouter();

  const {
    keyword,
    setKeyword,
    selectedCategory,
    items,
    totalCount,
    isLoading,
    isLoadingMore,
    onSubmitSearch,
    onSelectCategory,
    loadMore,
  } = useFunctionalFoodSearch();

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
      <SearchBarHeader>
        <SearchInput
          value={keyword}
          onChangeText={setKeyword}
          onSubmit={onSubmitSearch}
          placeholder="제품명 · 제조사로 검색"
          containerStyle={styles.searchBar}
        />
      </SearchBarHeader>

      <CategoryChipList
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
  searchBar: {
    flexGrow: 1,
  },
  list: {
    flex: 1,
  },
  countRow: {
    paddingHorizontal: px(20),
    paddingBottom: px(8),
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
