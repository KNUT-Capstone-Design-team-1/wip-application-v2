import { RefObject } from 'react';
import { ScrollView } from 'react-native';
import type { createKeywordNavigationStore } from '../store/keyword_navigation_store';
import { createKeywordNavigationController } from '../utils/keyword_navigation_controller';

export interface KeywordNavigationAvailability {
  currentIndex: number;
  totalCount: number;
  canPrevious: boolean;
  canNext: boolean;
}

export type KeywordNavigationDirection = 'first' | 'previous' | 'next';

export interface KeywordAvailabilityOptions {
  targets: readonly KeywordTarget[];
  cursorId: string | null;
  scrollY: number;
  hasMeasured: boolean;
  hasKeywords: boolean;
}

export interface KeywordTarget {
  // 같은 강조 구간으로 이동할 수 있는 키워드 목록.
  keywords: readonly string[];
  id: string;
  y: number;
  reveal?: () => void;
}
export type KeywordMeasure = (
  keywords: readonly string[],
  prepareOnly?: boolean,
) => Promise<KeywordTarget[]>;

export interface KeywordMeasurementOptions {
  getMeasures: () => KeywordMeasure[];
  keywords: readonly string[];
  // 바로 이동할 키워드가 있으면 해당 키워드와 관련된 표만 기다린다.
  prepareKeywords?: readonly string[];
  nextFrame: () => Promise<void>;
  isCancelled: () => boolean;
}

export interface KeywordNavigationOptions {
  onSearchUnavailable: (reason: 'timeout' | 'error') => void;
  getKeywords: () => readonly string[];
  setAvailability: (availability: KeywordNavigationAvailability) => void;
  getViewportY: () => Promise<number>;
  scrollTo: (y: number) => void;
  nextFrame: () => Promise<void>;
}

export interface KeywordMatch {
  // 겹친 일치 구간을 하나로 묶어도 각 키워드의 탐색 경로를 보존한다.
  keywords: string[];
  keyword: string;
  start: number;
  end: number;
}

export interface TextLine {
  text: string;
  y: number;
}

export interface KeywordTextLineRange {
  start: number;
  end: number;
  y: number;
}

export interface KeywordSearchRequest {
  query: string;
}

export interface KeywordNavigationState extends KeywordNavigationAvailability {
  keywords: string[];
  isSearchOpen: boolean;
  searchQuery: string;
  searchRequest: KeywordSearchRequest | null;
  requestSearch: (query: string) => void;
  setSearchOpen: (isSearchOpen: boolean) => void;
  setSearchQuery: (searchQuery: string) => void;
  setAvailability: (availability: KeywordNavigationAvailability) => void;
}

export type KeywordNavigationStore = ReturnType<
  typeof createKeywordNavigationStore
>;

export interface KeywordNavigationScope {
  store: KeywordNavigationStore;
  scrollRef: RefObject<ScrollView | null>;
  controller: ReturnType<typeof createKeywordNavigationController>;
}
