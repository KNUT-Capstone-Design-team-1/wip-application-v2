import { TextInput, TouchableOpacity, View } from 'react-native';
import { useStore } from 'zustand';
import { BaseText } from '@components/common/BaseText';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { useDetailFind } from '../../hooks/use_detail_find';
import { useKeywordNavigationContext } from '../../hooks/use_keyword_navigation_context';
import { styles } from '../../styles/molecules/DetailFindBar';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react-native';

// 검색 입력과 결과·탐색 버튼을 표시한다.
const DetailFindForm = () => {
  const { store } = useKeywordNavigationContext();
  const canPrevious = useStore(store, (state) => state.canPrevious);
  const canNext = useStore(store, (state) => state.canNext);
  const {
    query,
    searching,
    matchCount,
    hasSearched,
    search,
    updateQuery,
    close,
    previous,
    next,
  } = useDetailFind();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          autoFocus
          value={query}
          onChangeText={updateQuery}
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
          onPress={previous}
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
          onPress={next}
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

// 검색 열림 상태에 따라 폼을 표시한다.
const DetailFindBar = () => {
  const { store } = useKeywordNavigationContext();
  const isOpen = useStore(store, (state) => state.isSearchOpen);

  return isOpen ? <DetailFindForm /> : null;
};

export default DetailFindBar;
