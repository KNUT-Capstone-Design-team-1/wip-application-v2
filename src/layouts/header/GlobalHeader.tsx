import { usePathname } from 'expo-router';
import Header from './Header';
import SubHeader from './SubHeader';

const GlobalHeader = () => {
  const pathname = usePathname();

  const isMainPage = pathname === '/';

  if (isMainPage) {
    return <Header />;
  }

  return <SubHeader />;
};

export default GlobalHeader;
