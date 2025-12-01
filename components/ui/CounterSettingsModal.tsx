import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  HelperText,
  Modal,
  Portal,
  RadioButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

import { GAME_TYPE_DEFAULTS, GAME_TYPES, GameSettings, GameType, MAX_LIFE, MAX_PLAYERS, MIN_LIFE, MIN_PLAYERS, STORAGE_KEYS } from '@/constants/storage';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onStart: (settings: GameSettings) => void;
};

export default function CounterSettingsModal({ visible, onDismiss, onStart }: Props) {
  const theme = useTheme();

  const [players, setPlayers] = useState('');
  const [life, setLife] = useState('');
  const [gameType, setGameType] = useState(GAME_TYPES[0]);

  // Load saved settings when modal opens
  useEffect(() => {
    if (visible) {
      (async () => {
        try {
          const savedSettingsRaw = await AsyncStorage.getItem(STORAGE_KEYS.COUNTER_SETTINGS);
          if (savedSettingsRaw) {
            const savedSettings = JSON.parse(savedSettingsRaw);
            setPlayers(String(savedSettings.players ?? MIN_PLAYERS));
            setLife(String(savedSettings.life ?? 20));
            setGameType(savedSettings.gameType ?? GAME_TYPES[0]);
          } else {
            // Defaults
            setPlayers(String(MIN_PLAYERS));
            setLife('20');
            setGameType(GAME_TYPES[0]);
          }
        } catch (e) {
          console.warn('Failed to load counter settings', e);
        }
      })();
    }
  }, [visible]);

  // Validations
  const playersNumber = Number(players);
  const lifeNumber = Number(life);

  const validPlayers =
    Number.isInteger(playersNumber) && playersNumber >= MIN_PLAYERS && playersNumber <= MAX_PLAYERS;
  const validLife =
    Number.isInteger(lifeNumber) && lifeNumber >= MIN_LIFE && lifeNumber <= MAX_LIFE;

  const canStart = validPlayers && validLife;

  // Save settings before starting
  const handleStart = async () => {
    if (!canStart) return;

    try {
      const settings = {
        players: playersNumber,
        life: lifeNumber,
        gameType,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.COUNTER_SETTINGS, JSON.stringify(settings));
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
      onStart(settings);
    } catch (error) {
      console.error('Failed to save settings', error);
    }
  };

  const onGameTypeChange = (type: GameType) => {
  setGameType(type);

  const defaults = GAME_TYPE_DEFAULTS[type];
  if (defaults) {
    setPlayers(String(defaults.players));
    setLife(String(defaults.life));
  }
};

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
      >
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Track New Game</Text>

        <TextInput
          label={`Number of players (${MIN_PLAYERS}-${MAX_PLAYERS})`}
          value={players}
          onChangeText={(text) => {
            // Allow only digits, max 2 chars (e.g., "12")
            const clean = text.replace(/[^0-9]/g, '');
            if (clean.length <= 2) setPlayers(clean);
          }}
          keyboardType="number-pad"
          style={styles.input}
          error={!validPlayers && players.length > 0}
          maxLength={2}
          returnKeyType="done"
        />
        <HelperText type="error" visible={!validPlayers && players.length > 0}>
          Players must be an integer between {MIN_PLAYERS} and {MAX_PLAYERS}.
        </HelperText>

        <TextInput
          label={`Starting life total (${MIN_LIFE}-${MAX_LIFE})`}
          value={life}
          onChangeText={(text) => {
            const clean = text.replace(/[^0-9]/g, '');
            if (clean.length <= 4) setLife(clean);
          }}
          keyboardType="number-pad"
          style={styles.input}
          error={!validLife && life.length > 0}
          maxLength={4}
          returnKeyType="done"
        />
        <HelperText type="error" visible={!validLife && life.length > 0}>
          Life total must be an integer between {MIN_LIFE} and {MAX_LIFE}.
        </HelperText>

        <View style={styles.gameTypeContainer}>
          <Text style={{ color: theme.colors.onSurface, marginBottom: 6 }}>Game Type</Text>
          <RadioButton.Group onValueChange={onGameTypeChange} value={gameType}>
            {GAME_TYPES.map((type) => (
              <View key={type} style={styles.radioRow}>
                <RadioButton value={type} />
                <Text style={{ marginTop: 8 }}>{type}</Text>
              </View>
            ))}
          </RadioButton.Group>
        </View>

        <Button
          mode="contained"
          onPress={handleStart}
          disabled={!canStart}
          style={styles.startButton}
        >
          Start
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    marginBottom: 8,
  },
  gameTypeContainer: {
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButton: {
    marginTop: 10,
  },
});
