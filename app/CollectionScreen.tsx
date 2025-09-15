import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

type CardItem = {
  id: string;
  name: string;
  image_url: string;
  set_name: string;
  rarity: string;
};

const CollectionSearchScreen = () => {
  const theme = useTheme();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1); // for pagination
  const [hasMore, setHasMore] = useState(true);

  // Debounce input so search happens after user stops typing for a bit
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        fetchSearch(query, 1); // reset to page 1
      } else {
        setResults([]);
        setHasMore(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const fetchSearch = async (q: string, pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(q)}&page=${pageNum}`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.details || 'Error fetching cards');
      }
      // data.data is array of card objects
      const mapped: CardItem[] = data.data.map((card: any) => ({
        id: card.id,
        name: card.name,
        image_url: card.image_uris?.small ?? card.image_uris?.normal ?? card.image_uris?.large ?? '',
        set_name: card.set_name,
        rarity: card.rarity,
      }));
      if (pageNum === 1) {
        setResults(mapped);
      } else {
        setResults(prev => [...prev, ...mapped]);
      }
      setHasMore(data.has_more); // Scryfall indicates if more pages
      setPage(pageNum);
    } catch (e) {
      console.error('Scryfall search error', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!hasMore || loading) return;
    fetchSearch(query, page + 1);
  };

  const renderItem = ({ item }: { item: CardItem }) => (
    <TouchableOpacity style={styles.cardContainer}>
      <Surface style={styles.card}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, { backgroundColor: theme.colors.surfaceVariant }]} />
        )}
        <View style={styles.cardText}>
          <Text style={[styles.cardName, { color: theme.colors.onBackground }]}>{item.name}</Text>
          <Text style={[styles.cardMeta, { color: theme.colors.onSurface }]}>{item.set_name} • {item.rarity}</Text>
        </View>
      </Surface>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        placeholder="Search cards..."
        value={query}
        onChangeText={setQuery}
        style={[styles.searchInput, { backgroundColor: theme.colors.surface }]}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />
      {loading && page === 1 ? (
        <ActivityIndicator style={styles.loading} />
      ) : error ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
};

export default CollectionSearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  loading: {
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
  },
  cardContainer: {
    paddingVertical: 6,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    marginBottom: 8,
  },
  cardImage: {
    width: 60,
    height: 90,
  },
  cardText: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardMeta: {
    fontSize: 12,
    marginTop: 4,
  },
});
