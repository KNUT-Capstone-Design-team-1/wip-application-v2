import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import { useSearchIdStore } from '../../store/search_id_store';
import IdentificationSection from '../molecules/IdentificationSection';
import IdentificationTextInputItem from '../molecules/IdentificationTextInputItem';
import ExactMatchCheckbox from '../molecules/ExactMatchCheckbox';
import {
  IIdentificationTextInputSectionProps,
  ISearchIdStore,
} from '@features/pill_identification_search/types';
import { SECTION_KEY_TO_TEXT_STORE_KEYS } from '../../constants/pillIdentificationData';
import { styles } from '../../styles/organisms/IdentificationTextInputSection';

// 식별 검색 텍스트 입력 영역 컴포넌트 (Organism)
const IdentificationTextInputSection = memo(
  ({
    sectionKey,
    section,
    searchIdInputChangeHandler,
  }: IIdentificationTextInputSectionProps) => {
    const isExactMatch = useSearchIdStore((state) => state.isExactMatch);
    const setIsExactMatch = useSearchIdStore((state) => state.setIsExactMatch);

    // 완전 일치 체크박스 토글 핸들러
    const handleToggleExactMatch = useCallback(() => {
      setIsExactMatch(!isExactMatch);
    }, [isExactMatch, setIsExactMatch]);

    // 현재 섹션의 스토어 키들 가져오기
    const storeKeys = SECTION_KEY_TO_TEXT_STORE_KEYS[sectionKey] || [];

    if (!section.datas) {
      return null;
    }

    return (
      <View style={styles.container}>
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
                  <IdentificationTextInputItem
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
              <ExactMatchCheckbox
                isExactMatch={isExactMatch}
                onToggle={handleToggleExactMatch}
              />
            )}
          </View>
        </IdentificationSection>
      </View>
    );
  },
);

IdentificationTextInputSection.displayName = 'IdentificationTextInputSection';

export default IdentificationTextInputSection;
