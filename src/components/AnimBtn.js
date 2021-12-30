import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

export const AnimBtn = ({ navigateTo, bg, color }) => {
  const { navigate } = useNavigation();
  const animBtn = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animBtn.value }],
  }));

  return (
    <Pressable
      onPress={() => {
        animBtn.value = withSpring(0.9);
        setTimeout(() => (animBtn.value = 1), 300);
        navigate(navigateTo);
      }}
    >
      <Animated.View style={[styles.btn, { backgroundColor: bg }, animStyle]}>
        <Text style={[styles.btnTitle, { color }]}>{navigateTo}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'orange',
    borderRadius: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {
      height: 3,
      width: 3,
    },
  },
  btnTitle: {
    color: '#f1f1f1',
    fontSize: 24,
  },
});
