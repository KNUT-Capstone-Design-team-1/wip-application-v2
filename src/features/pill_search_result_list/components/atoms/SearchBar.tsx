import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { styles } from '../../styles/atoms/SearchBar';
import SearchIcon from '../../../../../assets/icons/search.svg';
import { usePillSearchResultList } from '../../hooks/use_pill_search_result_list';

const SearchBar = () => {
  const { searchResultButtonClickHandler, clearSearchAndRestore } = usePillSearchResultList();
  const [searchInputText, setSearchInputText] = useState<string>('');

  const handleClearSearch = () => {
    setSearchInputText('');
    clearSearchAndRestore();
  };

  return (
    <View style={styles.searchBarWrapper}>
      <TextInput
        // style={styles.searchInput}
        value={searchInputText}
        onChangeText={(text: string) => setSearchInputText(text)}
        onSubmitEditing={() => searchResultButtonClickHandler(searchInputText)}
        placeholder={'알약 이름을 검색해주세요'}
        returnKeyType="search"
      />

      {/* X 버튼 - 입력된 텍스트가 있을 때만 표시 */}
      {searchInputText.length > 0 && (
        <TouchableOpacity
          onPress={handleClearSearch}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>×</Text>
        </TouchableOpacity>
      )}

      {/* 검색 버튼 */}
      <TouchableOpacity
        onPress={() => searchResultButtonClickHandler(searchInputText)}
        style={styles.searchButton}
      >
        <SearchIcon />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
