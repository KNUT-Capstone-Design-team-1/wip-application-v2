import { styles } from '../styles/PillIdentificationSearchScreen';
import React from 'react';
import { View, Pressable } from 'react-native';
import { CircleQuestionMark } from 'lucide-react-native';
import PillIdentificationSearchForm from '../components/organisms/PillIdentificationSearchForm';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { identificationGuide } from '../guide';

const PillIdentificationSearchScreen: React.FC = () => {
  const replay = identificationGuide.useReplay();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={replay}
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

export default identificationGuide.wrap(PillIdentificationSearchScreen);
