import { RefObject } from 'react';
import { ScrollView } from 'react-native';
import { KeywordNavigationStore } from '../store/keyword_navigation_store';
import { createKeywordNavigationController } from '../utils/keyword_navigation_controller';

export interface KeywordNavigationScope {
  store: KeywordNavigationStore;
  scrollRef: RefObject<ScrollView | null>;
  controller: ReturnType<typeof createKeywordNavigationController>;
}
