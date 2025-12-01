import PlayerModal, { LifeChange } from '@/components/ui/PlayerModal';
import { STORAGE_KEYS } from '@/constants/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';

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
  const [playerModal, setPlayerModal] = useState<{ visible: boolean; playerId: number | null }>({
    visible: false,
    playerId: null,
  });

  const pendingLifeChanges = useRef<Record<number, { deltaSum: number; timer: ReturnType<typeof setTimeout> | null }>>({});
  const deltaAnimRefs = useRef<Record<number, Animated.Value>>({});

  useEffect(() => {
    const init = async () => {
      const saved = await loadGame();
      if (saved) setPlayerStates(saved);
      else {
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

  useEffect(() => {
    if (playerStates.length > 0) saveGame(playerStates);
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
    Haptics.selectionAsync();

    if (!deltaAnimRefs.current[playerId]) deltaAnimRefs.current[playerId] = new Animated.Value(0);
    deltaAnimRefs.current[playerId].setValue(delta > 0 ? 1 : -1);

    Animated.timing(deltaAnimRefs.current[playerId], {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    setPlayerStates(prev =>
      prev.map(p => (p.id === playerId ? { ...p, life: p.life + delta } : p))
    );

    if (!pendingLifeChanges.current[playerId]) pendingLifeChanges.current[playerId] = { deltaSum: 0, timer: null };
    pendingLifeChanges.current[playerId].deltaSum += delta;

    if (pendingLifeChanges.current[playerId].timer) clearTimeout(pendingLifeChanges.current[playerId].timer!);

    pendingLifeChanges.current[playerId].timer = setTimeout(() => {
      const deltaSum = pendingLifeChanges.current[playerId].deltaSum;
      setPlayerStates(prev =>
        prev.map(p => {
          if (p.id === playerId) {
            const newEntry: LifeChange = { timestamp: Date.now(), delta: deltaSum, total: p.life };
            return { ...p, history: [newEntry, ...p.history] };
          }
          return p;
        })
      );
      pendingLifeChanges.current[playerId] = { deltaSum: 0, timer: null };
    }, 1000);
  };

  const handleCardPress = (event: any, playerId: number) => {
    const { locationX, pageX } = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;
    const x = locationX ?? pageX;
    updateLife(playerId, x < screenWidth / 2 ? -1 : 1);
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
              {deltaAnimRefs.current[player.id] && (
                <Animated.Text
                  style={{
                    position: 'absolute',
                    top: 10,
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: 'white',
                    transform: [
                      {
                        translateY: deltaAnimRefs.current[player.id].interpolate({
                          inputRange: [-1, 1],
                          outputRange: [10, -10],
                        }),
                      },
                    ],
                    opacity: deltaAnimRefs.current[player.id].interpolate({
                      inputRange: [-1, 0, 1],
                      outputRange: [0.8, 0, 0.8],
                    }),
                  }}
                >
                  {pendingLifeChanges.current[player.id]?.deltaSum > 0
                    ? `+${pendingLifeChanges.current[player.id]?.deltaSum}`
                    : pendingLifeChanges.current[player.id]?.deltaSum}
                </Animated.Text>
              )}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <Button mode="contained" onPress={() => updateLife(player.id, -1)}>
                -1
              </Button>
              <Button mode="contained" onPress={() => updateLife(player.id, 1)}>
                +1
              </Button>
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
  container: { flex: 1, paddingVertical: 10, gap: 10 },
  touchWrapper: { flex: 1, marginHorizontal: 10 },
  playerCard: { flex: 1, borderRadius: 12, justifyContent: 'space-between', padding: 20 },
  centeredContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  lifeTotal: { fontSize: 64, fontWeight: 'bold', color: 'white', textAlign: 'center' },
});
