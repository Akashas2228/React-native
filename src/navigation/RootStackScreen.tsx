import React from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import DetailsShowScreen from "../screens/DetailsShowScreen";
import MapScreen from "../screens/MapScreen";

export type HomeStackParamList = {
  HomeScreen: undefined;
  DetailsShowScreen: { user: any };
  MapScreen: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

export const HomeStackScreen: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="HomeScreen" >
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
        />

        <Stack.Screen
          name="DetailsShowScreen"
          component={DetailsShowScreen}
        />
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
        />
      </Stack.Navigator>
    </View>
  );
};
