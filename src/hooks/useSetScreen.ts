import { screenState } from '@/atoms/screen';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

export const useSetScreen = (screenName: string) => {
  const nav: any = useNavigation();
  const [, setScreen] = useRecoilState(screenState);

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
