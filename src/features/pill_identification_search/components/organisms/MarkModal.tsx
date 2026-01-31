import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { COLOR_PRIMARY } from '@/src/constants';
import { useMarkModal } from '../../hooks/use_mark_modal';
import SearchInput from '../molecules/SearchInput';
import MarkList from '../molecules/MarkList';
import Pagination from '../molecules/Pagination';
import { styles } from '../../styles/organisms/MarkModal';

interface IMarkModalProps {
  onClose: () => void;
}

const MarkModal = ({ onClose }: IMarkModalProps) => {
  const {
    searchText,
    setSearchText,
    markDataList,
    loading,
    error,
    page,
    totalPages,
    currentGroup,
    setPage,
    setCurrentGroup,
    handleSearch,
    handleMarkSelect,
  } = useMarkModal();

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
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>×</Text>
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
            {!loading && markDataList.length > 0 && (
              <Pagination
                totalPages={totalPages}
                page={page}
                setPage={setPage}
                currentGroup={currentGroup}
                setCurrentGroup={setCurrentGroup}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MarkModal;
