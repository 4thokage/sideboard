import PlayerModal, { LifeChange } from '@/components/ui/PlayerModal';
import { STORAGE_KEYS } from '@/constants/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

type Player = {
  id: number;
  life: number;
  history: LifeChange[];
};

type LifeCounterScreenProps = {
  players: number;
  initialLife: number;
  gameType?: string;
  resetToken?: number;
};

const saveGame = async (players: Player[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(players));
  } catch (e) {
    console.error('Error saving game', e);
  }
};

const loadGame = async (): Promise<Player[] | null> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Error loading game', e);
    return null;
  }
};

const LifeCounterScreen = ({ players, initialLife }: LifeCounterScreenProps) => {
  const theme = useTheme();
  const [playerStates, setPlayerStates] = useState<Player[]>([]);

  // Modal state
  const [playerModal, setPlayerModal] = useState<{ visible: boolean; playerId: number | null }>({
    visible: false,
    playerId: null,
  });

  // Ref to store pending life changes per player for debouncing/grouping
  // { [playerId]: { deltaSum, timer } }
  const pendingLifeChanges = useRef<Record<number, { deltaSum: number; timer: ReturnType<typeof setTimeout> | null }>>({});

  // Initialize players or load saved game
  useEffect(() => {
    const init = async () => {
      const saved = await loadGame();
      if (saved) {
        setPlayerStates(saved);
      } else {
        const initialPlayers = Array.from({ length: players }, (_, i) => ({
          id: i + 1,
          life: initialLife,
          history: [],
        }));
        setPlayerStates(initialPlayers);
      }
    };
    init();
  }, [players, initialLife]);

  // Save game on playerStates change
  useEffect(() => {
    if (playerStates.length > 0) {
      saveGame(playerStates);
    }
  }, [playerStates]);

  const colorPalette = [
    theme.colors.primary,
    theme.colors.secondary ?? theme.colors.tertiary,
    theme.colors.tertiary ?? theme.colors.primaryContainer,
    theme.colors.surfaceVariant,
    theme.colors.elevation?.level2 ?? '#ccc',
    theme.colors.error,
  ];


const updateLife = (playerId: number, delta: number) => {
  // Immediately update the life total in state (for UI responsiveness)
  setPlayerStates(prevPlayers =>
    prevPlayers.map(p => (p.id === playerId ? { ...p, life: p.life + delta } : p))
  );

  // Setup or update pending life changes for history grouping
  if (!pendingLifeChanges.current[playerId]) {
    pendingLifeChanges.current[playerId] = { deltaSum: 0, timer: null };
  }

  // Add delta to sum
  pendingLifeChanges.current[playerId].deltaSum += delta;

  // Clear existing timer if any
  if (pendingLifeChanges.current[playerId].timer) {
    clearTimeout(pendingLifeChanges.current[playerId].timer!);
  }

  // Set new timer to flush history entry after 1 second of inactivity
  pendingLifeChanges.current[playerId].timer = setTimeout(() => {
    const deltaSum = pendingLifeChanges.current[playerId].deltaSum;

    // Update history with accumulated deltaSum and current life total
    setPlayerStates(prevPlayers =>
      prevPlayers.map(p => {
        if (p.id === playerId) {
          const newLife = p.life; // life already updated above

          const newEntry: LifeChange = {
            timestamp: Date.now(),
            delta: deltaSum,
            total: newLife,
          };
          return {
            ...p,
            history: [newEntry, ...p.history],
          };
        }
        return p;
      })
    );

    // Reset pending changes
    pendingLifeChanges.current[playerId] = { deltaSum: 0, timer: null };
  }, 1000);
};


  // Detect tap location to increment or decrement life
  const handleCardPress = (event: any, playerId: number) => {
    const { locationX, pageX } = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;
    const halfWidth = screenWidth / 2;

    const x = locationX ?? pageX;
    if (x < halfWidth) {
      updateLife(playerId, -1);
    } else {
      updateLife(playerId, 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {playerStates.map((player, index) => (
        <TouchableOpacity
          key={player.id}
          activeOpacity={0.9}
          onPress={e => handleCardPress(e, player.id)}
          onLongPress={() => setPlayerModal({ visible: true, playerId: player.id })}
          style={styles.touchWrapper}
        >
          <Surface
            style={[styles.playerCard, { backgroundColor: colorPalette[index % colorPalette.length] }]}
            elevation={2}
          >
            <View style={styles.centeredContent}>
              <Text style={styles.lifeTotal}>{player.life}</Text>
            </View>
          </Surface>
        </TouchableOpacity>
      ))}
      {playerModal.visible && (
        <PlayerModal
          visible={playerModal.visible}
          onDismiss={() => setPlayerModal({ visible: false, playerId: null })}
          playerId={playerModal.playerId!}
          history={playerStates.find(p => p.id === playerModal.playerId)?.history || []}
        />
      )}
    </View>
  );
};

export default LifeCounterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    gap: 10,
  },
  touchWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
  playerCard: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'space-between',
    padding: 20,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lifeTotal: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
