import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useSearchIdStore } from '../../store/search_id_store';
import { COLOR_PRIMARY } from '@constants/color';
import { Input } from '../atoms/Input';
import IdentificationSection from '../molecules/IdentificationSection';

interface IIdentificationTextInputSectionProps {
  sectionKey: string;
  section: any;
  searchIdInputChangeHandler: (text: string, key: string) => void;
  getTextInputValue: (sectionKey: string, dataIndex: number) => string;
}

const IdentificationTextInputSection: React.FC<
  IIdentificationTextInputSectionProps
> = ({
  sectionKey,
  section,
  searchIdInputChangeHandler,
  getTextInputValue,
}) => {
  const isExactMatch = useSearchIdStore((state) => state.isExactMatch);
  const setIsExactMatch = useSearchIdStore((state) => state.setIsExactMatch);

  return (
    <View style={{ marginBottom: 20 }}>
      <IdentificationSection
        title={section.title}
        direction="row"
        selectedIndex={[]}
      >
        <View style={{ flexDirection: 'column', gap: 10, width: '100%' }}>
          <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
            {section.datas.map((data: any, index: number) => (
              <View key={index} style={{ flex: 1 }}>
                <Input
                  placeholder={data.placeholder}
                  value={getTextInputValue(sectionKey, index)}
                  width="100%"
                  height={40}
                  inputChangeHandler={(text) => {
                    searchIdInputChangeHandler(text, section.datas[index].key);
                  }}
                />
              </View>
            ))}
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
};

export default IdentificationTextInputSection;
