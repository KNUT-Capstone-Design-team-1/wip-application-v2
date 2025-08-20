import Layout from '@/components/organisms/Layout';
import SearchResultList from '@/components/organisms/SearchResultList';
import { useGetSearchData } from '@/hooks/useGetSearchData';
import { useSetScreen } from '@/hooks/useSetScreen';

const SearchResult = (): React.JSX.Element => {
  useSetScreen('검색 결과');

  useGetSearchData();

  return (
    <Layout.default>
      <SearchResultList />
    </Layout.default>
  );
};

export default SearchResult;
