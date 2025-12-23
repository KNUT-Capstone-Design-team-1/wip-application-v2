import { TMarkData } from '@/types/TApiType';
import MarkModalView from './MarkModalView';

import { useMarkModal } from '@/hooks/useMarkModal';

const MarkModal = ({ onClose }: { onClose: () => void }) => {
  const {
    searchText,
    page,
    setPage,
    markDataList,
    loading,
    totalPages,
    currentGroup,
    setCurrentGroup,
    setSearchMark,
    setSelectedMarkBase64,
    setSelectedMarkTitle,
    handleSearch,
  } = useMarkModal();

  const markSelected = (item: TMarkData) => {
    setSearchMark(item.code);
    setSelectedMarkTitle(item.title);
    setSelectedMarkBase64(item.base64);
    onClose();
  };

  return (
    <MarkModalView
      loading={loading}
      markDataList={markDataList}
      page={page}
      totalPages={totalPages}
      currentGroup={currentGroup}
      setPage={setPage}
      setCurrentGroup={setCurrentGroup}
      handleSearch={handleSearch}
      markSelected={markSelected}
      onClose={onClose}
      searchText={searchText}
    />
  );
};

export default MarkModal;
