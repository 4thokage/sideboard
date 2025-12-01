import type { CardProvider, CardSearchResult } from "./types";

export const scryfallProvider: CardProvider = {
  async search(query: string): Promise<CardSearchResult[]> {
    const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.data) return [];

    return data.data.map((card: any): CardSearchResult => ({
      id: card.id,
      name: card.name,
      image:
        card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal ?? null,
      type: card.type_line ?? null,
      setName: card.set_name ?? null,
      price: card.prices?.eur ?? card.prices?.usd ?? null,
    }));
  },
};
