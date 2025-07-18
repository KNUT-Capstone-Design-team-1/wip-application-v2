import { useState, useEffect } from 'react';
import { useQuery } from '@realm/react';
import { PillData, TPillData } from '@/api/db/models/pillData';
import { calcCosineSimilarity, textToVector } from '@/utils/similarity';
import { deepCopyRealmObj } from '@/utils/converter';
import { useRecoilValue } from 'recoil';
import { searchFilterParams } from '@/selectors/query';

//TODO: 데이터를 가져오는 과정을 비동기로 처리하기
export const useGetPillData = (pageSize: number) => {
  const queryRecog = useQuery(PillData);
  const { filter, params, initData } = useRecoilValue(searchFilterParams);

  const [page, setPage] = useState(1);
  const [totalSize, setTotalSize] = useState(0);
  const [paginatedData, setPaginatedData] = useState<TPillData[]>([]);
  const [mergedData, setMergedData] = useState<TPillData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mergeData = async () => {
    if (filter === undefined || params === undefined) {
      setMergedData([]);
      setTotalSize(0);
      return;
    }

    const recogFilter =
      params.length == 0 ? queryRecog : queryRecog.filtered(filter, ...params);
    let recogArr;

    if (initData.PRINT_FRONT + initData.PRINT_BACK != '') {
      const initVector = textToVector(
        initData.PRINT_FRONT + initData.PRINT_BACK,
      );

      recogArr = recogFilter
        .map((val) => {
          const recogObj = deepCopyRealmObj(val) as TPillData;
          recogObj.SIMILARITY =
            (((recogObj.PRINT_FRONT as string) +
              recogObj.PRINT_BACK) as string) != ''
              ? calcCosineSimilarity(initVector, recogObj.VECTOR as number[])
              : 0;
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

    setMergedData(recogArr);
    setTotalSize(recogArr.length);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await mergeData();
    };

    fetchData();

    return () => {
      setMergedData([]);
      setPaginatedData([]);
      setPage(1);
    };
  }, [filter, params]);

  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    setPaginatedData((prev) => [...prev, ...mergedData.slice(start, end)]);
  }, [page, mergedData, pageSize]);

  const loadData = () => {
    if (paginatedData.length < mergedData.length) {
      setPage((prev) => prev + 1);
    }
  };

  return { paginatedData, totalSize, loadData, isLoading };
};
