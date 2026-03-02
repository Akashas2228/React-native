import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Ionicons from '@react-native-vector-icons/ionicons';

import BottomTabs from './BottomTabs';
import SettingsScreen from '../screens/SettingsScreen';

export type DrawerParamList = {
  Dashboard: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

/**
 * Drawer icon helper
 * (moved outside to fix eslint no-unstable-nested-components)
 */
const getDrawerIcon = (
  routeName: keyof DrawerParamList,
  color: string,
  size: number,
) => {
  let iconName: string = 'grid';

  switch (routeName) {
    case 'Dashboard':
      iconName = 'grid';
      break;
    case 'Settings':
      iconName = 'settings';
      break;
    default:
      iconName = 'ellipse';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={({route}) => ({
        headerShown: true,
        drawerActiveTintColor: '#007bff',
        drawerIcon: ({color, size}) =>
          getDrawerIcon(route.name as keyof DrawerParamList, color, size),
      })}>
      <Drawer.Screen
        name="Dashboard"
        component={BottomTabs}
        options={{title: 'Dashboard'}}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Settings'}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;