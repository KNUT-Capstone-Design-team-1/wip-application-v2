import React, { useMemo, memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import IconButton from '../atoms/IconButton';
import IdentificationSection from '../molecules/IdentificationSection';
import {
  IIdentificationSection,
  ISearchIdStore,
} from '@features/pill_identification_search/types/search_id_types';
import { useSearchIdStore } from '../../store/search_id_store';
import { SECTION_KEY_TO_STORE_KEY } from '../../constants/pillIdentificationData';

interface IIdentificationIconButtonSectionProps {
  sectionKey: string;
  section: IIdentificationSection;
  radioButtonPressHandler: (value: string, key: string) => void;
}

const IdentificationIconButtonSection = memo(
  ({
    sectionKey,
    section,
    radioButtonPressHandler,
  }: IIdentificationIconButtonSectionProps) => {
    const storeKey = SECTION_KEY_TO_STORE_KEY[
      sectionKey
    ] as keyof ISearchIdStore;

    // 특정 섹션의 데이터만 구독
    const storeArray = useSearchIdStore((state) =>
      storeKey ? state[storeKey] : null,
    );

    const selectedIndexes = useMemo(() => {
      if (!section.datas) return [0];

      if (!Array.isArray(storeArray)) {
        return [0];
      }

      // store가 비어있으면 index 0(전체) 반환
      if (storeArray.length === 0) {
        return [0];
      }

      const indexes = section.datas
        .map((data, index) =>
          storeArray.includes((data.value || data.label) as string)
            ? index
            : -1,
        )
        .filter((i) => i !== -1);

      return indexes.length > 0 ? indexes : [0];
    }, [section.datas, storeArray]);

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
                    radioButtonPressHandler('전체', sectionKey);
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
  },
);

IdentificationIconButtonSection.displayName = 'IdentificationIconButtonSection';

export default IdentificationIconButtonSection;
