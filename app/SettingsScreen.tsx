import CardSourcesSection from '@/components/ui/CardSourcesSection';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Appbar,
  Divider,
  List,
  Switch,
  useTheme
} from 'react-native-paper';

type SettingsScreenProps = {
  onClose: () => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  systemScheme: 'light' | 'dark' | null | undefined;
};

const SettingsScreen = ({ onClose, isDark, setIsDark }: SettingsScreenProps) => {
  const theme = useTheme();
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header mode="small">
        <Appbar.BackAction onPress={onClose} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <List.Section title="Appearance">
        <List.Item
          title="Dark Theme"
          description="Enable dark mode"
          right={() => (
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
            />
          )}
        />
      </List.Section>

      <Divider />

      <List.Section title="Card Sources">
        <CardSourcesSection/>
      </List.Section>

      <Divider />

    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
