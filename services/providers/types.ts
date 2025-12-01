export interface CardSearchResult {
  id: string;
  name: string;
  image: string | null;
  type: string | null;
  setName: string | null;
  price?: number | null;
}

export interface CardProvider {
  search: (query: string) => Promise<CardSearchResult[]>;
}

export type ProviderKey = "mtg"; // TODO: no futuro: "pokemon" | "lorcana" | "yugioh"
