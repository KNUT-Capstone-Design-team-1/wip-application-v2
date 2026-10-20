import { RefObject } from 'react';
import { ScrollView } from 'react-native';
import type { createKeywordNavigationStore } from '../store/keyword_navigation_store';
import { createKeywordNavigationController } from '../utils/keyword_navigation_controller';

export interface KeywordNavigationAvailability {
  canPrevious: boolean;
  canNext: boolean;
}

export interface KeywordTarget {
  kind?: 'section';
  id: string;
  keyword: string;
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
  nextFrame: () => Promise<void>;
  isCancelled: () => boolean;
}

export interface KeywordNavigationOptions {
  getKeywords: () => readonly string[];
  setAvailability: (availability: KeywordNavigationAvailability) => void;
  getViewportY: () => Promise<number>;
  scrollTo: (y: number) => void;
  nextFrame: () => Promise<void>;
}

export interface KeywordMatch {
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

export interface KeywordNavigationState extends KeywordNavigationAvailability {
  keywords: string[];
  isVisible: boolean;
  isSearchOpen: boolean;
  searchQuery: string;
  warningKeywords: string[];
  setSearchOpen: (isSearchOpen: boolean) => void;
  setSearchQuery: (searchQuery: string) => void;
  setKeywords: (keywords: string[]) => void;
  setVisible: (isVisible: boolean) => void;
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
