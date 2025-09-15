import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedTitleProps {
  text?: string; 
}

const AnimatedTitle = ({ title = 'Sideboard' }: AnimatedTitleProps) => {
  const animation = useSharedValue(0);
  const theme = useTheme(); 


  useEffect(() => {
    animation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0, { duration: 600 })
      ),
      -1,
      true
    );
  }, [animation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: animation.value * -4 },           // subtle bounce
        { skewX: `${animation.value * 2}deg` },         // card-like skew
        { rotateZ: `${animation.value * 0.5}deg` },     // slight tilt
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.Text  style={[{ color: theme.colors.onBackground, fontSize: 48, fontWeight: 'bold' }, animatedStyle]}>
        {title}
      </Animated.Text>
    </View>
  );
};

export default AnimatedTitle;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});
