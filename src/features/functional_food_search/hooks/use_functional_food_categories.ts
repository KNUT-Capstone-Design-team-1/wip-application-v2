import { useEffect, useState } from 'react';
import { FunctionalFoodNutrientsQuery } from '@services/database/queries';
import logger from '@utils/logger';
import { ICategoryChip } from '../types';
import { CATEGORY_GROUPS } from '../constants/categories';

// 항상 맨 앞에 오는 '전체' 칩 (value '' = 필터 미적용)
const ALL_CHIP: ICategoryChip = { label: '전체', value: '' };

/**
 * 카테고리 칩을 구성하는 훅
 * - 그룹 정의(CATEGORY_GROUPS, 사람이 관리하는 친화적 라벨)는 정적
 * - 단, 실제 DB에 데이터가 존재하는 그룹만 노출(동적) → 빈 칩 방지
 * - 칩 value는 그룹 key이며, 검색 시 그룹의 match 키워드로 변환된다
 */
export const useFunctionalFoodCategories = () => {
  const [chips, setChips] = useState<ICategoryChip[]>([ALL_CHIP]);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const names =
          await FunctionalFoodNutrientsQuery.getDistinctMediumCategoryNames();

        // 그룹의 match 키워드가 실제 중분류명 중 하나라도 부분 일치하면 노출
        const availableGroups = CATEGORY_GROUPS.filter((group) =>
          group.match.some((keyword) =>
            names.some((name) => name.includes(keyword)),
          ),
        );

        if (isMounted) {
          setChips([
            ALL_CHIP,
            ...availableGroups.map((group) => ({
              label: group.label,
              value: group.key,
            })),
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
