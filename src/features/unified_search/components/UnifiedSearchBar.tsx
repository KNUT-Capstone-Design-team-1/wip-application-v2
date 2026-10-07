import { useState, useCallback, memo } from 'react';
import { Keyboard, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import SearchInput from '@features/shared/components/SearchInput';
import { useUnifiedSearch } from '../hooks/useUnifiedSearch';

interface IUnifiedSearchBarProps {
  containerStyle?: StyleProp<ViewStyle>;
  focus?: boolean;
}

const UnifiedSearchBar = ({
  containerStyle,
  focus = false,
}: IUnifiedSearchBarProps) => {
  const [keyword, setKeyword] = useState('');
  const { search } = useUnifiedSearch();

  const handleSearch = useCallback(
    (targetKeyword?: string) => {
      const finalKeyword = (targetKeyword ?? keyword).trim();

      if (finalKeyword) {
        Keyboard.dismiss();
        search(finalKeyword);
      }
    },
    [keyword, search],
  );

  const handleTextChange = useCallback(
    (text: string) => {
      // 엔터(줄바꿈)가 포함되어 들어오면 즉시 검색 실행
      if (text.includes('\n')) {
        const cleanedText = text.replace(/\n/g, '');

        setKeyword(cleanedText);
        handleSearch(cleanedText);

        return;
      }
      setKeyword(text);
    },
    [handleSearch],
  );

  return (
    <SearchInput
      value={keyword}
      onChangeText={handleTextChange}
      onSubmit={() => handleSearch()}
      placeholder="검색어를 입력하세요"
      autoFocus={focus}
      maxLength={50}
      containerStyle={[styles.grow, containerStyle]}
    />
  );
};

const styles = StyleSheet.create({
  // 헤더 등 가로 공간을 채우기 위한 확장 (기존 UnifiedSearchBar 동작 유지)
  grow: {
    flexGrow: 1,
  },
});

export default memo(UnifiedSearchBar);
