import { scryfallProvider } from "./scryfall";
import type { ProviderKey } from "./types";

export const providers: Record<ProviderKey, any> = {
  mtg: scryfallProvider,
  // pokemon: pokemonProvider,
  // lorcana: lorcanaProvider,
};
