import { useCallback, useEffect, useRef, useState } from "react";
import { TMarkData } from '@/types/TApiType';
import { useSearchIdStore } from '@store/searchIdStore';
import { useMarkStore } from '@store/markStore';
import getMarkData from '@api/client/mark';

const LIMIT = 20;

export const useMarkModal = () => {
  const searchText = useRef('');
  const [beforeSearchText, setBeforeSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [markDataList, setMarkDataList] = useState<TMarkData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentGroup, setCurrentGroup] = useState(0);

  const { setSearchMark } = useSearchIdStore();
  const { setSelectedMarkBase64, setSelectedMarkTitle } = useMarkStore();

  const fetchMarkData = useCallback(async (title: string, pageNum: number) => {
    setLoading(true);
    try {
      const res = await getMarkData(title, LIMIT, pageNum);
      setMarkDataList(res?.markData || []);
      setTotalPages(res?.pages || 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkData(beforeSearchText, page);
  }, [page]);

  const handleSearch = useCallback(() => {
    if (beforeSearchText === searchText.current) return;
    setPage(1);
    setBeforeSearchText(searchText.current);
    setCurrentGroup(0);
    fetchMarkData(searchText.current, 1);
  }, [beforeSearchText, searchText, fetchMarkData]);

  return {
    searchText,
    page,
    setPage,
    currentGroup,
    setCurrentGroup,
    markDataList,
    loading,
    totalPages,
    handleSearch,
    setSearchMark,
    setSelectedMarkBase64,
    setSelectedMarkTitle,
  };
};
