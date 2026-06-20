import { useState, useCallback, useMemo } from 'react';
import { useMarkStore } from '../store/mark_store';
import { MarkData } from '../types/mark_types';
import { getMarkImages } from '@services/database/queries/mark_images';
import {
  INITIAL_LOAD_COUNT,
  ITEMS_PER_PAGE,
} from '@features/pill_identification_search/constants/identificationSearch';
import logger from '@utils/logger';

export const useMarkModal = () => {
  const [modalState, setModalState] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [allMarkData, setAllMarkData] = useState<MarkData[]>([]); // 전체 데이터 (INITIAL_LOAD_COUNT)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentGroup, setCurrentGroup] = useState(0);

  const {
    selectedMarkCode,
    selectedMarkBase64,
    selectedMarkTitle,
    setSelectedMark,
    resetSelectedMark,
  } = useMarkStore();

  const openMarkModal = useCallback(() => {
    resetModalState();
    setModalState(true);
  }, []);

  const closeMarkModal = useCallback(() => {
    setModalState(false);
  }, []);

  const resetModalState = useCallback(() => {
    setSearchText('');
    setAllMarkData([]);
    setError(null);
  }, []);

  // 초기 로드 (INITIAL_LOAD_COUNT 한 번에 가져오기)
  const loadInitialMarks = useCallback(async (keyword: string) => {
    setLoading(true);
    setError(null);
    setAllMarkData([]);
    setCurrentPage(1);
    setCurrentGroup(0);

    try {
      const searchParams = keyword.trim() ? { title: keyword } : {};

      const queryOption = { page: 1, limit: INITIAL_LOAD_COUNT };

      const result = await getMarkImages(searchParams, queryOption);

      setAllMarkData(result);
    } catch (e) {
      logger.error(`Failed to load initial mark data: ${e.estack || e}`);

      setError('마크 검색에 실패했습니다.');

      setAllMarkData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 더 많은 데이터 로드 (INITIAL_LOAD_COUNT 이후)
  const loadMoreData = useCallback(
    async (keyword: string, nextBatch: number) => {
      setLoading(true);

      try {
        const searchParams = keyword.trim() ? { title: keyword } : {};
        const queryOption = { page: nextBatch, limit: INITIAL_LOAD_COUNT };

        const result = await getMarkImages(searchParams, queryOption);

        if (result.length > 0) {
          setAllMarkData((prev) => [...prev, ...result]);
        }
      } catch (e) {
        logger.error(`Failed to load more mark data: ${e.estack || e}`);

        setError('추가 마크 검색에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleSearch = useCallback(async () => {
    if (!searchText.trim()) {
      setError('검색어를 입력해주세요.');
      return;
    }

    await loadInitialMarks(searchText);
  }, [searchText, loadInitialMarks]);

  // 마크 선택 핸들러
  const handleMarkSelect = useCallback(
    (mark: MarkData) => {
      setSelectedMark(mark);
    },
    [setSelectedMark],
  );

  // 선택된 마크 삭제
  const deleteSelectedMark = useCallback(() => {
    resetSelectedMark();
  }, [resetSelectedMark]);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback(
    async (newPage: number) => {
      setCurrentPage(newPage);

      // 현재 로드된 데이터보다 큰 페이지를 요청하면 추가 로드
      const maxLoadedPage = Math.ceil(allMarkData.length / ITEMS_PER_PAGE);

      const shouldLoadMore =
        newPage > maxLoadedPage &&
        allMarkData.length % INITIAL_LOAD_COUNT === 0;

      if (shouldLoadMore) {
        // INITIAL_LOAD_COUNT 단위로 딱 떨어질 때만 추가 로드
        const nextBatch =
          Math.ceil(allMarkData.length / INITIAL_LOAD_COUNT) + 1;

        await loadMoreData(searchText, nextBatch);
      }
    },
    [allMarkData.length, searchText, loadMoreData],
  );

  // 그룹 변경 핸들러 (페이지네이션에서 > 또는 < 클릭 시)
  const handleGroupChange = useCallback(
    async (newGroup: number) => {
      setCurrentGroup(newGroup);

      // 새 그룹의 첫 페이지로 이동
      const newPage = newGroup * 5 + 1;

      setCurrentPage(newPage);

      // 새 페이지에 필요한 데이터가 없으면 로드
      const maxLoadedPage = Math.ceil(allMarkData.length / ITEMS_PER_PAGE);

      if (newPage > maxLoadedPage) {
        const nextBatch =
          Math.ceil(allMarkData.length / INITIAL_LOAD_COUNT) + 1;

        await loadMoreData(searchText, nextBatch);
      }
    },
    [allMarkData.length, searchText, loadMoreData],
  );

  // 현재 페이지에 표시할 데이터
  const getCurrentPageData = useCallback(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex = startIndex + ITEMS_PER_PAGE;

    return allMarkData.slice(startIndex, endIndex);
  }, [allMarkData, currentPage]);

  // 총 페이지 수 (데이터가 INITIAL_LOAD_COUNT 단위로 떨어지면 더 있을 수 있다고 가정)
  const totalPages = useMemo(() => {
    const loadedPages = Math.ceil(allMarkData.length / ITEMS_PER_PAGE);

    // 데이터가 INITIAL_LOAD_COUNT 단위로 딱 떨어지면 더 있을 수 있으므로 +5 페이지 추가
    const isExactBatch =
      allMarkData.length > 0 && allMarkData.length % INITIAL_LOAD_COUNT === 0;

    if (isExactBatch) {
      return loadedPages + 5;
    }

    return loadedPages;
  }, [allMarkData.length]);

  // 마크 선택 여부 체크
  const hasSelectedMark = selectedMarkBase64 !== '';

  return {
    modalState,
    openMarkModal,
    closeMarkModal,
    selectedMarkCode,
    selectedMarkBase64,
    selectedMarkTitle,
    hasSelectedMark,
    deleteSelectedMark,
    searchText,
    setSearchText,
    markDataList: getCurrentPageData(),
    loading,
    error,
    handleSearch,
    handleMarkSelect,
    loadInitialMarks,
    currentPage,
    totalPages,
    currentGroup,
    handlePageChange,
    handleGroupChange,
  };
};
