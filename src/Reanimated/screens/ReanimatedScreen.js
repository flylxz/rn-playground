import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { CircularProgress } from '../components/CircularProgress';
import { Slider } from '../components/Slider';

const ReanimatedScreen = () => {
  const sliderWidth = useSharedValue(0);
  const progress = useSharedValue(0);

  return (
    <View style={styles.screen}>
      <CircularProgress sliderWidth={sliderWidth} progress={progress} />
      <Slider sliderWidth={sliderWidth} progress={progress} />
    </View>
  );
};

export default ReanimatedScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'rgb(234,234,234)',
    justifyContent: 'space-between',
  },
});
