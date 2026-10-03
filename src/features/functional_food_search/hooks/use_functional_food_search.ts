import { useCallback, useEffect, useState } from 'react';
import { FunctionalFoodNutrientsQuery } from '@services/database/queries';
import {
  IFunctionalFoodNutrients,
  TFunctionalFoodNutrientsSearchParam,
} from '@services/database/types';
import { useToast } from '@hooks/use_toast';
import logger from '@utils/logger';
import { PAGE_LIMIT } from '../constants/categories';

// 키워드/카테고리로부터 검색 파라미터 구성
const buildParams = (
  keyword: string,
  category: string,
): Partial<TFunctionalFoodNutrientsSearchParam> => {
  const params: Partial<TFunctionalFoodNutrientsSearchParam> = {};

  const trimmedKeyword = keyword.trim();
  if (trimmedKeyword) {
    params.keyword = trimmedKeyword;
  }

  // 카테고리 '전체'는 value === '' 이므로 필터를 적용하지 않는다
  if (category) {
    params.foodMediumCategoryName = category;
  }

  return params;
};

/**
 * 건강기능식품(영양제) 검색 훅
 * - 키워드(제품명/제조사/대표식품명) + 카테고리(중분류) 필터
 * - 무한 스크롤 페이지네이션
 */
export const useFunctionalFoodSearch = () => {
  const { showToast } = useToast();

  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [items, setItems] = useState<IFunctionalFoodNutrients[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const hasMore: boolean = items.length < totalCount;

  // 첫 페이지부터 새로 검색
  const runSearch = useCallback(
    async (searchKeyword: string, category: string) => {
      setIsLoading(true);

      try {
        const params = buildParams(searchKeyword, category);

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
      const params = buildParams(keyword, selectedCategory);
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
  }, [isLoading, isLoadingMore, hasMore, page, keyword, selectedCategory]);

  // 검색 실행 (키워드 제출)
  const onSubmitSearch = useCallback(() => {
    runSearch(keyword, selectedCategory);
  }, [runSearch, keyword, selectedCategory]);

  // 카테고리 선택 시 즉시 재검색
  const onSelectCategory = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      runSearch(keyword, category);
    },
    [runSearch, keyword],
  );

  // 최초 진입 시 전체 목록 로드
  useEffect(() => {
    runSearch('', '');
    // 마운트 시 1회만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    keyword,
    setKeyword,
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
