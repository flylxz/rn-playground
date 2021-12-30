import { useNavigation, StackActions } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Button, Alert } from 'react-native';
import { useAuth } from '../providers/AuthProvider';

export const Logout = ({ closeRealm }) => {
  const { signOut } = useAuth();
  const navigation = useNavigation();

  return (
    <Button
      title="Log Out"
      onPress={() => {
        Alert.alert('Log Out', null, [
          {
            text: 'Yes, Log Out',
            style: 'destructive',
            onPress: () => {
              navigation.dispatch(StackActions.popToTop());
              closeRealm();
              signOut();
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]);
      }}
    />
  );
};
