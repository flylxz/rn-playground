import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';
// import {clamp} from '../utils/clamp';

export const clamp = (x, min, max) => {
  'worklet';
  if (x < min) return min;
  if (x > max) return max;
  return x;
};

const AnimatedInput = Animated.createAnimatedComponent(TextInput);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CircularProgress = ({
  progress,
  sliderWidth,
  radius = 100,
  strokeWidth = 10,
}) => {
  const CIRCUMFERENCE = 2 * Math.PI * radius;
  const HALF_WIDTH = radius + strokeWidth;

  const animatedInputProps = useAnimatedProps(() => {
    const percentComplete = clamp(progress.value / sliderWidth.value, 0, 1);

    return {
      text: `${Math.round(100 * percentComplete)}`,
      color: interpolateColor(
        percentComplete,
        [0, 0.5, 1],
        ['teal', 'teal', 'white'],
      ),
    };
  });

  const animatedBgProps = useAnimatedProps(() => {
    const percentComplete = clamp(progress.value / sliderWidth.value);

    return {
      fillOpacity: interpolate(percentComplete, [0, 1], [0.1, 0.75]),
    };
  });

  const animatedProgressProps = useAnimatedProps(() => {
    const percentComplete = clamp(progress.value / sliderWidth.value, 0, 1);

    return { strokeDashoffset: (1 - percentComplete) * CIRCUMFERENCE };
  });

  return (
    <View style={styles.container}>
      <View style={{ width: radius * 2, height: radius * 2 }}>
        <Svg
          width={radius * 2}
          height={radius * 2}
          viewBox={`${-HALF_WIDTH} ${-HALF_WIDTH} ${2 * HALF_WIDTH} ${
            2 * HALF_WIDTH
          }`}
        >
          <G rotation="-90">
            {/* Progress */}
            <AnimatedCircle
              cx={0}
              cy={0}
              r={radius}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              animatedProps={animatedProgressProps}
              stroke={'teal'}
            />
            <AnimatedCircle
              cx={0}
              cy={0}
              r={radius}
              stroke="rgb(180,180,180)"
              strokeWidth={2}
              strokeOpacity="0.1"
              strokeLinejoin="round"
              animatedProps={animatedBgProps}
              fill={'teal'}
            />
          </G>
        </Svg>
        <AnimatedInput
          editable={false}
          defaultValue="0"
          style={[
            StyleSheet.absoluteFill,
            { fontSize: radius / 2 },
            styles.text,
          ]}
          animatedProps={animatedInputProps}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '500',
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 4,
  },
});
