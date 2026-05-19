import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import IconButton from '../atoms/IconButton';
import IdentificationSection from '../molecules/IdentificationSection';
import { IIdentificationSection } from '@features/pill_identification_search/types/search_id_types';

interface IIdentificationIconButtonSectionProps {
  sectionKey: string;
  section: IIdentificationSection;
  selectedIndexes: number[];
  radioButtonPressHandler: (value: string, key: string) => void;
}

const IdentificationIconButtonSection: React.FC<
  IIdentificationIconButtonSectionProps
> = ({ sectionKey, section, selectedIndexes, radioButtonPressHandler }) => {
  if (!section.datas) {
    return null;
  }

  return (
    <View style={{ marginBottom: 20 }}>
      <IdentificationSection
        title={section.title}
        direction="column"
        selectedIndex={selectedIndexes}
      >
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            gap: 6,
          }}
        >
          {section.datas.map((data, index) => (
            <TouchableOpacity
              key={index}
              style={{ width: '23.5%', marginBottom: 4 }}
              onPress={() => {
                if (index === 0 && !selectedIndexes.includes(0)) {
                  radioButtonPressHandler('전체', sectionKey); // '전체' 버튼: 이미 선택 상태면 무시
                  return;
                }

                radioButtonPressHandler(
                  (data.value || data.label) as string,
                  sectionKey,
                );
              }}
            >
              <IconButton
                isSelected={selectedIndexes.includes(index)}
                iconUrl={data.iconUrl}
                iconColor={data.iconColor}
                label={data.label || ''}
              />
            </TouchableOpacity>
          ))}
        </View>
      </IdentificationSection>
    </View>
  );
};

export default IdentificationIconButtonSection;
