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
          <View style={{ flexDirection: 'column', gap: 10, width: '100%' }}>
            <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
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
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                }}
                onPress={() => setIsExactMatch(!isExactMatch)}
              >
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    borderWidth: 1.5,
                    borderColor: COLOR_PRIMARY[100],
                    backgroundColor: isExactMatch
                      ? COLOR_PRIMARY[100]
                      : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 8,
                  }}
                >
                  {isExactMatch && (
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      ✓
                    </Text>
                  )}
                </View>
                <Text style={{ fontSize: 14, color: '#666' }}>
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
