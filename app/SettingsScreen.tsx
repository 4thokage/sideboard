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

  const [checked, setChecked] = React.useState(false);

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
{/*
      <List.Section title="Card Sources">
        <List.Item
          title="MTG"
          description="MtgJson"
          right={() => (
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked(!checked);
            }}
          />
          )}
        />
        <Button
          icon="download-multiple"
          mode="contained"
          onPress={() => console.log('Start MTG collection')}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
        >
          Download
        </Button>
      </List.Section>

      <Divider />

       Add more counter settings and collection settings */}
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
