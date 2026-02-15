import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { styles } from '../../styles/organisms/PillIdentificationSearchModal';
import { pillIdentificstionData } from '../../constants/pillIdentificstionData';
import IdentificationSection from '../molecules/identificationSection';
import { Input } from '../atoms/Input';
import IconButton from '../atoms/IconButton';
import Button from '../atoms/Button';
import { COLOR_PRIMARY } from '@/src/constants';
import MarkSection from '@/src/features/pill_identification_search/components/molecules/MarkSection';
import { useSelecteSearchId } from '../../hooks/use_selecte_search_id';

interface IPillIdentificationSearchModalProps {
  visible: boolean;
  onClose: () => void;
}

const PillIdentificationSearchModal: React.FC<
  IPillIdentificationSearchModalProps
> = ({ visible, onClose }) => {
  // 초기 상태: 모든 iconButton 섹션의 '전체'(index 0) 선택
  const getInitialSelectedIndexes = () => {
    const initial: { [key: string]: number[] } = {};
    Object.entries(pillIdentificstionData).forEach(([key, section]) => {
      if (section.type === 'iconButton') {
        initial[key] = [0]; // 첫 번째 항목(전체) 선택
      }
    });
    return initial;
  };

  const [selectedIndexes, setSelectedIndexes] = useState<{
    [key: string]: number[];
  }>(getInitialSelectedIndexes());
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const { searchPillDatas } = useSelecteSearchId();

  // 초기화 핸들러
  const handleReset = () => {
    setSelectedIndexes(getInitialSelectedIndexes());
    setInputValues({});
  };

  // 섹션별 렌더링 함수
  const renderSection = (key: string, section: any) => {
    const title = section.title;

    // textInput 타입
    if (section.type === 'textInput') {
      return (
        <View key={key} style={{ marginBottom: 20 }}>
          <IdentificationSection
            title={title}
            direction="row"
            selectedIndex={[]}
          >
            <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
              {section.datas.map((data: any, index: number) => (
                <View key={index} style={{ flex: 1 }}>
                  <Input
                    placeholder={data.placeholder}
                    value={inputValues[`${key}_${index}`] || ''}
                    width="100%"
                    height="40"
                    inputChangeHandler={(event) => {
                      setInputValues({
                        ...inputValues,
                        [`${key}_${index}`]: event.nativeEvent.text,
                      });
                    }}
                  />
                </View>
              ))}
            </View>
          </IdentificationSection>
        </View>
      );
    }

    // iconButton 타입
    if (section.type === 'iconButton') {
      return (
        <View key={key} style={{ marginBottom: 20 }}>
          <IdentificationSection
            title={title}
            direction="column"
            selectedIndex={selectedIndexes[key] || []}
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {section.datas.map((data: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    const currentSelected = selectedIndexes[key] || [];
                    const isSelected = currentSelected.includes(index);

                    // '전체' 버튼(index 0) 클릭 시
                    if (index === 0) {
                      // 이미 선택되어 있으면 아무것도 안 함 (전체는 항상 선택되거나 다른 것 선택)
                      if (!isSelected) {
                        setSelectedIndexes({
                          ...selectedIndexes,
                          [key]: [0], // 전체만 선택
                        });
                      }
                    } else {
                      // 다른 버튼 클릭 시
                      let newSelected = [...currentSelected];

                      // 전체 버튼이 선택되어 있으면 제거
                      if (newSelected.includes(0)) {
                        newSelected = newSelected.filter((i) => i !== 0);
                      }

                      if (isSelected) {
                        // 이미 선택된 버튼 클릭 -> 해제
                        newSelected = newSelected.filter((i) => i !== index);
                        // 아무것도 선택 안 되면 전체 선택
                        if (newSelected.length === 0) {
                          newSelected = [0];
                        }
                      } else {
                        // 선택 안 된 버튼 클릭 -> 추가
                        newSelected.push(index);
                      }

                      setSelectedIndexes({
                        ...selectedIndexes,
                        [key]: newSelected,
                      });
                    }
                  }}
                >
                  <IconButton
                    isSelected={(selectedIndexes[key] || []).includes(index)}
                    iconUrl={data.iconUrl}
                    iconColor={data.iconColor}
                    label={data.label}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </IdentificationSection>
        </View>
      );
    }

    // other 타입 (마크명 등)
    if (section.type === 'other') {
      return (
        <View key={key} style={{ marginBottom: 20 }}>
          <IdentificationSection
            title={title}
            direction="column"
            selectedIndex={[]}
          >
            <MarkSection
              isSelected={false}
              selectedMarkName={''}
              selectedMarkIcon={''}
            />
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
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
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
              pressHandler={searchPillDatas}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default PillIdentificationSearchModal;
