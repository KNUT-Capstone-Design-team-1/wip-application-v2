import Layout from "@/components/organisms/Layout";
import SearchResultList from "@/components/organisms/SearchResultList";
import { useGetSearchData } from "@/hooks/useGetSearchData";
import { useSetScreen } from "@/hooks/useSetScreen";

const SearchResult = (): JSX.Element => {
    useSetScreen('검색 결과');

    return (
        <Layout.default>
            <SearchResultList />
        </Layout.default>
    )
}

export default SearchResult;