import StaticTitle from '@/components/static-title';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  IconButton,
  Modal,
  Portal,
  Text, useTheme
} from 'react-native-paper';

const Title = () => {
  if (Platform.OS === 'web') {
    return <StaticTitle />;
  }

  const AnimatedTitle = require('@/components/animated-title').default;
  return <AnimatedTitle />;
};


const HomeScreen = () => {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);


  return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.titleRow}>

          <Title/>

          <IconButton
            icon="help-circle-outline"
            size={24}
            onPress={showModal}
            style={styles.helpButton}
          />
        </View>


        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
          >
            <Text style={styles.modalTitle}>What is Sideboard?</Text>
            <Text style={styles.modalText}>
              This app is designed to help you manage your card game experiences, from life counters to collection tracking. Use the tabs below to get started!
            </Text>
            <Text style={styles.modalText}>Also try long pressing on tabs for customization</Text>
          </Modal>
        </Portal>
      </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginRight: 8,
  },
  helpButton: {
    margin: 0,
  },
  modalContainer: {
    padding: 24,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 22,
  },
});
