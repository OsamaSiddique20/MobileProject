import "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  createDrawerNavigator,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./HomeScreen";
import OrderHistory from "./OrderHistory";
const Drawer = createDrawerNavigator();
const Drawers = ({navigation,route}) => {

  return (
    <Drawer.Navigator
    initialRouteName="HomeScreen"
    screenOptions={{
      drawerPosition: "left",
      headerLeft: () => <DrawerToggleButton />,
      headerRight: false,
    }}
  >
    <Drawer.Screen
      name="HomeScreen"
      component={HomeScreen}
      screenOptions={{
        drawerPosition: "left",
        headerLeft: () => <DrawerToggleButton />,
        headerRight: false,
      }}
    
    />


  </Drawer.Navigator>
  );
};

export default Drawers;

const styles = StyleSheet.create({});
