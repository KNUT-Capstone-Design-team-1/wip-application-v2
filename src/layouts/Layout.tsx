import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import GlobalHeader from './header/GlobalHeader';
import SearchHeader from './header/SearchHeader';

const Layout = () => {
  const insets = useSafeAreaInsets();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: () => <GlobalHeader />,
        contentStyle: { backgroundColor: '#fff', paddingTop: insets.top },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="camera/index"
        options={{
          headerShown: false,
          contentStyle: { paddingTop: 0 },
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="unified-search/index"
        options={{
          headerShown: true,
          header: () => <SearchHeader />,
          animation: 'none',
        }}
      />
    </Stack>
  );
};

export default Layout;
