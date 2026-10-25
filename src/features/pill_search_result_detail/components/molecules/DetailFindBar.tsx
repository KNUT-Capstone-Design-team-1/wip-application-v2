import { useEffect, useRef } from 'react';
import { Keyboard, TextInput, TouchableOpacity, View } from 'react-native';
import { useStore } from 'zustand';
import { COLOR_TEXT } from '@constants/color';
import { fontPx, px } from '@utils/responsive';
import { useDetailFind } from '../../hooks/use_detail_find';
import { useKeywordNavigationContext } from '../../hooks/use_keyword_navigation_context';
import { styles } from '../../styles/molecules/DetailFindBar';
import { CircleX, Search } from 'lucide-react-native';

// 검색 입력과 검색어 초기화 버튼을 표시한다.
const DetailFindForm = () => {
  const { store } = useKeywordNavigationContext();
  const searchRequest = useStore(store, (state) => state.searchRequest);
  const { query, search, updateQuery } = useDetailFind();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidHide', () => {
      inputRef.current?.blur();
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (searchRequest) inputRef.current?.blur();
  }, [searchRequest]);

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          autoFocus={!searchRequest}
          value={query}
          onChangeText={updateQuery}
          multiline={false}
          onSubmitEditing={(event) => {
            void search(event.nativeEvent.text);
          }}
          placeholder="상세 정보 내 검색"
          placeholderTextColor={COLOR_TEXT.sub}
          accessibilityLabel="본문 검색어"
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.input}
        />
        <View style={styles.rightIcon}>
          {query.length > 0 ? (
            <TouchableOpacity
              style={styles.clearButton}
              hitSlop={6}
              onPress={() => updateQuery('')}
              accessibilityRole="button"
              accessibilityLabel="검색어 지우기"
              accessibilityHint="검색창을 유지하고 입력한 검색어를 지웁니다"
            >
              <CircleX
                size={fontPx(16)}
                color={COLOR_TEXT.sub}
                strokeWidth={px(2)}
              />
            </TouchableOpacity>
          ) : (
            <Search
              size={fontPx(16)}
              color={COLOR_TEXT.sub}
              strokeWidth={px(2)}
            />
          )}
        </View>
      </View>
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
