import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

type Props = {
  onReset: () => void;
  onUndo: () => void;
  onToggleHaptics: () => void;
  hapticsEnabled: boolean;
};

export default function HeaderBar({ onReset, onUndo, onToggleHaptics, hapticsEnabled }: Props) {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Button mode="contained" onPress={onReset}>
        Reset
      </Button>
      <Button mode="contained" onPress={onUndo}>
        Undo
      </Button>
      <Button mode="contained" onPress={onToggleHaptics}>
        Haptics: {hapticsEnabled ? 'On' : 'Off'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-around', padding: 8 },
});
