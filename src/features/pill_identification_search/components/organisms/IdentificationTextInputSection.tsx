import React, { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useSearchIdStore } from '../../store/search_id_store';
import { COLOR_PRIMARY } from '@constants/color';
import { Input } from '../atoms/Input';
import IdentificationSection from '../molecules/IdentificationSection';
import {
  IIdentificationSection,
  ISearchIdStore,
} from '@features/pill_identification_search/types/search_id_types';
import { SECTION_KEY_TO_TEXT_STORE_KEYS } from '../../constants/pillIdentificationData';
import { styles } from '../../styles/organisms/IdentificationTextInputSection';

interface IIdentificationTextInputSectionProps {
  sectionKey: string;
  section: IIdentificationSection;
  searchIdInputChangeHandler: (text: string, key: string) => void;
}

const IdentificationTextInputSection = memo(
  ({
    sectionKey,
    section,
    searchIdInputChangeHandler,
  }: IIdentificationTextInputSectionProps) => {
    const isExactMatch = useSearchIdStore((state) => state.isExactMatch);
    const setIsExactMatch = useSearchIdStore((state) => state.setIsExactMatch);

    // 현재 섹션의 스토어 키들 가져오기
    const storeKeys = SECTION_KEY_TO_TEXT_STORE_KEYS[sectionKey] || [];

    if (!section.datas) {
      return null;
    }

    return (
      <View style={{ marginBottom: 20 }}>
        <IdentificationSection
          title={section.title}
          direction="row"
          selectedIndex={[]}
        >
          <View style={styles.textInputColumnWrapper}>
            <View style={styles.textInputRowWrapper}>
              {section.datas.map((data, index) => {
                const storeKey = storeKeys[index] as keyof ISearchIdStore;
                return (
                  <TextInputWrapper
                    key={index}
                    placeholder={data.placeholder || ''}
                    storeKey={storeKey}
                    inputKey={data.key || ''}
                    searchIdInputChangeHandler={searchIdInputChangeHandler}
                  />
                );
              })}
            </View>
            {sectionKey === 'sideLabelText' && (
              <TouchableOpacity
                style={styles.textInputLabelCheckbox}
                onPress={() => setIsExactMatch(!isExactMatch)}
              >
                <View
                  style={[
                    styles.textInputLabelCheckboxWrapper,
                    {
                      backgroundColor: isExactMatch
                        ? COLOR_PRIMARY[100]
                        : 'transparent',
                    },
                  ]}
                >
                  {isExactMatch && (
                    <Text style={styles.textInputLabelCheckboxText}>✓</Text>
                  )}
                </View>
                <Text style={styles.textInputLabelText}>
                  식별문자 일치 (정확히 일치하는 문자만 검색)
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </IdentificationSection>
      </View>
    );
  },
);

IdentificationTextInputSection.displayName = 'IdentificationTextInputSection';

// 개별 Input 필드를 위한 래퍼 (구독 최적화)
const TextInputWrapper = ({
  placeholder,
  storeKey,
  inputKey,
  searchIdInputChangeHandler,
}: {
  placeholder: string;
  storeKey: keyof ISearchIdStore;
  inputKey: string;
  searchIdInputChangeHandler: (text: string, key: string) => void;
}) => {
  const value = useSearchIdStore((state) => state[storeKey] as string);

  return (
    <View style={{ flex: 1 }}>
      <Input
        placeholder={placeholder}
        value={value}
        width="100%"
        height={40}
        inputChangeHandler={(text) => {
          if (inputKey) {
            searchIdInputChangeHandler(text, inputKey);
          }
        }}
      />
    </View>
  );
};

export default IdentificationTextInputSection;
