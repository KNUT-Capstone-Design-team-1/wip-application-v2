import { HomeScreen } from '@features/home';
import { useDoubleBackExit } from '@hooks/use_double_back_exit';

export default function Index() {
  useDoubleBackExit();
  return <HomeScreen />;
}
