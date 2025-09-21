import React, { useState, useEffect, useRef } from 'react';
import getMarkData from '@api/client/mark';
import { useSearchIdStore } from '@/store/searchIdStore';
import { useMarkStore } from '@/store/markStore';
import { TMarkData } from '@/types/TApiType';
import MarkModalView from './MarkModalView';

const LIMIT = 20;

const MarkModal = ({ onClose }: { onClose: () => void }) => {
  const searchText = useRef('');
  const [beforeSearchText, setBeforeSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [markDataList, setMarkDataList] = useState<TMarkData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentGroup, setCurrentGroup] = useState(0);

  const { setSearchMark } = useSearchIdStore();
  const { setSelectedMarkBase64 } = useMarkStore();

  const fetchMarkData = async (title: string, pageNum: number) => {
    setLoading(true);
    try {
      const res = await getMarkData(title, LIMIT, pageNum);
      setMarkDataList(res?.markData || []);
      setTotalPages(res?.pages || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkData(beforeSearchText, page);
  }, [page]);

  const handleSearch = () => {
    if (beforeSearchText === searchText.current) return;
    setPage(1);
    setBeforeSearchText(searchText.current);
    setCurrentGroup(0);
    fetchMarkData(searchText.current, 1);
  };

  const markSelected = (item: TMarkData) => {
    setSearchMark(item.code);
    setSelectedMarkBase64(item.base64);
    onClose();
  };

  return (
    <MarkModalView
      loading={loading}
      markDataList={markDataList}
      page={page}
      totalPages={totalPages}
      currentGroup={currentGroup}
      setPage={setPage}
      setCurrentGroup={setCurrentGroup}
      handleSearch={handleSearch}
      markSelected={markSelected}
      onClose={onClose}
      searchText={searchText}
    />
  );
};

export default MarkModal;
