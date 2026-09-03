// 마크 이미지 데이터 모델
export interface MarkData {
  // 마크 코드
  code: string;

  // 마크 설명/이름
  title: string;

  // Base64 인코딩 이미지 문자열
  base64: string;
}

export type IMarkData = MarkData;

// 마크 검색 파라미터 모델
export interface MarkSearchParams {
  // 검색 키워드
  keyword: string;

  // 페이지 번호
  page: number;

  // 페이지당 건수
  limit?: number;
}

// 마크 검색 결과 모델
export interface MarkSearchResponse {
  // 마크 목록
  data: MarkData[];

  // 총 페이지 수
  totalPages: number;

  // 현재 페이지 번호
  currentPage: number;

  // 전체 검색 결과 수
  totalCount: number;
}

// 마크 선택 모달 컴포넌트 Props 인터페이스
export interface IMarkModalProps {
  // 닫기 핸들러
  onClose: () => void;

  // 검색 텍스트
  searchText: string;

  // 검색 텍스트 변경 핸들러
  setSearchText: (text: string) => void;

  // 표시할 마크 데이터 목록
  markDataList: MarkData[];

  // 로딩 상태 여부
  loading: boolean;

  // 에러 메시지
  error: string | null;

  // 검색 실행 핸들러
  handleSearch: () => void;

  // 마크 선택 핸들러
  handleMarkSelect: (mark: MarkData) => void;

  // 초기 마크 로드 함수
  loadInitialMarks: (keyword: string) => Promise<void>;

  // 현재 페이지 번호
  currentPage: number;

  // 전체 페이지 수
  totalPages: number;

  // 현재 페이지 그룹
  currentGroup: number;

  // 페이지 변경 핸들러
  handlePageChange: (page: number) => void;

  // 페이지 그룹 변경 핸들러
  handleGroupChange: (group: number) => void;
}
