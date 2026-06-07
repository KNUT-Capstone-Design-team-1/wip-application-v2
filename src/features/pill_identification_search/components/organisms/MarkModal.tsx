import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import SearchInput from '../molecules/SearchInput';
import MarkList from '../molecules/MarkList';
import Pagination from '../molecules/Pagination';
import { styles } from '../../styles/organisms/MarkModal';
import { IMarkModalProps } from '@features/pill_identification_search/types/mark_types';
import { X } from 'lucide-react-native';
import { px, fontPx } from '@utils/responsive';

/*
TODO: Error 용도
- 없는 마크: 검색 input 하단에 error color로 표시
- 서버 문제: toast 처리
TODO: 마크 표시 형식 및 마크 크기 변경 필요
- Modal 방식으로 인해 한 페이지에 표시할 수 있는 마크의 갯수가 제한됨
- BottomSheet 방식이나 다른 방식으로 페이지 전체에 표시하고, 마크 item의 크기를 개선 필요
*/

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
  // 모달이 열릴 때 초기 데이터 로드 (100개)
  useEffect(() => {
    // 데이터가 없을 때만 로드 (이미 검색한 결과가 있으면 유지)
    if (markDataList.length === 0 && !loading) {
      loadInitialMarks('');
    }
  }, []);

  // 마크 선택 시 Modal 닫기
  const handleSelect = (mark: any) => {
    handleMarkSelect(mark);
    onClose();
  };

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
            e.stopPropagation && e.stopPropagation();
          }}
        >
          <View style={styles.modalBox}>
            {/* 닫기 버튼 */}
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{
                top: px(10),
                bottom: px(10),
                left: px(10),
                right: px(10),
              }}
            >
              <X size={fontPx(24)} color={COLOR_GRAY[200]} strokeWidth={3} />
            </TouchableOpacity>

            {/* 타이틀 */}
            <Text style={styles.title}>마크 검색</Text>

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

            {/* 에러 메시지 */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* 마크 리스트 */}
            <View style={styles.markListContainer}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLOR_PRIMARY[100]} />
                  <Text style={styles.loadingText}>검색 중...</Text>
                </View>
              ) : markDataList.length === 0 && !error ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    검색어를 입력하여 마크를 검색해주세요
                  </Text>
                </View>
              ) : (
                <MarkList data={markDataList} onSelect={handleSelect} />
              )}
            </View>

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
