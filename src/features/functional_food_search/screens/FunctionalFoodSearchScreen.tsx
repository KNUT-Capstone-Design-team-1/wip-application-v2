import { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BaseText } from '@components/common/BaseText';
import NotItem from '@components/common/NotItem';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { IHealthFunctionalFoodRawMaterial } from '@services/database/types';
import { useFunctionalFoodSearch } from '../hooks/use_functional_food_search';
import { useFunctionalFoodCategories } from '../hooks/use_functional_food_categories';
import CategoryChipList from '../components/organisms/CategoryChipList';
import StackedSearchBar from '../components/organisms/StackedSearchBar';
import FunctionalFoodListItem from '../components/molecules/FunctionalFoodListItem';
import FoodSafetyKoreaFloatingButton from '../components/atoms/FoodSafetyKoreaFloatingButton';

const FunctionalFoodSearchScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    nameKeyword,
    setNameKeyword,
    manufacturer,
    selectedCategory,
    setManufacturer,
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
    (reportNumber: string) => {
      router.push({
        pathname: '/functional-food-detail',
        params: { reportNumber },
      });
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: IHealthFunctionalFoodRawMaterial }) => (
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
        subText="다른 제품명이나 제조사로 찾아보세요"
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

      {chips.length > 0 && (
        <CategoryChipList
          chips={chips}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      )}

      <View style={styles.countRow}>
        <BaseText weight="medium" size={13} style={styles.countText}>
          검색 결과{' '}
          <BaseText weight="semiBold" size={13} style={styles.countNumber}>
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
          keyExtractor={(item) => item.PRDLST_REPORT_NO}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[
            { paddingBottom: px(100) + insets.bottom },
            items.length === 0 && styles.emptyContainer,
          ]}
        />
      )}

      {!isLoading && <FoodSafetyKoreaFloatingButton />}
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
    paddingVertical: px(12),
    justifyContent: 'center',
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
