import { useEffect, useState } from 'react';
import { FunctionalFoodQuery } from '@services/database/queries';
import type {
  IFunctionalFoodClassification,
  IHealthFunctionalFoodRawMaterial,
} from '@services/database/types';
import logger from '@utils/logger';

export const useFunctionalFoodDetail = (reportNumber?: string) => {
  const [data, setData] = useState<IHealthFunctionalFoodRawMaterial | null>(
    null,
  );
  const [classifications, setClassifications] = useState<
    IFunctionalFoodClassification[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    setData(null);
    setClassifications([]);
    setIsLoading(Boolean(reportNumber));
    if (reportNumber) {
      Promise.all([
        FunctionalFoodQuery.getFunctionalFoodByReportNumber(reportNumber),
        FunctionalFoodQuery.getFunctionalFoodClassifications(reportNumber),
      ])
        .then(([product, standards]) => {
          if (mounted) {
            setData(product);
            setClassifications(standards);
          }
        })
        .catch((error) =>
          logger.error('[FUNCTIONAL-FOOD-DETAIL] ' + String(error)),
        )
        .finally(() => {
          if (mounted) setIsLoading(false);
        });
    }
    return () => {
      mounted = false;
    };
  }, [reportNumber]);
  return { data, classifications, isLoading };
};
