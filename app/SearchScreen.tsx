import { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, SegmentedButtons, Text, TextInput } from "react-native-paper";

import { providers } from "@/services/providers";
import type { ProviderKey } from "@/services/providers/types";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState<ProviderKey>("mtg");

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchCards(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, provider]);

  const searchCards = async (q: string) => {
    try {
      setLoading(true);
      const data = await providers[provider].search(q);
      setResults(data);
    } catch (err) {
      console.error("Card search failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium">Search Cards</Text>

      {/* Provider selector */}
      <SegmentedButtons
        value={provider}
        onValueChange={(v) => setProvider(v as ProviderKey)}
        style={{ marginTop: 12 }}
        buttons={[
          { value: "mtg", label: "MTG" },
          // { value: "pokemon", label: "Pokémon" },
          // { value: "lorcana", label: "Lorcana" },
        ]}
      />

      {/* Search input */}
      <TextInput
        mode="outlined"
        label="Search by name"
        value={query}
        onChangeText={setQuery}
        style={{ marginTop: 12 }}
      />

      {/* Loading */}
      {loading && (
        <View style={{ marginTop: 30 }}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: 60, height: 90, borderRadius: 4, marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium">{item.name}</Text>
              <Text variant="bodySmall">{item.type}</Text>
              <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                {item.setName}
              </Text>
              {item.price && (
                <Text variant="bodyMedium" style={{ marginTop: 4 }}>
                  Price: €{item.price}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
