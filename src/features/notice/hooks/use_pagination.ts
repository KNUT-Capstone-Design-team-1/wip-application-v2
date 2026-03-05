import { useState, useMemo } from 'react';
import {
  IUsePaginationProps,
  IUsePaginationReturn,
} from '../types/notice_type';

export const usePagination = <T>({
  data,
  itemsPerPage,
}: IUsePaginationProps<T>): IUsePaginationReturn<T> => {
  const [currentPage, setCurrentPage] = useState(0);

  // 전체 페이지 수 계산
  const totalPages = useMemo(
    () => Math.ceil(data.length / itemsPerPage),
    [data.length, itemsPerPage],
  );

  // 현재 페이지에 표시할 데이터 추출
  const currentData = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // 이전 페이지로 이동
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 특정 페이지로 이동
  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    totalPages,
    currentData,
    handlePrevious,
    handleNext,
    goToPage,
  };
};
