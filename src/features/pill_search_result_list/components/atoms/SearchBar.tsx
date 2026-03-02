import { View, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/atoms/SearchBar';
import SearchIcon from '../../../../../assets/icons/search.svg';

const SearchBar = () => {
  return (
    <View style={styles.searchBarWrapper}>
      <TextInput placeholder={'알약 이름을 검색해주세요'} />
      <TouchableOpacity
        onPress={(event) => console.log('검색')}
        style={styles.searchButton}
      >
        <SearchIcon />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
