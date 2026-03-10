import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import DrawerNavigator from './DrawerNavigator';
import LoginScreen from '../screens/LoginScreen';
import { useSelector } from 'react-redux';

export type AppStackParamList = {
  MainApp: undefined;
  DetailsShowScreen: { user: any };
  Login: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

export default function AppStack() {
  const isLoggedin = useSelector((state: any) => state?.auth?.isLoggedIn);
  console.log('isLoggedin', isLoggedin)
  return (
    <Stack.Navigator initialRouteName='Login'>

      {isLoggedin ? <Stack.Screen
        name="MainApp"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      /> :
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

      }
    </Stack.Navigator>
  );
}