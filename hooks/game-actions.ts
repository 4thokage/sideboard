import { STORAGE_KEYS } from '@/constants/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Player } from '../components/ui/LifeCounter/types';

export const saveGame = async (players: Player[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(players));
  } catch (e) {
    console.error('Error saving game', e);
  }
};

export const loadGame = async (): Promise<Player[] | null> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Error loading game', e);
    return null;
  }
};
