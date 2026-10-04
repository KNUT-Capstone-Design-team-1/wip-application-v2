import { useEffect, useState } from 'react';
import { FunctionalFoodNutrientsQuery } from '@services/database/queries';
import logger from '@utils/logger';
import { ICategoryChip } from '../types';
import { CATEGORY_LIMIT } from '../constants/categories';

// 항상 맨 앞에 오는 '전체' 칩 (value '' = 필터 미적용)
const ALL_CHIP: ICategoryChip = { label: '전체', value: '' };

/**
 * 카테고리(중분류) 칩을 DB 데이터로부터 동적으로 생성하는 훅
 * - 데이터 수가 많은 상위 중분류를 빈도순으로 칩으로 노출
 * - 칩 value는 foodMediumCategoryName 검색어로 사용된다
 */
export const useFunctionalFoodCategories = () => {
  const [chips, setChips] = useState<ICategoryChip[]>([ALL_CHIP]);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const names =
          await FunctionalFoodNutrientsQuery.getFunctionalFoodCategories(
            CATEGORY_LIMIT,
          );

        if (isMounted) {
          setChips([
            ALL_CHIP,
            ...names.map((name) => ({ label: name, value: name })),
          ]);
        }
      } catch (error) {
        logger.error(
          `[FUNCTIONAL-FOOD-CATEGORIES] Failed to load categories. ${(error as Error).stack || error}`,
        );
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return { chips };
};
