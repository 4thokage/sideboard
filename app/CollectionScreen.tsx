import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';

const CollectionScreen = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.title}>Your Collection</Text>

      <Surface style={styles.card} elevation={4}>
        <View style={styles.cardHeader}>
          <Image
            source={{ uri: 'https://cards.scryfall.io/normal/front/1/1/11f712fe-0b95-445b-b978-b8b73b9d1079.jpg?1592752674' }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Magic: The Gathering</Text>
            <Text style={styles.cardSubtitle}>Start tracking your MTG collection</Text>
          </View>
        </View>

        <Button
          icon="plus-box"
          mode="contained"
          onPress={() => console.log('Start MTG collection')}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
          style={styles.cardButton}
        >
          Start your collection
        </Button>
      </Surface>

      {/* More games can be added here later */}
    </View>
  );
};

export default CollectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  cardImage: {
    width: 64,
    height: 90,
    borderRadius: 6,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cardButton: {
    marginTop: 8,
  },
});
