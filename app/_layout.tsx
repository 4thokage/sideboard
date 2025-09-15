import { useBackToTabsOnSettingsScreen } from '@/hooks/use-back-to-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { useColorScheme } from 'react-native';
import { BottomNavigation, MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';



import CounterSettingsModal from '@/components/ui/CounterSettingsModal';
import { DEFAULT_GAME_SETTINGS } from '@/constants/storage';

import CollectionScreen from './CollectionScreen';
import HomeScreen from './index';
import LifeCounterScreen from './LifeCounterScreen';
import SettingsScreen from './SettingsScreen';

export default function RootLayout() {

  // === Theme & color scheme ===
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');
  const { theme } = useMaterial3Theme();

  const paperTheme = isDark
    ? { ...MD3DarkTheme, colors: theme.dark }
    : { ...MD3LightTheme, colors: theme.light };

  // === Navigation State ===
  const [index, setIndex] = useState(0);
  const [screen, setScreen] = useState<'tabs' | 'settings'>('tabs');

  // === Life Counter Settings & Reset ===
  const [lifeCounterSettings, setLifeCounterSettings] = useState(DEFAULT_GAME_SETTINGS);
  const [resetToken, setResetToken] = useState(0);

  // === Modal ===
  const [showCounterSettingsModal, setShowCounterSettingsModal] = useState(false);

  // === Routes ===
  const routes = [
    { key: 'home', title: 'Home', icon: 'home' },
    // { key: 'collection', title: 'Collection', icon: 'cards' },
    {
      key: 'counter',
      title: 'Life Counter',
      icon: 'account-multiple-plus',
    },
  ];

  // === Render Scenes ===
  useBackToTabsOnSettingsScreen(screen === 'settings', () => setScreen('tabs'));

  const renderScene = useCallback(
    ({ route }: { route: { key: string } }) => {
      switch (route.key) {
        case 'home':
          return <HomeScreen />;
        case 'collection':
          return <CollectionScreen />;
        case 'counter':
          return (
            <LifeCounterScreen
              key={`${lifeCounterSettings.players}-${lifeCounterSettings.life}-${lifeCounterSettings.gameType}-${resetToken}`}
              players={lifeCounterSettings.players}
              initialLife={lifeCounterSettings.life}
              gameType={lifeCounterSettings.gameType}
              resetToken={resetToken}
            />
          );
        default:
          return null;
      }
    },
    [lifeCounterSettings, resetToken]
  );

  // === Bottom Navigation Handlers ===
  const onTabPress = useCallback(
    async ({ route }) => {
      const newIndex = routes.findIndex((r) => r.key === route.key);
      if (newIndex === -1) return;

      setIndex(newIndex);
      setScreen('tabs');
    },
    [index, routes]
  );

  const onTabLongPress = useCallback(
    ({ route }) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (route.key === 'counter') {
        setShowCounterSettingsModal(true);
      }
      if (route.key === 'home') {
        setScreen('settings');
      }
    },
    []
  );

  return (
    <PaperProvider theme={paperTheme}>
      {screen === 'tabs' ? (
        <>
          {renderScene({ route: routes[index] })}
          <BottomNavigation.Bar
            navigationState={{ index, routes }}
            onTabPress={onTabPress}
            onTabLongPress={onTabLongPress}
            renderIcon={({ route, color }) => (
              <MaterialCommunityIcons name={route.icon} color={color} size={26} />
            )}
            getLabelText={({ route }) => route.title}
          />
        </>
      ) : (
        <SettingsScreen
          onClose={() => setScreen('tabs')}
          isDark={isDark}
          setIsDark={setIsDark}
          systemScheme={systemScheme}
        />
      )}

      <CounterSettingsModal
        visible={showCounterSettingsModal}
        onDismiss={() => setShowCounterSettingsModal(false)}
        onStart={(settings) => {
          setLifeCounterSettings(settings);
          setShowCounterSettingsModal(false);
          setIndex(routes.findIndex((r) => r.key === 'counter'));
          setResetToken((prev) => prev + 1);
        }}
      />
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
