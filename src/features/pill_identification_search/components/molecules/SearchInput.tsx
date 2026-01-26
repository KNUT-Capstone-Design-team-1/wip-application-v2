import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { COLOR_GRAY } from '@/src/constants';
import { styles } from '../../styles/molecules/SearchInput';

interface ISearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const SearchInput = ({
  value,
  onChangeText,
  onSearch,
  placeholder = '검색어를 입력하세요',
  disabled = false,
}: ISearchInputProps) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={[styles.searchInput, disabled && styles.searchInputDisabled]}
        placeholder={placeholder}
        placeholderTextColor={COLOR_GRAY[200]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSearch}
        returnKeyType="search"
        editable={!disabled}
      />
      <TouchableOpacity
        style={[styles.searchButton, disabled && styles.searchButtonDisabled]}
        onPress={onSearch}
        disabled={disabled}
      >
        <Text style={styles.searchButtonText}>검색</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
