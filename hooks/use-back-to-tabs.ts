import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export function useBackToTabsOnSettingsScreen(
  isSettingsScreen: boolean,
  onBack: () => void
) {
  useEffect(() => {
    if (!isSettingsScreen) return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });

    return () => {
      subscription.remove();
    };
  }, [isSettingsScreen, onBack]);
}
