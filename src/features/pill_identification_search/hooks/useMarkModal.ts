import { useState, useCallback, useMemo } from 'react';
import { useMarkStore } from '../store/mark_store';
import { MarkData } from '../types/identification_mark_type';
import { markSearchService } from '../services/mark_search_service';
import {
  INITIAL_LOAD_COUNT,
  ITEMS_PER_PAGE,
} from '@features/pill_identification_search/constants/identificationSearch';
import logger from '@utils/logger';

// 식별 마크 선택 모달 상태 및 검색/페이징을 관리하는 커스텀 훅 (Presentation Layer)
export const useMarkModal = () => {
  const [modalState, setModalState] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [allMarkData, setAllMarkData] = useState<MarkData[]>([]);
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

  // 모달 상태 초기화
  const resetModalState = useCallback(() => {
    setSearchText('');
    setAllMarkData([]);
    setError(null);
  }, []);

  // 마크 모달 열기
  const openMarkModal = useCallback(() => {
    resetModalState();
    setModalState(true);
  }, [resetModalState]);

  // 마크 모달 닫기
  const closeMarkModal = useCallback(() => {
    setModalState(false);
  }, []);

  // 초기 마크 데이터 로드
  const loadInitialMarks = useCallback(async (keyword: string) => {
    setLoading(true);
    setError(null);
    setAllMarkData([]);
    setCurrentPage(1);
    setCurrentGroup(0);

    try {
      const result = await markSearchService.getMarks(
        keyword,
        1,
        INITIAL_LOAD_COUNT,
      );

      setAllMarkData(result);
    } catch (e) {
      logger.error(`Failed to load initial mark data: ${e}`);
      setError('마크 검색에 실패했습니다.');
      setAllMarkData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 더 많은 마크 데이터 추가 로드
  const loadMoreData = useCallback(
    async (keyword: string, nextBatch: number) => {
      setLoading(true);

      try {
        const result = await markSearchService.getMarks(
          keyword,
          nextBatch,
          INITIAL_LOAD_COUNT,
        );

        const hasMore = result.length > 0;

        if (hasMore) {
          setAllMarkData((prev) => [...prev, ...result]);
        }
      } catch (e) {
        logger.error(`Failed to load more mark data: ${e}`);
        setError('추가 마크 검색에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 검색어 기반 검색 실행 핸들러
  const handleSearch = useCallback(async () => {
    const isKeywordEmpty = !searchText.trim();

    if (isKeywordEmpty) {
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

  // 선택된 마크 삭제 핸들러
  const deleteSelectedMark = useCallback(() => {
    resetSelectedMark();
  }, [resetSelectedMark]);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback(
    async (newPage: number) => {
      setCurrentPage(newPage);

      const maxLoadedPage = Math.ceil(allMarkData.length / ITEMS_PER_PAGE);

      const shouldLoadMore =
        newPage > maxLoadedPage &&
        allMarkData.length % INITIAL_LOAD_COUNT === 0;

      if (shouldLoadMore) {
        const nextBatch =
          Math.ceil(allMarkData.length / INITIAL_LOAD_COUNT) + 1;

        await loadMoreData(searchText, nextBatch);
      }
    },
    [allMarkData.length, searchText, loadMoreData],
  );

  // 페이지 그룹 변경 핸들러 (> 또는 < 클릭 시)
  const handleGroupChange = useCallback(
    async (newGroup: number) => {
      setCurrentGroup(newGroup);

      const newPage = newGroup * 5 + 1;
      setCurrentPage(newPage);

      const maxLoadedPage = Math.ceil(allMarkData.length / ITEMS_PER_PAGE);

      if (newPage > maxLoadedPage) {
        const nextBatch =
          Math.ceil(allMarkData.length / INITIAL_LOAD_COUNT) + 1;

        await loadMoreData(searchText, nextBatch);
      }
    },
    [allMarkData.length, searchText, loadMoreData],
  );

  // 현재 페이지에 표시할 마크 데이터 슬라이스
  const getCurrentPageData = useCallback(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return allMarkData.slice(startIndex, endIndex);
  }, [allMarkData, currentPage]);

  // 총 페이지 수 계산
  const totalPages = useMemo(() => {
    return markSearchService.calculateTotalPages(allMarkData.length);
  }, [allMarkData.length]);

  // 마크 선택 여부 플래그
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
