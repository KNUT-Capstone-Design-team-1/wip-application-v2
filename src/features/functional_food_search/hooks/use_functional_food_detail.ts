import { useEffect, useState } from 'react';
import { FunctionalFoodNutrientsQuery } from '@services/database/queries';
import { IFunctionalFoodNutrients } from '@services/database/types';
import logger from '@utils/logger';

/**
 * 식품코드(foodCode)로 단일 건강기능식품 상세 정보를 조회하는 훅
 */
export const useFunctionalFoodDetail = (foodCode?: string) => {
  const [data, setData] = useState<IFunctionalFoodNutrients | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDetail = async () => {
      if (!foodCode) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const result =
          await FunctionalFoodNutrientsQuery.getFunctionalFoodNutrientByFoodCode(
            foodCode,
          );

        if (isMounted) {
          setData(result);
        }
      } catch (error) {
        logger.error(
          `[FUNCTIONAL-FOOD-DETAIL] Failed to load detail. ${(error as Error).stack || error}`,
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [foodCode]);

  return { data, isLoading };
};
