import { useCallback, useEffect, useRef, useState } from 'react';
import { FunctionalFoodQuery } from '@services/database/queries';
import type {
  IHealthFunctionalFoodRawMaterial,
  TFunctionalFoodSearchParam,
} from '@services/database/types';
import { useToast } from '@hooks/use_toast';
import logger from '@utils/logger';

const PAGE_LIMIT = 30;

/** 마지막으로 제출한 검색 조건으로 페이지를 이어 읽고 오래된 응답은 무시한다. */
export const useFunctionalFoodSearch = () => {
  const { showToast } = useToast();
  const [nameKeyword, setNameKeyword] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [items, setItems] = useState<IHealthFunctionalFoodRawMaterial[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const requestId = useRef(0);
  const pending = useRef(false);
  const activeParams = useRef<TFunctionalFoodSearchParam>({});
  const hasMore = items.length < totalCount;

  const runSearch = useCallback(
    async (keyword: string, mfg: string, productForm: string) => {
      const id = ++requestId.current;
      pending.current = true;
      activeParams.current = {
        keyword: keyword.trim(),
        manufacturer: mfg.trim(),
        productForm,
      };
      setIsLoading(true);
      setIsLoadingMore(false);
      try {
        const [list, count] = await Promise.all([
          FunctionalFoodQuery.getFunctionalFoods(activeParams.current, {
            page: 1,
            limit: PAGE_LIMIT,
          }),
          FunctionalFoodQuery.getFunctionalFoodsCount(activeParams.current),
        ]);
        if (id !== requestId.current) return;
        setItems(list);
        setTotalCount(count);
        setPage(1);
      } catch (error) {
        if (id !== requestId.current) return;
        logger.error('[FUNCTIONAL-FOOD-SEARCH] ' + String(error));
        showToast({
          type: 'error',
          message: '검색에 실패했습니다. 잠시 후 다시 시도해 주세요.',
        });
        setItems([]);
        setTotalCount(0);
      } finally {
        if (id === requestId.current) {
          pending.current = false;
          setIsLoading(false);
        }
      }
    },
    [showToast],
  );

  const loadMore = useCallback(async () => {
    if (pending.current || !hasMore) return;
    pending.current = true;
    setIsLoadingMore(true);
    const id = requestId.current;
    try {
      const list = await FunctionalFoodQuery.getFunctionalFoods(
        activeParams.current,
        { page: page + 1, limit: PAGE_LIMIT },
      );
      if (id !== requestId.current) return;
      setItems((previous) => [...previous, ...list]);
      setPage(page + 1);
    } catch (error) {
      logger.error('[FUNCTIONAL-FOOD-SEARCH] ' + String(error));
    } finally {
      if (id === requestId.current) {
        pending.current = false;
        setIsLoadingMore(false);
      }
    }
  }, [hasMore, page]);

  const onSubmitSearch = useCallback(() => {
    void runSearch(nameKeyword, manufacturer, selectedCategory);
  }, [runSearch, nameKeyword, manufacturer, selectedCategory]);
  const onSelectCategory = useCallback(
    (category: string) => {
      const nextCategory = selectedCategory === category ? '' : category;
      setSelectedCategory(nextCategory);
      void runSearch(nameKeyword, manufacturer, nextCategory);
    },
    [runSearch, nameKeyword, manufacturer, selectedCategory],
  );

  useEffect(() => {
    void runSearch('', '', '');
    return () => {
      requestId.current += 1;
    };
    // 최초 마운트에서만 기본 검색을 실행한다.
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
