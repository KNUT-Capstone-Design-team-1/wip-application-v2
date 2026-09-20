import { create } from 'zustand';
import { ISearchResultListStore } from '@features/pill_search_result_list/types/pill_search_result_list';
import { IPillData, TPillDataSearchParam } from '@services/database/types';

//  알약 검색 결과 리스트 상태 관리 스토어
export const useSearchResultListStore = create<ISearchResultListStore>(
  (set, get) => ({
    searchResultData: [], // 검색된 알약 데이터 리스트
    isLoading: false, // 로딩 상태 (검색 중)
    searchParam: null, // 현재 적용된 검색 파라미터
    markImages: [], // 검색 조건에 포함된 마크 이미지 정보
    currentPage: 1, // 현재 로드된 페이지 번호
    hasMore: true, // 추가 로드 가능한 데이터 존재 여부
    totalDataCount: 0, // 총 검색 결과 데이터 수
    nextCursor: null, // 다음 페이지 조회를 위한 커서 토큰

    //  새로운 검색 파라미터 설정 및 페이지네이션 정보 초기화
    setSearchParam: (param: Partial<TPillDataSearchParam> | null) =>
      set({
        searchParam: param,
        currentPage: 1,
        hasMore: true,
        nextCursor: null,
      }),

    //  식별 마크 이미지 리스트 업데이트
    setMarkImages: (images) =>
      set({
        markImages: images,
      }),

    //  전체 검색 결과 데이터 설정 (새로운 검색 결과로 덮어쓰기)
    setSearchResultData: (resultData: IPillData[]) =>
      set({
        searchResultData: resultData,
      }),

    //  새로운 검색 시작 시 이전 결과/카운트/페이지네이션 초기화 및 로딩 시작
    resetSearchResults: () =>
      set({
        searchResultData: [],
        totalDataCount: 0,
        currentPage: 1,
        hasMore: true,
        nextCursor: null,
        isLoading: true,
      }),

    /**
     * 총 검색 결과 데이터 수 설정
     * @param totalDataCount
     */
    setTotalDataCount: (totalDataCount: number) =>
      set({
        totalDataCount,
      }),

    // 다음 페이지 조회를 위한 커서 토큰 설정
    setNextCursor: (nextCursor: string | null) =>
      set({
        nextCursor,
      }),

    // 추가 로드 가능 여부 설정
    setHasMore: (hasMore: boolean) =>
      set({
        hasMore,
      }),

    //  기존 검색 결과에 새로운 데이터 추가 (무한 스크롤용)
    appendSearchResultData: (newData: IPillData[]) =>
      set((state) => ({
        searchResultData: [...state.searchResultData, ...newData],
        isLoading: false,
      })),

    //  로딩 상태 변경
    setIsLoading: (loading: boolean) =>
      set({
        isLoading: loading,
      }),

    //  현재 저장된 검색 결과 데이터 반환
    getSearchResultData: () => get().searchResultData,

    //  현재 저장된 검색 파라미터 반환
    getSearchParam: () => get().searchParam,
  }),
);
