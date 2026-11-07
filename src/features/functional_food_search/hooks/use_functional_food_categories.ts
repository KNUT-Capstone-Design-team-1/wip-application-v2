import { useEffect, useState } from 'react';
import { FunctionalFoodQuery } from '@services/database/queries';
import logger from '@utils/logger';
import type { ICategoryChip } from '../types';

/** 실제 제품형태(캡슐, 분말 등)를 필터로 제공한다. */
export const useFunctionalFoodCategories = () => {
  const [chips, setChips] = useState<ICategoryChip[]>([]);
  useEffect(() => {
    let mounted = true;
    FunctionalFoodQuery.getFunctionalFoodProductForms()
      .then((names) => {
        if (mounted)
          setChips(names.map((name) => ({ label: name, value: name })));
      })
      .catch((error) =>
        logger.error('[FUNCTIONAL-FOOD-CATEGORIES] ' + String(error)),
      );
    return () => {
      mounted = false;
    };
  }, []);
  return { chips };
};
