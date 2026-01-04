import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '@/constants/colors';

interface WaveformAnimationProps {
  isPlaying: boolean;
  color?: string;
  bars?: number;
}

export function WaveformAnimation({
  isPlaying,
  color = colors.accent,
  bars = 20,
}: WaveformAnimationProps) {
  const animatedValues = useRef(
    Array.from({ length: bars }, () => new Animated.Value(0.2))
  ).current;

  useEffect(() => {
    if (isPlaying) {
      const animations = animatedValues.map((value, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              toValue: 1,
              duration: 300 + Math.random() * 200,
              useNativeDriver: false,
            }),
            Animated.timing(value, {
              toValue: 0.2,
              duration: 300 + Math.random() * 200,
              useNativeDriver: false,
            }),
          ]),
          { iterations: -1 }
        )
      );

      animations.forEach((animation, index) => {
        setTimeout(() => animation.start(), index * 50);
      });

      return () => {
        animations.forEach((animation) => animation.stop());
      };
    } else {
      animatedValues.forEach((value) => {
        Animated.timing(value, {
          toValue: 0.2,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [isPlaying]);

  return (
    <View style={styles.container}>
      {animatedValues.map((value, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              backgroundColor: color,
              height: value.interpolate({
                inputRange: [0, 1],
                outputRange: ['20%', '100%'],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    paddingHorizontal: 4,
  },
  bar: {
    flex: 1,
    marginHorizontal: 1,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
});
