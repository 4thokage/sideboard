import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFonts } from "expo-font";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import { BottomNavigation, MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

import { useBackToTabsOnSettingsScreen } from "@/hooks/use-back-to-tabs";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

import CounterSettingsModal from "@/components/ui/CounterSettingsModal";
import { AppIconName, DEFAULT_GAME_SETTINGS, GameSettings } from "@/constants/storage";

import CollectionScreen from "./CollectionScreen";
import HomeScreen from "./index";
import LifeCounterScreen from "./LifeCounterScreen";
import SearchScreen from "./SearchScreen";
import SettingsScreen from "./SettingsScreen";

type AppRoute = {
  key: string;
  title: string;
  icon: AppIconName;
};

type SceneProps = {
  route: AppRoute;
};

// === App Routes ===
const routes: AppRoute[] =  [
  { key: "home", title: "Home", icon: "home" },
  { key: "search", title: "Search", icon: "magnify" },
  { key: "collection", title: "Collection", icon: "cards" },
  { key: "counter", title: "Life Counter", icon: "account-multiple-plus" },
];

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...MaterialCommunityIcons.font,
  });

  // === Theme ===
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === "dark");
  const { theme } = useMaterial3Theme();

  const paperTheme = useMemo(
    () =>
      isDark
        ? { ...MD3DarkTheme, colors: theme.dark }
        : { ...MD3LightTheme, colors: theme.light },
    [isDark, theme]
  );

  // === App Navigation State ===
  const [index, setIndex] = useState(0);
  const [screen, setScreen] = useState<"tabs" | "settings">("tabs");

  // === Life Counter Config ===
  const [lifeCounterSettings, setLifeCounterSettings] = useState(DEFAULT_GAME_SETTINGS);
  const [resetToken, setResetToken] = useState(0);

  // === Modals ===
  const [showCounterSettingsModal, setShowCounterSettingsModal] = useState(false);

  // Auto-return from settings via hardware back or gestures
  useBackToTabsOnSettingsScreen(screen === "settings", () => setScreen("tabs"));

  // === Render Screens ===
  const renderScene = useCallback(
    ({ route }: SceneProps) => {
      switch (route.key) {
        case "home":
          return <HomeScreen />;

        case "search":
          return <SearchScreen />;

        case "collection":
          return <CollectionScreen />;

        case "counter":
          return (
            <LifeCounterScreen
              key={resetToken}
              players={lifeCounterSettings.players}
              initialLife={lifeCounterSettings.life}
              gameType={lifeCounterSettings.gameType}
            />
          );

        default:
          return null;
      }
    },
    [lifeCounterSettings, resetToken]
  );

  // === Tab Press Handlers ===
  const onTabPress = useCallback(({ route }: { route: AppRoute }) => {
    const newIndex = routes.findIndex((r) => r.key === route.key);
    if (newIndex < 0) return;
    setIndex(newIndex);
    setScreen("tabs");
  }, []);

  const onTabLongPress = useCallback(({ route }: { route: AppRoute }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (route.key === "counter") setShowCounterSettingsModal(true);
    if (route.key === "home") setScreen("settings");
  }, []);

  return (
    <PaperProvider theme={paperTheme}>
      {screen === "tabs" ? (
        <>
          {renderScene({ route: routes[index] })}

          <BottomNavigation.Bar
            navigationState={{ index, routes }}
            onTabPress={onTabPress}
            onTabLongPress={onTabLongPress}
            renderIcon={({ route, color }) => (
              <MaterialCommunityIcons name={route.icon} size={26} color={color} />
            )}
            getLabelText={({ route }) => route.title}
          />
        </>
      ) : (
        <SettingsScreen
          onClose={() => setScreen("tabs")}
          isDark={isDark}
          setIsDark={setIsDark}
          systemScheme={systemScheme === "unspecified" ? null : systemScheme}
        />
      )}

      {/* ===== Modals ===== */}
      <CounterSettingsModal
        visible={showCounterSettingsModal}
        onDismiss={() => setShowCounterSettingsModal(false)}
        onStart={(settings: GameSettings) => {
          setLifeCounterSettings(settings);
          setShowCounterSettingsModal(false);
          setIndex(routes.findIndex((r) => r.key === "counter"));
          setResetToken((t) => t + 1);
        }}
      />

      <StatusBar style="auto" />
    </PaperProvider>
  );
}
