import Layout from '@/components/organisms/Layout';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { font, os } from '@/style/font';
import { TERMS } from '@/constants/terms';
import { useScreenStore } from '@/store/screen';

const Terms = (): React.JSX.Element => {
  const nav: any = useNavigation();
  const setScreen = useScreenStore((state) => state.setScreen);

  const handleSetScreen = useCallback(() => {
    setScreen('이용 약관');
  }, [setScreen]);

  useEffect(() => {
    nav.addListener('focus', () => handleSetScreen());
    return () => {
      nav.removeListener('focus', () => handleSetScreen());
    };
  }, [handleSetScreen, nav]);

  const styles = StyleSheet.create({
    scrollViewWrapper: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 12,
    },
    termsText: {
      color: '#000',
      fontFamily: os.font(400, 400),
      fontSize: font(16),
      includeFontPadding: false,
      paddingBottom: 100,
    },
  });

  return (
    <Layout.default>
      <ScrollView style={styles.scrollViewWrapper}>
        <Text style={styles.termsText}>{TERMS}</Text>
      </ScrollView>
    </Layout.default>
  );
};

export default Terms;
