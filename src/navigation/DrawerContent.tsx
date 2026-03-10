import React from "react";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import Ionicons from "@react-native-vector-icons/ionicons";
import { logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="home" size={size} color={color} />
);

const SettingsIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="settings" size={size} color={color} />
);

const LogoutIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="log-out-outline" size={size} color={color} />
);

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const dispatch = useDispatch()

  const { navigation } = props;

  return (
    <DrawerContentScrollView {...props}>
  

     <DrawerItem
        label="Home"
        icon={HomeIcon}
        onPress={() =>
          navigation.navigate("mainTab", {
            screen: "HomeScreen",
          })
        }
      />

      <DrawerItem
        label="Settings"
        icon={SettingsIcon}
        onPress={() =>
          navigation.navigate("mainTab", {
            screen: "Settings",
          })
        }
      />

      <DrawerItem
        label="Logout"  
        icon={LogoutIcon}
        onPress={() => {
              dispatch(logout())
        }}
      />
    </DrawerContentScrollView>
  );
};



export default DrawerContent;