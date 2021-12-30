import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Form } from '../components/Form';

export const FormScreen = () => {
  return (
    <View style={styles.screen}>
      <Form />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
