import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useScreenStore } from '@/store/screen';

export const useSetScreen = (screenName: string) => {
  const nav: any = useNavigation();
  const setScreen = useScreenStore((state) => state.setScreen);

  const handleSetScreen = () => {
    setScreen(screenName);
  };

  useEffect(() => {
    nav.addListener('focus', () => handleSetScreen());
    return () => {
      nav.removeListener('focus', () => handleSetScreen());
    };
  }, []);
};
