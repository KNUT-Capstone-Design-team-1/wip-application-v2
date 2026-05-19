import React from 'react';
import { View, ScrollView } from 'react-native';
import { COLOR_PRIMARY } from '@constants/color';
import { IIdentificationSection } from '@features/pill_identification_search/types/search_id_types';
import { pillIdentificationData } from '@features/pill_identification_search/constants/pillIdentificationData';
import { useSelectedSearchId } from '@features/pill_identification_search/hooks/useSelectedSearchId';
import { useSearchIdForm } from '@features/pill_identification_search/hooks/useSearchIdForm';
import IdentificationSection from '@features/pill_identification_search/components/molecules/IdentificationSection';
import MarkSection from '@features/pill_identification_search/components/molecules/MarkSection';
import Button from '@features/pill_identification_search/components/atoms/Button';
import IdentificationTextInputSection from '@features/pill_identification_search/components/organisms/IdentificationTextInputSection';
import IdentificationIconButtonSection from '@features/pill_identification_search/components/organisms/IdentificationIconButtonSection';
import { styles } from '@features/pill_identification_search/styles/organisms/PillIdentificationSearchModal';

const PillIdentificationSearchScreen: React.FC = () => {
  const {
    searchIdInputChangeHandler,
    radioButtonPressHandler,
    searchPillDatas,
    resetButtonClickHandler,
  } = useSelectedSearchId();

  const { getSelectedIndexesFromStore, getTextInputValue } = useSearchIdForm();

  // 섹션별 렌더링 함수
  const renderSection = (key: string, section: IIdentificationSection) => {
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
      const selectedIndexes = getSelectedIndexesFromStore(
        key,
        section.datas || [],
      );
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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 스크롤 영역 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(pillIdentificationData).map(([key, section]) =>
          renderSection(key, section),
        )}
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomButtons}>
        <Button
          width="48%"
          label="초기화"
          pressHandler={resetButtonClickHandler}
          background={'#fff'}
          color={COLOR_PRIMARY[100]}
        />
        <Button
          width="48%"
          label="검색하기"
          pressHandler={async () => {
            await searchPillDatas();
          }}
        />
      </View>
    </View>
  );
};

export default PillIdentificationSearchScreen;
