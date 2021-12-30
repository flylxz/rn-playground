import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, View, Alert, Button, TextInput } from 'react-native';
import { useAuth } from '../providers/AuthProvider';
import styles from '../styles/stylesheet';

export const LoginView = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, signUp, signIn } = useAuth();

  useEffect(() => {
    if (user) {
      navigation.navigate('LinksView');
    }
  }, [user]);

  const onPressSignIn = async (email, password) => {
    console.log('Trying sign in with user: ', email, password);
    try {
      await signIn(email, password);
    } catch (error) {
      const errorMessage = `Failed to sign in: ${error.message}`;
      console.warn(errorMessage);
      Alert.alert(errorMessage);
    }
  };

  const onPressSignUp = async (email, password) => {
    // console.log('Trying sign up with user: ', email);
    try {
      await signUp(email, password);
      signIn(email, password);
    } catch (error) {
      const errorMessage = `Failed to sign up: ${error.message}`;
      console.warn(errorMessage);
      alert(errorMessage);
    }
  };

  return (
    <View>
      <Text>SignUp or SignIn</Text>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          style={styles.inputStyle}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={setPassword}
          value={password}
          placeholder="Email"
          style={styles.inputStyle}
          secureTextEntry
        />
      </View>
      <Button onPress={() => onPressSignIn(email, password)} title="Sign In" />
      <Button onPress={() => onPressSignUp(email, password)} title="Sign Up" />
    </View>
  );
};
