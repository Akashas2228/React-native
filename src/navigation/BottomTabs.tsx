import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';

import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { BottomTabParamList } from '../types/navigation';
import { HomeStackScreen } from './RootStackScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const getTabIcon = (routeName: string, color: string, size: number) => {
  let iconName:string = 'home';

  if (routeName === 'Home') iconName = 'home';
  if (routeName === 'Profile') iconName = 'person';
  if (routeName === 'Settings') iconName = 'settings';

  return <Ionicons name={iconName as any} size={size} color={color} />;
};

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) =>
          getTabIcon(route.name, color, size),
      })}>
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;