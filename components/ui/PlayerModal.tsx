import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Modal, Portal, Surface, Text, useTheme } from 'react-native-paper';

export type LifeChange = {
  delta: number;
  timestamp: number;
  total: number;
};

type Props = {
  visible: boolean;
  onDismiss: () => void;
  history: LifeChange[];
  playerId: number;
};

export default function PlayerModal({ visible, onDismiss, history, playerId }: Props) {
  const theme = useTheme();

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}>
        <Text style={styles.title}>Player {playerId} History</Text>
        <FlatList
          data={history.slice().reverse()}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Surface style={styles.item} elevation={1}>
              <Text>{item.delta > 0 ? `+${item.delta}` : item.delta}</Text>
              <Text style={{ color: '#888', fontSize: 12 }}>
                → {item.total} HP
              </Text>
            </Surface>
          )}
        />
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
});
