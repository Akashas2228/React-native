import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import BottomTabs from "./BottomTabs";
import DrawerContent from "./DrawerContent";

const Drawer = createDrawerNavigator<any>();

const renderDrawerContent = (props: any) => (
  <DrawerContent {...props} />
);

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={renderDrawerContent}>
      <Drawer.Screen
        name="mainTab"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;