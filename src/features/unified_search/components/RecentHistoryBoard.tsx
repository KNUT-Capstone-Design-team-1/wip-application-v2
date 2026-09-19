import React, { useState, useCallback, memo } from 'react';
import { View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { BaseText } from '@components/common/BaseText';
import { TRecentViewedPill } from '@common_types/recent_viewed_pill';
import { styles } from '../styles/recentHistoryBoardStyles';
import { useRecentViewedPillStore } from '@store/recent_viewed_pill_store';
import { useRecentKeywordStore } from '@store/recent_keyword_store';
import { useRecentHistory } from '../hooks/useRecentHistory';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RecentHistoryListItem from './molecules/RecentHistoryListItem';
import { useUnifiedSearch } from '../hooks/useUnifiedSearch';
import { useRouter } from 'expo-router';

export type THistoryTab = 'KEYWORD' | 'PILL';

export interface IRecentHistoryBoardProps {
  containerStyle?: StyleProp<ViewStyle>;
  initialTab?: THistoryTab;
  onTabChange?: (tab: THistoryTab) => void;
}

const TABS: { key: THistoryTab; label: string }[] = [
  { key: 'KEYWORD', label: '최근 검색어' },
  { key: 'PILL', label: '최근 조회한 알약' },
];

const RecentHistoryBoard = ({
  containerStyle,
  initialTab = 'KEYWORD',
  onTabChange,
}: IRecentHistoryBoardProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [internalTab, setInternalTab] = useState<THistoryTab>(initialTab);
  const { handlePressRemoveRecentKeyword, handlePressRemoveRecentViewedPill } =
    useRecentHistory();
  const { search } = useUnifiedSearch();

  const recentPills = useRecentViewedPillStore(
    (state) => state.recentViewedPills,
  );
  const recentKeywords = useRecentKeywordStore((state) => state.keywords);

  const handleTabPress = useCallback(
    (tab: THistoryTab) => {
      setInternalTab(tab);
      onTabChange?.(tab);
    },
    [onTabChange],
  );

  // 최근 검색어 기본 플레이스홀더 (아이템 컴포넌트는 추후 직접 구현)
  const renderKeywordItem: ListRenderItem<string> = useCallback(
    ({ item }) => (
      <RecentHistoryListItem
        text={item}
        onPress={() => {
          search(item);
        }}
        onRemove={() => handlePressRemoveRecentKeyword(item)}
      />
    ),
    [handlePressRemoveRecentKeyword],
  );

  // 최근 조회한 알약 기본 플레이스홀더 (아이템 컴포넌트는 추후 직접 구현)
  const renderPillItem: ListRenderItem<TRecentViewedPill> = useCallback(
    ({ item }) => (
      <RecentHistoryListItem
        text={item.ITEM_NAME}
        onPress={() => {
          router.push({
            pathname: '/pill-search-result-detail',
            params: { ITEM_SEQ: item.ITEM_SEQ },
          });
        }}
        onRemove={() => handlePressRemoveRecentViewedPill(item.ITEM_SEQ)}
      />
    ),
    [handlePressRemoveRecentViewedPill],
  );

  const keywordKeyExtractor = useCallback(
    (item: string, index: number) => `keyword_${item}_${index}`,
    [],
  );

  const pillKeyExtractor = useCallback(
    (item: TRecentViewedPill, index: number) =>
      `pill_${item.ITEM_SEQ}_${index}`,
    [],
  );

  const isKeywordTab = internalTab === 'KEYWORD';

  return (
    <View style={[styles.container, containerStyle]}>
      {/* 상단 탭바 영역 */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isSelected = internalTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, isSelected && styles.tabItemSelected]}
              onPress={() => handleTabPress(tab.key)}
              activeOpacity={0.7}
            >
              <BaseText
                size={14}
                weight={isSelected ? 'bold' : 'medium'}
                style={[
                  styles.tabText,
                  isSelected
                    ? styles.tabTextSelected
                    : styles.tabTextUnselected,
                ]}
              >
                {tab.label}
              </BaseText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 내부 리스트 (FlashList) */}
      <View style={styles.listWrapper}>
        {isKeywordTab ? (
          <FlashList
            data={recentKeywords}
            renderItem={renderKeywordItem}
            keyExtractor={keywordKeyExtractor}
            contentContainerStyle={[
              styles.listContentContainer,
              { paddingBottom: insets.bottom },
            ]}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <BaseText size={14} weight="semiBold" style={styles.emptyText}>
                  최근 검색어가 없습니다.
                </BaseText>
              </View>
            }
            keyboardDismissMode="none"
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          <FlashList
            data={recentPills}
            renderItem={renderPillItem}
            keyExtractor={pillKeyExtractor}
            contentContainerStyle={[
              styles.listContentContainer,
              { paddingBottom: insets.bottom },
            ]}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <BaseText size={14} weight="semiBold" style={styles.emptyText}>
                  최근 조회한 알약이 없습니다.
                </BaseText>
              </View>
            }
            keyboardDismissMode="none"
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    </View>
  );
};

export default memo(RecentHistoryBoard);
