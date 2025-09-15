export const STORAGE_KEYS = {
  CURRENT_GAME: '@@sideboard_currentGame',
  COUNTER_SETTINGS: '@sideboard_counterSettings',
};

export const MIN_PLAYERS = 1;
export const MAX_PLAYERS = 6;

export const MIN_LIFE = 0;
export const MAX_LIFE = 2_147_483_647;

// --- Game Types & Defaults ---

export const GAME_TYPES = ['MTG', 'EDH', 'Lorcana',] as const;

export type GameType = (typeof GAME_TYPES)[number];

export type GameSettings = {
  players: number;
  life: number;
  gameType: GameType;
};

// Optional default settings per game type
export const GAME_TYPE_DEFAULTS: Partial<Record<GameType, Omit<GameSettings, 'gameType'>>> = {
  MTG: { players: 2, life: 20 },
  EDH: { players: 4, life: 40 },
  Lorcana: { players: 2, life: 0 },
};

// Fallback for types like "Any"
export const DEFAULT_GAME_SETTINGS: GameSettings = {
  players: 2,
  life: 20,
  gameType: 'MTG',
};