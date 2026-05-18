import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { styles } from '../../styles/organisms/PillIdentificationSearchModal';
import {
  SECTION_KEY_TO_STORE_KEY,
  SECTION_KEY_TO_TEXT_STORE_KEYS,
  pillIdentificstionData,
} from '../../constants/pillIdentificstionData';
import IdentificationSection from '../molecules/IdentificationSection';
import Button from '../atoms/Button';
import { COLOR_PRIMARY } from '@constants/color';
import MarkSection from '@features/pill_identification_search/components/molecules/MarkSection';
import { useSelectedSearchId } from '../../hooks/useSelectedSearchId';
import { useSearchIdStore } from '../../store/search_id_store';
import IdentificationTextInputSection from './IdentificationTextInputSection';
import IdentificationIconButtonSection from './IdentificationIconButtonSection';

interface IPillIdentificationSearchModalProps {
  visible: boolean;
  onClose: () => void;
}

const PillIdentificationSearchModal: React.FC<
  IPillIdentificationSearchModalProps
> = ({ visible, onClose }) => {
  const {
    searchIdInputChangeHandler,
    radioButtonPressHandler,
    searchPillDatas,
    resetButtonClickHandler,
  } = useSelectedSearchId();

  const storeValues = useSearchIdStore();

  // store 배열에서 선택된 label 목록을 인덱스 배열로 변환
  const getSelectedIndexesFromStore = (
    sectionKey: string,
    datas: any[],
  ): number[] => {
    const storeKey = SECTION_KEY_TO_STORE_KEY[sectionKey];
    if (!storeKey) return [0];

    const storeArray: string[] = (storeValues as any)[storeKey] || [];

    // store가 비어있거나 '전체'만 있으면 index 0 반환
    if (
      storeArray.length === 0 ||
      (storeArray.length === 1 && storeArray[0] === '전체')
    ) {
      return [0];
    }

    const indexes = datas
      .map((data, index) =>
        storeArray.includes(data.value || data.label) ? index : -1,
      )
      .filter((i) => i !== -1);

    return indexes.length > 0 ? indexes : [0];
  };

  // store에서 textInput 값 가져오기
  const getTextInputValue = (sectionKey: string, dataIndex: number): string => {
    const storeKeys = SECTION_KEY_TO_TEXT_STORE_KEYS[sectionKey];
    if (!storeKeys || !storeKeys[dataIndex]) return '';
    return (storeValues as any)[storeKeys[dataIndex]] || '';
  };

  // 초기화 핸들러
  const handleReset = () => {
    resetButtonClickHandler();
  };

  // 섹션별 렌더링 함수
  const renderSection = (key: string, section: any) => {
    // textInput 타입
    if (section.type === 'textInput') {
      return (
        <IdentificationTextInputSection
          key={key}
          sectionKey={key}
          section={section}
          getTextInputValue={getTextInputValue}
          searchIdInputChangeHandler={searchIdInputChangeHandler}
        />
      );
    }

    // iconButton 타입
    if (section.type === 'iconButton') {
      const selectedIndexes = getSelectedIndexesFromStore(key, section.datas);
      return (
        <IdentificationIconButtonSection
          key={key}
          sectionKey={key}
          section={section}
          selectedIndexes={selectedIndexes}
          radioButtonPressHandler={radioButtonPressHandler}
        />
      );
    }

    // other 타입 (마크명 등)
    if (section.type === 'other') {
      return (
        <View key={key} style={{ marginBottom: 20 }}>
          <IdentificationSection
            title={section.title}
            direction="column"
            selectedIndex={[]}
          >
            <MarkSection />
          </IdentificationSection>
        </View>
      );
    }

    return null;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable onPress={onClose} />
        <View style={styles.modalContainer}>
          {/* 헤더 */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>식별 검색</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 스크롤 영역 */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            {Object.entries(pillIdentificstionData).map(([key, section]) =>
              renderSection(key, section),
            )}
          </ScrollView>

          {/* 하단 버튼 */}
          <View style={styles.bottomButtons}>
            <Button
              width="48%"
              label="초기화"
              pressHandler={handleReset}
              background={'#fff'}
              color={COLOR_PRIMARY[100]}
            />
            <Button
              width="48%"
              label="검색하기"
              pressHandler={async () => {
                onClose(); // 검색 시작 시 모달 닫기
                await searchPillDatas();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PillIdentificationSearchModal;
