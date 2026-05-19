import React, { useCallback, memo } from 'react';
import { View, ScrollView } from 'react-native';
import { IIdentificationSection } from '@features/pill_identification_search/types/search_id_types';
import { pillIdentificationData } from '@features/pill_identification_search/constants/pillIdentificationData';
import { useSelectedSearchId } from '@features/pill_identification_search/hooks/useSelectedSearchId';
import IdentificationSection from '@features/pill_identification_search/components/molecules/IdentificationSection';
import MarkSection from '@features/pill_identification_search/components/molecules/MarkSection';
import IdentificationTextInputSection from '@features/pill_identification_search/components/organisms/IdentificationTextInputSection';
import IdentificationIconButtonSection from '@features/pill_identification_search/components/organisms/IdentificationIconButtonSection';
import IdentificationSearchActions from '@features/pill_identification_search/components/organisms/IdentificationSearchActions';
import { styles } from '@features/pill_identification_search/styles/organisms/PillIdentificationSearchModal';

interface IPillIdentificationSearchFormProps {
  onSearchComplete?: () => void;
}

const PillIdentificationSearchForm = memo(
  ({ onSearchComplete }: IPillIdentificationSearchFormProps) => {
    const {
      searchIdInputChangeHandler,
      radioButtonPressHandler,
      searchPillDatas,
      resetButtonClickHandler,
    } = useSelectedSearchId();

    const handleSearch = useCallback(async () => {
      if (onSearchComplete) {
        onSearchComplete();
      }
      await searchPillDatas();
    }, [onSearchComplete, searchPillDatas]);

    // 섹션별 렌더링 함수
    const renderSection = (key: string, section: IIdentificationSection) => {
      switch (section.type) {
        case 'textInput':
          return (
            <IdentificationTextInputSection
              key={key}
              sectionKey={key}
              section={section}
              searchIdInputChangeHandler={searchIdInputChangeHandler}
            />
          );
        case 'iconButton':
          return (
            <IdentificationIconButtonSection
              key={key}
              sectionKey={key}
              section={section}
              radioButtonPressHandler={radioButtonPressHandler}
            />
          );
        case 'other':
          return (
            <View key={key} style={{ marginBottom: 20 }}>
              <IdentificationSection title={section.title}>
                <MarkSection />
              </IdentificationSection>
            </View>
          );
        default:
          return null;
      }
    };

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {Object.entries(pillIdentificationData).map(([key, section]) =>
            renderSection(key, section),
          )}
        </ScrollView>

        <IdentificationSearchActions
          onReset={resetButtonClickHandler}
          onSearch={handleSearch}
        />
      </View>
    );
  },
);

PillIdentificationSearchForm.displayName = 'PillIdentificationSearchForm';

export default PillIdentificationSearchForm;
