import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

const StaticTitle = () => {
  const theme = useTheme();

  return (
    <Text style={[styles.title, { color: theme.colors.onBackground }]}>
      Sideboard
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});

export default StaticTitle;