import React, { useCallback, memo } from 'react';
import { View, ScrollView } from 'react-native';
import { IIdentificationSection } from '@features/pill_identification_search/types';
import { pillIdentificationData } from '@features/pill_identification_search/constants/pillIdentificationData';
import { useSelectedSearchId } from '@features/pill_identification_search/hooks/useSelectedSearchId';
import IdentificationSection from '@features/pill_identification_search/components/molecules/IdentificationSection';
import MarkSection from '@features/pill_identification_search/components/molecules/MarkSection';
import IdentificationTextInputSection from '@features/pill_identification_search/components/organisms/IdentificationTextInputSection';
import IdentificationIconButtonSection from '@features/pill_identification_search/components/organisms/IdentificationIconButtonSection';
import IdentificationSearchActions from '@features/pill_identification_search/components/organisms/IdentificationSearchActions';
import { GuideTarget, useGuideScroll } from '@features/guide';
import { styles } from '@features/pill_identification_search/styles/organisms/PillIdentificationSearchModal';

interface IPillIdentificationSearchFormProps {
  onSearchComplete?: () => void;
}

// 알약 식별 검색 폼 전체 화면 컴포넌트
const PillIdentificationSearchForm = memo(
  ({ onSearchComplete }: IPillIdentificationSearchFormProps) => {
    const {
      searchIdInputChangeHandler,
      radioButtonPressHandler,
      searchPillDatas,
      resetButtonClickHandler,
    } = useSelectedSearchId();

    // 가이드: 스크롤 영역 안의 섹션을 화면에 보이도록 스크롤 등록
    const tourScroll = useGuideScroll();

    // 검색 실행 핸들러
    const handleSearch = useCallback(async () => {
      if (onSearchComplete) {
        onSearchComplete();
      }
      await searchPillDatas();
    }, [onSearchComplete, searchPillDatas]);

    // 섹션 내용 렌더링
    const renderSectionContent = (
      key: string,
      section: IIdentificationSection,
    ) => {
      switch (section.type) {
        case 'textInput':
          return (
            <IdentificationTextInputSection
              sectionKey={key}
              section={section}
              searchIdInputChangeHandler={searchIdInputChangeHandler}
            />
          );
        case 'iconButton':
          return (
            <IdentificationIconButtonSection
              sectionKey={key}
              section={section}
              radioButtonPressHandler={radioButtonPressHandler}
            />
          );
        case 'other':
          return (
            <View style={styles.otherSection}>
              <IdentificationSection title={section.title}>
                <MarkSection />
              </IdentificationSection>
            </View>
          );
        default:
          return null;
      }
    };

    // 섹션을 가이드 타겟으로 감싸 렌더링 (id: id.<key>)
    const renderSection = (key: string, section: IIdentificationSection) => {
      const content = renderSectionContent(key, section);
      if (!content) return null;
      return (
        <GuideTarget key={key} id={`id.${key}`}>
          {content}
        </GuideTarget>
      );
    };

    return (
      <View style={styles.container}>
        <ScrollView
          {...tourScroll}
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
