import { usePathname } from 'expo-router';
import SearchBarHeader from '@features/shared/components/SearchBarHeader';
import UnifiedSearchBar from '@features/unified_search/components/UnifiedSearchBar';

const SearchHeader = () => {
  const pathname = usePathname();

  return (
    <SearchBarHeader>
      <UnifiedSearchBar focus={pathname === '/unified-search'} />
    </SearchBarHeader>
  );
};

export default SearchHeader;
