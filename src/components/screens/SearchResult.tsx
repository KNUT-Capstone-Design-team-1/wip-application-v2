import Layout from "@/components/organisms/Layout";
import SearchResultList from "@/components/organisms/SearchResultList";
import { useGetSearchData } from "@/hooks/useGetSearchData";
import { useSetScreen } from "@/hooks/useSetScreen";
import SkeletoneSearchResult from "../organisms/SkeletoneSearchResult";

const SearchResult = (): JSX.Element => {
    useSetScreen('검색 결과');

    const { filter, params, isVisible, infiLoading } = useGetSearchData();



    return (
        <Layout.default>
            {filter && isVisible ?
                <SearchResultList filter={filter} params={params} /> :
                <SkeletoneSearchResult />
            }
        </Layout.default>
    )
}

export default SearchResult;