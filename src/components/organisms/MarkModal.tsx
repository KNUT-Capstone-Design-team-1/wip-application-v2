import React, { useState, useEffect, useRef } from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import SearchInputAndButton from '@components/molecules/SearchInputAndButton';
import { TMarkData } from '@/types/TApiType';
import getMarkData from '@api/client/mark';
import { useSearchIdStore } from '@/store/searchIdStore';
import { useMarkStore } from '@/store/markStore';
import ModalPageNation from '@components/molecules/ModalPageNation';
import ModalIconButton from '@components/atoms/ModalIconButton';

const LIMIT = 20;

const MarkModal = ({ onClose }: { onClose: () => void }) => {
  const searchText = useRef('');
  const [beforeSearchText, setBeforeSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [markDataList, setMarkDataList] = useState<TMarkData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // 페이지 그룹 상태
  const [currentGroup, setCurrentGroup] = useState(0); // 0 = 첫 그룹 (1~7), 1 = 두 번째 그룹 (8~14)...

  const { setSearchMark } = useSearchIdStore();
  const { setSelectedMarkBase64 } = useMarkStore();

  // 데이터 불러오기
  const fetchMarkData = async (title: string, pageNum: number) => {
    try {
      setLoading(true);

      const res = await getMarkData(title, LIMIT, pageNum);

      setMarkDataList(res?.markData || []);
      setTotalDataCount(res?.pages || 0);
      setTotalPages(totalDataCount);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 처음 모달 열릴 때 & page 변경될 때
  useEffect(() => {
    fetchMarkData(beforeSearchText, page);
  }, [page, totalDataCount]);

  // 검색 버튼 클릭 시
  const handleSearch = () => {
    if (beforeSearchText === searchText.current) return;
    setPage(1);
    setBeforeSearchText(searchText.current);
    setCurrentGroup(0); // 검색 시 그룹 초기화
    fetchMarkData(searchText.current, 1);
  };

  const textInputsObject = {
    placeholder: '예) A~Z, 꽃, 동물 등',
    placeholderTextColor: 'grey',
    onChangeText: (text: string) => {
      searchText.current = text;
    },
  };

  const markSelected = (item: TMarkData) => {
    setSearchMark(item.code);
    setSelectedMarkBase64(item.base64);
    onClose();
  };

  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); onClose(); }}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
          <View style={styles.modalBox}>
            {/* 닫기 버튼 */}
            <TouchableOpacity
              onPress={() => { Keyboard.dismiss(); onClose(); }}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.text}>마크 검색</Text>

            <View style={{ marginTop: 30 }}>
              <SearchInputAndButton
                textInputsObject={textInputsObject}
                buttonClickHandler={handleSearch}
              />
            </View>

            {/* 로딩 중일 때 */}
            {loading ? (
              <ActivityIndicator size="large" color="#6563ed" style={{ height: '70%' }} />
            ) : (
              <FlatList
                data={markDataList}
                keyExtractor={(item, index) => `${item.code}-${index}`}
                renderItem={({ item }) => (
                  <ModalIconButton item={item} markSelected={markSelected} />
                )}
                numColumns={5}
                contentContainerStyle={[styles.markList, { minHeight: 300 }]}
                ListEmptyComponent={
                  <View style={{ flex: 1, alignItems: 'center', marginTop: 40 }}>
                    <Text style={{ color: '#999', fontSize: 16 }}>검색 결과 없음</Text>
                  </View>
                }
              />
            )}
            <ModalPageNation
              totalPages={totalPages}
              page={page}
              setPage={setPage}
              currentGroup={currentGroup}
              setCurrentGroup={setCurrentGroup}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '92%',
    height: '65%',
    elevation: 6,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '700',
    color: '#333',
  },
  markList: {
    paddingHorizontal: 2,
    paddingVertical: '5%',
  },
  markCard: {
    flex: 1,
    margin: 6,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 6,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#666',
  },
});

export default MarkModal;
