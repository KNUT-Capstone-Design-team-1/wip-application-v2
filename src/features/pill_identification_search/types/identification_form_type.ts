import { ISearchPillData } from './identification_domain_type';

// 식별 검색 폼 상태 인터페이스
export interface ISearchIdState {
  // 전면 식별문자
  sideLabelFrontText: string;

  // 후면 식별문자
  sideLabelBackText: string;

  // 의약품명
  productNameText: string;

  // 제약업체명
  companyName: string;

  // 제형 구분 (정제, 경질캡슐 등)
  manufacturerName: string[] | null;

  // 분할선 데이터 (전면/후면)
  dividerLineData: string[] | null;

  // 모양 데이터 (원형, 타원형 등)
  shape: string[] | null;

  // 색상 데이터
  colors: string[] | null;

  // 전면 마크 코드
  markCodeFront: string;

  // 후면 마크 코드
  markCodeBack: string;

  // 완전 일치 검색 여부
  isExactMatch: boolean;
}

// 식별 검색 스토어 액션 인터페이스
export interface ISearchIdActions {
  setSideLabelFrontText: (value: string) => void;
  setSideLabelBackText: (value: string) => void;
  setProductNameText: (value: string) => void;
  setCompanyName: (value: string) => void;
  setManufacturerName: (arr: string[] | null) => void;
  setDividerLineData: (arr: string[] | null) => void;
  setShape: (arr: string[] | null) => void;
  setColors: (arr: string[] | null) => void;
  setMarkCodeFront: (value: string) => void;
  setMarkCodeBack: (value: string) => void;
  setIsExactMatch: (value: boolean) => void;
  resetSelectedSearchId: () => void;
  getSelectedSearchId: () => ISearchPillData;
}

// 식별 검색 Zustand 스토어 타입
export interface ISearchIdStore extends ISearchIdState, ISearchIdActions {}

// 식별 검색 폼 섹션 아이템 데이터 모델
export interface IIdentificationSectionData {
  key?: string;
  placeholder?: string;
  width?: string | number;
  parsingDataName?: string;
  iconUrl?: any;
  iconColor?: string;
  label?: string;
  value?: string | null;
}

// 식별 검색 폼 섹션 그룹 모델
export interface IIdentificationSection {
  type: 'textInput' | 'iconButton' | 'other';
  title: string;
  datas?: IIdentificationSectionData[];
}

// 전체 식별 검색 폼 데이터 구성
export interface IIdentificationSearchData {
  [key: string]: IIdentificationSection;
}
