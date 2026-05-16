import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Keyboard,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  Text,
} from 'react-native';
import { styles } from '../styles/unifiedSearchStyles';
import SearchIcon from '@assets/icons/search.svg';
import { useUnifiedSearch } from '../hooks/useUnifiedSearch';
import { COLOR_GRAY } from '@constants/index';
import FullSizeLoading from '@components/common/FullSizeLoading';

interface IUnifiedSearchBarProps {
  containerStyle?: StyleProp<ViewStyle>;
}

const UnifiedSearchBar = ({ containerStyle }: IUnifiedSearchBarProps) => {
  const [keyword, setKeyword] = useState('');
  const keywordRef = useRef('');
  const { search, loading } = useUnifiedSearch();

  const handleSearch = (targetKeyword?: string) => {
    const finalKeyword = (targetKeyword || keywordRef.current).trim();
    if (finalKeyword) {
      Keyboard.dismiss();
      search(finalKeyword);
    }
  };

  const handleClear = () => {
    setKeyword('');
    keywordRef.current = '';
  };

  const handleTextChange = (text: string) => {
    // 엔터(줄바꿈)가 포함되어 들어오면 즉시 검색 실행
    if (text.includes('\n')) {
      const cleanedText = text.replace(/\n/g, '');
      setKeyword(cleanedText);
      keywordRef.current = cleanedText;
      handleSearch(cleanedText);
      return;
    }
    setKeyword(text);
    keywordRef.current = text;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <SearchIcon
        width={18}
        height={18}
        fill={COLOR_GRAY[300]}
        style={styles.searchIcon}
      />
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
      {keyword.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Text style={styles.clearText}>×</Text>
        </TouchableOpacity>
      )}
      <FullSizeLoading visible={loading} />
    </View>
  );
};

export default UnifiedSearchBar;
