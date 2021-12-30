import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';

export const RealmDbScreen = () => {
  return (
    <View>
      <Text>SignUp or SignIn</Text>
      <View>
        <TextInput placeholder="email" autoCapitalize="none" />
      </View>
      <View>
        <TextInput placeholder="password" secureTextEntry />
      </View>
      <View>
        <Button title="SignIn" />
        <Button title="SignUp" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
