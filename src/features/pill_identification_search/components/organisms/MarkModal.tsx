import React, { useEffect, useCallback } from 'react';
import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import SearchInput from '../molecules/SearchInput';
import Pagination from '../molecules/Pagination';
import MarkModalHeader from '../molecules/MarkModalHeader';
import MarkModalContent from '../molecules/MarkModalContent';
import { styles } from '../../styles/organisms/MarkModal';
import {
  IMarkModalProps,
  MarkData,
} from '@features/pill_identification_search/types';

// 식별 마크 검색 및 선택 모달 컴포넌트 (Organism)
const MarkModal = ({
  onClose,
  searchText,
  setSearchText,
  markDataList,
  loading,
  error,
  handleSearch,
  handleMarkSelect,
  loadInitialMarks,
  currentPage,
  totalPages,
  currentGroup,
  handlePageChange,
  handleGroupChange,
}: IMarkModalProps) => {
  // 모달이 열릴 때 초기 데이터 로드
  useEffect(() => {
    const hasNoMarks = markDataList.length === 0;

    if (hasNoMarks && !loading) {
      loadInitialMarks('');
    }
  }, [loadInitialMarks, loading, markDataList.length]);

  // 마크 선택 시 모달 닫기
  const handleSelect = useCallback(
    (mark: MarkData) => {
      handleMarkSelect(mark);
      onClose();
    },
    [handleMarkSelect, onClose],
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        onClose();
      }}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback
          onPress={(e) => {
            const hasStop = Boolean(e.stopPropagation);
            if (hasStop) {
              e.stopPropagation();
            }
          }}
        >
          <View style={styles.modalBox}>
            {/* 상단 헤더 (그랩바, 닫기버튼, 타이틀) */}
            <MarkModalHeader onClose={onClose} />

            {/* 검색 입력 */}
            <View style={styles.searchWrapper}>
              <SearchInput
                value={searchText}
                onChangeText={setSearchText}
                onSearch={handleSearch}
                placeholder="예) A~Z, 꽃, 동물 등"
                disabled={loading}
              />
            </View>

            {/* 마크 리스트 / 로딩 / 에러 / 빈화면 */}
            <MarkModalContent
              loading={loading}
              error={error}
              markDataList={markDataList}
              onSelect={handleSelect}
            />

            {/* 페이지네이션 */}
            {!loading && markDataList.length > 0 && totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                page={currentPage}
                setPage={handlePageChange}
                currentGroup={currentGroup}
                setCurrentGroup={handleGroupChange}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MarkModal;
