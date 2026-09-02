export type FolderSortOption =
  | 'createdAt_desc'
  | 'createdAt_asc'
  | 'name_asc'
  | 'pillCount_desc';

// 폴더 정렬 옵션 목록
export const FOLDER_SORT_OPTIONS: {
  label: string;
  value: FolderSortOption;
}[] = [
  { label: '생성일순 (오래된순)', value: 'createdAt_asc' },
  { label: '최신순', value: 'createdAt_desc' },
  { label: '이름순', value: 'name_asc' },
  { label: '알약 많은 순', value: 'pillCount_desc' },
];

// 폴더 프리뷰 이미지 최대 개수
export const MAX_FOLDER_PREVIEW_IMAGES = 4;

// 폴더 이름 글자 수 제한
export const MIN_FOLDER_NAME_LENGTH = 1;
export const MAX_FOLDER_NAME_LENGTH = 20;

// 기본 정렬 기준
export const DEFAULT_FOLDER_SORT: FolderSortOption = 'name_asc';
