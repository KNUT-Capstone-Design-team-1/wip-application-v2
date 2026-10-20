import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, TextInput, TouchableOpacity, View } from 'react-native';
import { useStore } from 'zustand';
import { BaseText } from '@components/common/BaseText';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { useKeywordNavigationContext } from '../../hooks/use_keyword_navigation_context';
import { styles } from '../../styles/molecules/DetailFindBar';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react-native';

const DetailFindForm = () => {
  const { store, controller } = useKeywordNavigationContext();
  const canPrevious = useStore(store, (state) => state.canPrevious);
  const canNext = useStore(store, (state) => state.canNext);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const request = useRef(0);

  useEffect(
    () => () => {
      request.current++;
      controller.cancel();
    },
    [controller],
  );

  const search = useCallback(async () => {
    const value = query.trim();
    if (!value) return;
    Keyboard.dismiss();
    const id = ++request.current;
    setSearching(true);
    setHasSearched(false);
    store.getState().setSearchQuery(value);
    store.getState().setVisible(true);
    try {
      const count = await controller.jump(value);
      if (id === request.current) {
        setHasSearched(true);
        setMatchCount(count ?? null);
      }
    } finally {
      if (id === request.current) setSearching(false);
    }
  }, [query, store, controller]);

  const close = () => {
    request.current++;
    controller.cancel();
    store.getState().setSearchOpen(false);
    store.getState().setSearchQuery('');
    store.getState().setVisible(false);
    setQuery('');
    setSearching(false);
    setHasSearched(false);
    setMatchCount(null);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          autoFocus
          value={query}
          onChangeText={(value) => {
            request.current++;
            controller.cancel();
            setQuery(value);
            setSearching(false);
            setHasSearched(false);
            store.getState().setSearchQuery('');
          }}
          onSubmitEditing={search}
          placeholder="상세 정보에서 찾기"
          placeholderTextColor={COLOR_TEXT.sub}
          accessibilityLabel="본문 검색어"
          returnKeyType="search"
          autoCorrect={false}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={search}
          disabled={!query.trim() || searching}
          accessibilityRole="button"
          accessibilityLabel="본문 검색"
        >
          <Search size={fontPx(20)} color={COLOR_TEXT.body} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => controller.previous()}
          disabled={!hasSearched || searching || !canPrevious}
          accessibilityRole="button"
          accessibilityLabel="이전 검색 결과"
          accessibilityState={{
            disabled: !hasSearched || searching || !canPrevious,
          }}
        >
          <ChevronUp
            size={fontPx(20)}
            color={
              hasSearched && canPrevious ? COLOR_TEXT.body : COLOR_TEXT.disabled
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => controller.next()}
          disabled={!hasSearched || searching || !canNext}
          accessibilityRole="button"
          accessibilityLabel="다음 검색 결과"
          accessibilityState={{
            disabled: !hasSearched || searching || !canNext,
          }}
        >
          <ChevronDown
            size={fontPx(20)}
            color={
              hasSearched && canNext ? COLOR_TEXT.body : COLOR_TEXT.disabled
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="본문 검색 닫기"
        >
          <X size={fontPx(20)} color={COLOR_TEXT.body} />
        </TouchableOpacity>
      </View>
      {searching || hasSearched ? (
        <BaseText
          size={11}
          style={styles.message}
          accessibilityLiveRegion="polite"
        >
          {searching
            ? '검색 중…'
            : matchCount === 0
              ? '검색 결과가 없습니다.'
              : matchCount + '개의 검색 결과'}
        </BaseText>
      ) : null}
    </View>
  );
};

const DetailFindBar = () => {
  const { store } = useKeywordNavigationContext();
  const isOpen = useStore(store, (state) => state.isSearchOpen);
  return isOpen ? <DetailFindForm /> : null;
};

export default DetailFindBar;
