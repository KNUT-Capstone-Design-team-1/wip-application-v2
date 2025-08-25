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
  ScrollView,
} from 'react-native';

import SearchInputAndButton from '@components/molecules/SearchInputAndButton.tsx';
import Button from '@components/atoms/Button.tsx';

import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { markDataSelector } from '@/selectors/mark.ts';
import { TMarkData } from '@/types/TApiType.ts';
import { selectedMarkImage } from '@/atoms/searchMark.ts';

import { useSelectSearchId } from '@/hooks/useSelectSearchId.ts';

const LIMIT = 20;
const TOTAL_DATA_COUNT = 100; // 총 데이터 100개 가정
const TOTAL_PAGES = Math.ceil(TOTAL_DATA_COUNT / LIMIT);

const MarkModal = ({ onClose }: { onClose: () => void }) => {
  const searchText = useRef('');
  const [beforeSearchText, setBeforeSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [markDataList, setMarkDataList] = useState<TMarkData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useRecoilState(selectedMarkImage);

  const { handlePressMarkData } = useSelectSearchId();

  const markDataLoadable = useRecoilValueLoadable(
    markDataSelector({ title: searchText.current, page, limit: LIMIT }),
  );

  const handleSearch = () => {
    if(beforeSearchText === searchText.current) return;

    const markResearchObj = {
      title: searchText.current,
      page: 1,
      limit: 50,
    };

    markDataSelector(markResearchObj);
    setPage(1);
    setMarkDataList([]);
    setHasMore(true);
    setBeforeSearchText(searchText.current);
  };

  const textInputsObject = {
    placeholder: '예) A~Z, 꽃, 동물 등',
    placeholderTextColor: 'grey',
    onChangeText: (text: string) => {
      searchText.current = text;
    },
  };

  const markSelected = (item) => {
    setSelectedImage(item.base64);

    // code? title??
    handlePressMarkData(item.code);
    onClose();
  };

  useEffect(() => {
    if (markDataLoadable.state === 'hasValue') {
      const newData = markDataLoadable.contents as TMarkData[];
      setMarkDataList(newData);

      if (newData.length < LIMIT) setHasMore(false);
      else setHasMore(true);
    }
  }, [markDataLoadable.state, page, searchText]);

  const renderMark = ({ item, index }: { item: TMarkData; index: number }) => (
    <Button.imgInButton
      style={styles.mark}
      key={index}
      onPress={() => markSelected(item)}
      src={item.base64}
    >
      <Text style={{ color: '#444' }}>{item.code}</Text>
    </Button.imgInButton>
  );

  // 페이지네이션 버튼 렌더링 함수
  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= TOTAL_PAGES; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            i === page && styles.pageButtonActive,
          ]}
          onPress={() => setPage(i)}
        >
          <Text style={i === page ? styles.pageButtonTextActive : styles.pageButtonText}>
            {i}
          </Text>
        </TouchableOpacity>,
      );
    }
    return buttons;
  };

  return (
    // 바깥 검정 투명 영역만 터치 시 모달 닫기
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        onClose();
      }}
    >
      <View style={styles.overlay}>

        {/* 모달 박스 영역 터치는 이벤트 전파 막기 */}
        <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
          <View style={styles.modalBox}>
            {/* 닫기 버튼 */}
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                onClose();
              }}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.text}>마크 검색</Text>

            <SearchInputAndButton
              textInputsObject={textInputsObject}
              buttonClickHandler={handleSearch}
            />

            {markDataLoadable.state === 'loading' ? (
              <ActivityIndicator style={{ marginTop: 10, minHeight: '30%' }} />
            ) : (
              <FlatList
                data={markDataList}
                keyExtractor={(item, index) => item.code + index}
                renderItem={renderMark}
                contentContainerStyle={styles.markList}
                numColumns={5}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
                style={{ flexGrow: 0 }}
                ListEmptyComponent={
                  <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#999' }}>검색 결과가 없습니다</Text>
                  </View>
                }
              />
            )}
            {/* 페이지네이션 버튼 UI */}
            <View style={styles.paginationContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: 'center',
                }}
              >
                {renderPageButtons()}
              </ScrollView>
            </View>
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
    padding: 24,
    borderRadius: 12,
    width: '90%',
    height: '60%',
    elevation: 4,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
  },
  markList: {
    // gap: 15,
    // paddingTop: 10,
    // alignItems: 'center',
    paddingHorizontal: 10,
  },
  mark: {
    margin: 4,
    padding: 10,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'transparent',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  pageButton: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  pageButtonActive: {
    backgroundColor: '#6563ed',
    borderColor: '#6563ed',
  },
  pageButtonText: {
    color: '#888',
    fontWeight: '600',
  },
  pageButtonTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#444',
  },
});

export default MarkModal;
