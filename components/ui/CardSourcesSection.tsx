import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button, Checkbox, List, useTheme } from 'react-native-paper';

const CARD_SOURCES = [
  { key: 'mtg', title: 'MTG', description: 'MtgJson' },
  { key: 'lorcana', title: 'Lorcana', description: 'Official API' },
  { key: 'pokemon', title: 'Pokémon', description: 'PokeTCG.io' },
  { key: 'fab', title: 'Flesh and Blood', description: 'FAB DB' },
];

const CardSourcesSection = () => {
  const theme = useTheme();
  const [checkedSources, setCheckedSources] = useState<Record<string, boolean>>({});

  const toggleSource = (key: string) => {
    setCheckedSources(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <View style={styles.container}>

      <View style={styles.grid}>
        {CARD_SOURCES.map(source => (
          <View style={styles.gridItem} key={source.key}>
          <List.Item
            title={source.title}
            description={source.description}
            onPress={() => toggleSource(source.key)} // Entire item is clickable
            right={() => (
              <Checkbox
                status={checkedSources[source.key] ? 'checked' : 'unchecked'}
                disabled 
              />
            )}
          />
          </View>
        ))}
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          icon="download-multiple"
          mode="contained"
          onPress={() => console.log('Download selected sources')}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
          style={styles.downloadButton}
        >
          Download
        </Button>
      </View>
    </View>
  );
};

export default CardSourcesSection;

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%', // 2 columns with spacing
    borderRadius: 8,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  downloadButton: {
    width: screenWidth * 0.5,
  },
});
