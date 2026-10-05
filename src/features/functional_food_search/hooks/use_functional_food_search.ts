import { useCallback, useEffect, useState } from 'react';
import { FunctionalFoodNutrientsQuery } from '@services/database/queries';
import {
  IFunctionalFoodNutrients,
  TFunctionalFoodNutrientsSearchParam,
} from '@services/database/types';
import { useToast } from '@hooks/use_toast';
import logger from '@utils/logger';
import { PAGE_LIMIT } from '../constants/categories';

// 약 이름/제조사/카테고리로부터 검색 파라미터 구성
const buildParams = (
  name: string,
  manufacturer: string,
  category: string,
): Partial<TFunctionalFoodNutrientsSearchParam> => {
  const params: Partial<TFunctionalFoodNutrientsSearchParam> = {};

  const trimmedName = name.trim();
  if (trimmedName) {
    params.nameKeyword = trimmedName;
  }

  const trimmedManufacturer = manufacturer.trim();
  if (trimmedManufacturer) {
    params.manufacturerName = trimmedManufacturer;
  }

  // 카테고리 '전체'는 value === '' 이므로 필터를 적용하지 않는다
  if (category) {
    params.foodMediumCategoryName = category;
  }

  return params;
};

/**
 * 건강기능식품(영양제) 검색 훅
 * - 약 이름(제품명/대표식품명) + 제조사 + 카테고리(중분류) 필터
 * - 무한 스크롤 페이지네이션
 */
export const useFunctionalFoodSearch = () => {
  const { showToast } = useToast();

  const [nameKeyword, setNameKeyword] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [items, setItems] = useState<IFunctionalFoodNutrients[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const hasMore: boolean = items.length < totalCount;

  // 첫 페이지부터 새로 검색
  const runSearch = useCallback(
    async (name: string, mfg: string, category: string) => {
      setIsLoading(true);

      try {
        const params = buildParams(name, mfg, category);

        const [list, count] = await Promise.all([
          FunctionalFoodNutrientsQuery.getFunctionalFoodNutrients(params, {
            page: 1,
            limit: PAGE_LIMIT,
          }),
          FunctionalFoodNutrientsQuery.getFunctionalFoodNutrientsCount(params),
        ]);

        setItems(list);
        setTotalCount(count);
        setPage(1);
      } catch (error) {
        logger.error(
          `[FUNCTIONAL-FOOD-SEARCH] Failed to search. ${(error as Error).stack || error}`,
        );
        showToast({
          type: 'error',
          message: '검색에 실패했습니다.\n잠시 후 다시 시도해 주세요.',
        });
        setItems([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast],
  );

  // 다음 페이지를 이어서 로드
  const loadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const params = buildParams(nameKeyword, manufacturer, selectedCategory);
      const list =
        await FunctionalFoodNutrientsQuery.getFunctionalFoodNutrients(params, {
          page: nextPage,
          limit: PAGE_LIMIT,
        });

      setItems((prev) => [...prev, ...list]);
      setPage(nextPage);
    } catch (error) {
      logger.error(
        `[FUNCTIONAL-FOOD-SEARCH] Failed to load more. ${(error as Error).stack || error}`,
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isLoading,
    isLoadingMore,
    hasMore,
    page,
    nameKeyword,
    manufacturer,
    selectedCategory,
  ]);

  // 검색 실행 (약 이름/제조사 제출)
  const onSubmitSearch = useCallback(() => {
    runSearch(nameKeyword, manufacturer, selectedCategory);
  }, [runSearch, nameKeyword, manufacturer, selectedCategory]);

  // 카테고리 선택 시 즉시 재검색
  const onSelectCategory = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      runSearch(nameKeyword, manufacturer, category);
    },
    [runSearch, nameKeyword, manufacturer],
  );

  // 최초 진입 시 전체 목록 로드
  useEffect(() => {
    runSearch('', '', '');
    // 마운트 시 1회만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    nameKeyword,
    setNameKeyword,
    manufacturer,
    setManufacturer,
    selectedCategory,
    items,
    totalCount,
    isLoading,
    isLoadingMore,
    hasMore,
    onSubmitSearch,
    onSelectCategory,
    loadMore,
  };
};
