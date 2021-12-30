import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimBtn } from '../components/AnimBtn';

export const WelcomeScreen = () => {
  return (
    <View style={styles.screen}>
      <AnimBtn navigateTo={'Youtube'} bg={'red'} color={'black'} />
      <AnimBtn navigateTo={'Reanimated'} bg={'teal'} color={'black'} />
      <AnimBtn navigateTo={'DeepLink'} bg={'pink'} color={'black'} />
      <AnimBtn navigateTo={'LoginView'} bg={'beige'} color={'brown'} />
      <AnimBtn navigateTo={'Form'} bg={'orange'} color={'green'} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
