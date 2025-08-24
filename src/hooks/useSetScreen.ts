import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { useScreenStore } from '@/store/screen';

export const useSetScreen = (screenName: string) => {
  const nav: any = useNavigation();
  const setScreen = useScreenStore((state) => state.setScreen);

  const handleSetScreen = useCallback(() => {
    setScreen(screenName);
  }, [setScreen, screenName]);

  useEffect(() => {
    const unsubscribe = nav.addListener('focus', handleSetScreen);
    return () => {
      unsubscribe();
    };
  }, [handleSetScreen, nav]);
};
