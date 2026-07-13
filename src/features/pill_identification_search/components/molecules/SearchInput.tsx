import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { COLOR, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { styles } from '../../styles/molecules/SearchInput';
import { Search } from 'lucide-react-native';
import { fontPx } from '@utils/responsive';

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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.searchContainer,
        disabled && styles.searchContainerDisabled,
        isFocused
          ? { borderColor: COLOR['primary'] }
          : { borderColor: COLOR_LINE['border'] },
      ]}
    >
      <TextInput
        maxLength={50}
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={COLOR_TEXT['disabled']}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSearch}
        returnKeyType="search"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={!disabled}
      />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={onSearch}
        disabled={disabled}
      >
        <Search size={fontPx(18)} strokeWidth={2} color={COLOR_TEXT['sub']} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
