import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DeviceMotion } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const AnimatedDice = () => {
  const theme = useTheme();
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [rolling, setRolling] = useState(false);

  const position = useRef(new Animated.ValueXY({ x: width / 2 - 30, y: 50 })).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let lastZ = 0;

    const subscription = DeviceMotion.addListener(({ acceleration }) => {
      if (!acceleration || rolling) return;

      const deltaZ = acceleration.z - lastZ;
      const fastDownFlick = acceleration.z > 1.5 && deltaZ > 1.0;

      if (fastDownFlick) {
        rollDice();
      }

      lastZ = acceleration.z;
    });

    DeviceMotion.setUpdateInterval(100); // 10Hz

    return () => subscription.remove();
  }, [rolling]);

  const rollDice = () => {
    if (rolling) return;

    const result = Math.floor(Math.random() * 20) + 1;
    setRolling(true);
    setVisible(true);
    setDiceValue(null);

    // Reset values
    position.setValue({ x: width / 2 - 30, y: 50 });
    rotateValue.setValue(0);

    Animated.parallel([
      Animated.timing(position, {
        toValue: {
          x: Math.random() * (width - 60),
          y: Math.random() * (height / 2),
        },
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDiceValue(result);

      setTimeout(() => {
        setVisible(false);
        setDiceValue(null);
        setRolling(false);
      }, 3000); // show result for 3s
    });
  };

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1080deg'],
  });

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.diceContainer,
        {
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { rotate },
          ],
        },
      ]}
    >
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons
          name="dice-d20"
          size={48}
          color={theme.colors.primary}
        />
        {diceValue !== null && (
          <View style={styles.resultBubble}>
            <Text style={styles.resultText}>{diceValue}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  diceContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  resultBubble: {
    position: 'absolute',
    top: -28,
    backgroundColor: '#000000cc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AnimatedDice;
