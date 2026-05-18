import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import IconButton from '../atoms/IconButton';
import IdentificationSection from '../molecules/IdentificationSection';

interface IIdentificationIconButtonSectionProps {
  sectionKey: string;
  section: any;
  selectedIndexes: number[];
  radioButtonPressHandler: (value: string, key: string) => void;
}

const IdentificationIconButtonSection: React.FC<
  IIdentificationIconButtonSectionProps
> = ({ sectionKey, section, selectedIndexes, radioButtonPressHandler }) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <IdentificationSection
        title={section.title}
        direction="column"
        selectedIndex={selectedIndexes}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {section.datas.map((data: any, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (index === 0) {
                  // '전체' 버튼: 이미 선택 상태면 무시
                  if (!selectedIndexes.includes(0)) {
                    radioButtonPressHandler('전체', sectionKey);
                  }
                } else {
                  radioButtonPressHandler(data.value || data.label, sectionKey);
                }
              }}
            >
              <IconButton
                isSelected={selectedIndexes.includes(index)}
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
};

export default IdentificationIconButtonSection;
