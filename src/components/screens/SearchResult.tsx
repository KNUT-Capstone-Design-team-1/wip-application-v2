import Layout from "@/components/organisms/Layout";
import SearchResultList from "@/components/organisms/SearchResultList";
import { useGetSearchData } from "@/hooks/useGetSearchData";
import { useSetScreen } from "@/hooks/useSetScreen";

const SearchResult = (): JSX.Element => {
    useSetScreen('검색 결과');

    const { filter, params, initData } = useGetSearchData();

    return (
        <Layout.default>
            <SearchResultList filter={filter as string} params={params} initData={initData} />
        </Layout.default>
    )
}

export default SearchResult;