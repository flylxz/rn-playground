import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { YoutubeScreen } from '../screens/YoutubeScreen';
import DeepLinkScreen from '../screens/DeepLink';
import { RealmDbScreen } from '../RealmDbApp/screens/RealmDbScreen';
import { LoginView } from '../RealmDbApp/screens/LoginView';
import { LinksView } from '../RealmDbApp/screens/LinksView';
import { LinksProvider } from '../RealmDbApp/providers/LinkProvider';
import ReanimatedScreen from '../Reanimated/screens/ReanimatedScreen';
import { FormScreen } from '../ReactHookForm/screens/FormScreen';

const Stack = createNativeStackNavigator();

export const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Youtube" component={YoutubeScreen} />
      <Stack.Screen name="Reanimated" component={ReanimatedScreen} />
      <Stack.Screen name="DeepLink" component={DeepLinkScreen} />
      <Stack.Screen name="RealmDb" component={RealmDbScreen} />
      <Stack.Screen name="LoginView" component={LoginView} />
      <Stack.Screen name="Form" component={FormScreen} />
      <Stack.Screen name="LinksView">
        {() => (
          <LinksProvider>
            <LinksView />
          </LinksProvider>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
