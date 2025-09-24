import { useState, useEffect, useCallback, useMemo, use } from 'react';
import { Realm, useQuery } from '@realm/react';
import { PillData, TPillData } from '@/api/db/models/pillData';
import {
  calcCosineSimilarity,
  calcOtherSimilarity,
  textToVector,
} from '@/utils/similarity';
import { deepCopyRealmObj } from '@/utils/converter';
import { useSearchQueryStore } from '@/store/searchQueryStore';
import { TPillSearchParam } from '@/api/db/query';

//TODO: 데이터를 가져오는 과정을 비동기로 처리하기

const getMergedPillData = (
  filter: string | undefined,
  params: string[] | undefined,
  initData: TPillSearchParam | null,
  queryRecog: Realm.Results<PillData>,
): Promise<TPillData[]> => {
  return new Promise((resolve) => {
    if (filter === undefined || params === undefined) {
      resolve([]);
      return;
    }

    const recogFilter =
      params.length === 0 ? queryRecog : queryRecog.filtered(filter, ...params);
    let recogArr;

    if (initData && initData.PRINT_FRONT + initData.PRINT_BACK !== '') {
      const initVector = textToVector(
        initData.PRINT_FRONT + initData.PRINT_BACK,
      );

      recogArr = recogFilter
        .map((val) => {
          const recogObj = deepCopyRealmObj(val) as TPillData;
          const inputPrint = ((initData.PRINT_FRONT as string) +
            initData.PRINT_BACK) as string;
          const targetPrint = ((recogObj.PRINT_FRONT as string) +
            recogObj.PRINT_BACK) as string;

          if (targetPrint !== '') {
            const cosineScore = calcCosineSimilarity(
              initVector,
              recogObj.VECTOR as number[],
            );
            const otherScore = calcOtherSimilarity(inputPrint, targetPrint);
            recogObj.SIMILARITY = otherScore * 0.8 + cosineScore * 0.2;
          } else {
            recogObj.SIMILARITY = 0;
          }

          return recogObj;
        })
        .sort((a: any, b: any) => {
          if (b.SIMILARITY !== a.SIMILARITY) {
            return b.SIMILARITY - a.SIMILARITY;
          }
          return (a.ITEM_NAME as string).localeCompare(b.ITEM_NAME as string);
        });
    } else {
      recogArr = recogFilter.sorted('ITEM_NAME').slice();
    }

    resolve(recogArr);
  });
};

export const useGetPillData = (pageSize: number) => {
  const queryRecog = useQuery(PillData);
  const { filter, params, initData } = useSearchQueryStore(
    (state) => state.searchFilterParams,
  );

  const [page, setPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState<TPillData[]>([]);

  const getMergedPillDataPromise = useMemo(
    () => getMergedPillData(filter, params, initData, queryRecog),
    [filter, params, initData, queryRecog],
  );

  const mergedData = use(getMergedPillDataPromise);

  useEffect(() => {
    setPage(1);
    const start = 0;
    const end = pageSize;
    setPaginatedData(mergedData.slice(start, end));
  }, [mergedData, pageSize]);

  useEffect(() => {
    if (page > 1) {
      const start = (page - 1) * pageSize;
      const end = page * pageSize;
      setPaginatedData((prev) => [...prev, ...mergedData.slice(start, end)]);
    }
  }, [page, mergedData, pageSize]);

  const loadData = () => {
    if (paginatedData.length < mergedData.length) {
      setPage((prev) => prev + 1);
    }
  };

  return { paginatedData, totalSize: mergedData.length, loadData };
};
