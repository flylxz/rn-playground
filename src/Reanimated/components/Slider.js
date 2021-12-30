import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const HANDLE_WIDTH = 20;

export const Slider = ({ sliderWidth, progress }) => {
  //   const sliderWidth = useSharedValue(0);
  //   const progress = useSharedValue(0);

  const animatedHandleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: progress.value - HANDLE_WIDTH / 2,
      },
    ],
  }));

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startProgress = progress.value;
    },
    onActive: (event, ctx) => {
      progress.value = ctx.startProgress + event.translationX;
    },
    onEnd: () => {
      if (progress.value > sliderWidth.value) {
        progress.value = withSpring(sliderWidth.value);
      } else if (progress.value < 0) {
        progress.value = withSpring(0);
      }
    },
  });

  return (
    <View
      style={styles.progressbar}
      onLayout={e => (sliderWidth.value = e.nativeEvent.layout.width)}>
      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View style={[styles.slider, animatedHandleStyle]} />
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  progressbar: {
    backgroundColor: 'yellow',
    marginHorizontal: 30,
    marginBottom: 40,
    height: 20,
    borderRadius: 10,
  },
  slider: {
    width: HANDLE_WIDTH,
    backgroundColor: 'teal',
    borderRadius: 10,
    position: 'absolute',
    bottom: -20,
    top: -20,
  },
});
