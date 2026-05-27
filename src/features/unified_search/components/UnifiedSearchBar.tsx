import React, { useState, useCallback, memo } from 'react';
import {
  View,
  TextInput,
  Keyboard,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  Text,
} from 'react-native';
import { IconStyles, styles } from '../styles/unifiedSearchStyles';
import SearchIcon from '@assets/icons/search.svg';
import { CircleXIcon } from 'lucide-react-native';
import { useUnifiedSearch } from '../hooks/useUnifiedSearch';
import { COLOR_GRAY } from '@constants/index';
import FullSizeLoading from '@components/common/FullSizeLoading';

interface IUnifiedSearchBarProps {
  containerStyle?: StyleProp<ViewStyle>;
}

const UnifiedSearchBar = ({ containerStyle }: IUnifiedSearchBarProps) => {
  const [keyword, setKeyword] = useState('');
  const { search, loading } = useUnifiedSearch();

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

  const handleClear = useCallback(() => {
    setKeyword('');
  }, []);

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
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={styles.input}
        placeholder="검색어를 입력하세요"
        value={keyword}
        onChangeText={handleTextChange}
        onSubmitEditing={() => handleSearch()}
        returnKeyType="search"
        placeholderTextColor={COLOR_GRAY[300]}
        multiline={false}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {keyword.length > 0 ? (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <CircleXIcon
            size={IconStyles['clearIcon'].size}
            color={IconStyles['clearIcon'].color}
            strokeWidth={IconStyles['clearIcon'].strokeWidth}
          />
        </TouchableOpacity>
      ) : (
        <SearchIcon
          width={IconStyles['searchIcon'].size}
          height={IconStyles['searchIcon'].size}
          fill={IconStyles['searchIcon'].color}
          style={{ marginTop: -2 }}
        />
      )}
      <FullSizeLoading visible={loading} />
    </View>
  );
};

export default memo(UnifiedSearchBar);
