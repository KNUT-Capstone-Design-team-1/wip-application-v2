import { styles } from '../styles/PillIdentificationSearchScreen';
import React, { useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { CircleQuestionMark } from 'lucide-react-native';
import PillIdentificationSearchForm from '../components/organisms/PillIdentificationSearchForm';
import { GuideProvider, GuideOverlay, useGuide } from '@features/guide';
import { guideStorage } from '@utils/guide_storage';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { IDENTIFICATION_TOUR } from '../constants/identification_tour_constant';

// 가이드 UI 를 쓰는 내부 화면 (GuideProvider 안)
const IdentificationContent = () => {
  const { start, autoStart } = useGuide();

  // 첫 진입 시 1회 자동 노출
  useFocusEffect(
    useCallback(() => {
      autoStart(IDENTIFICATION_TOUR);
    }, [autoStart]),
  );

  return (
    <View style={styles.container}>
      {/* 가이드 다시보기 버튼 */}
      <Pressable
        onPress={() => start(IDENTIFICATION_TOUR)}
        hitSlop={8}
        style={styles.guideButton}
        accessibilityRole="button"
        accessibilityLabel="사용법 보기"
      >
        <CircleQuestionMark size={fontPx(22)} color={COLOR['secondary']} />
      </Pressable>

      <PillIdentificationSearchForm />
    </View>
  );
};

// 알약 식별 검색 메인 화면 컴포넌트 (Presentation Layer)
const PillIdentificationSearchScreen: React.FC = () => {
  return (
    <GuideProvider storage={guideStorage}>
      <IdentificationContent />
      {/* 스포트라이트 오버레이 (Provider 안에 1회) */}
      <GuideOverlay />
    </GuideProvider>
  );
};

export default PillIdentificationSearchScreen;
