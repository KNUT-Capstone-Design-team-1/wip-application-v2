// 페이지네이션 컴포넌트 Props 인터페이스
export interface IPaginationProps {
  // 전체 페이지 수
  totalPages: number;

  // 현재 페이지 번호
  page: number;

  // 페이지 변경 함수
  setPage: (page: number) => void;

  // 현재 페이지 그룹 번호
  currentGroup: number;

  // 페이지 그룹 변경 함수
  setCurrentGroup: (group: number) => void;
}
