import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import OrderHistory from './OrderHistory';
import {FontAwesome } from 'react-native-vector-icons'
import Drawers from './DrawerScreen';
import AdminScreen from './AdminScreen';
const Tab = createBottomTabNavigator();
const Tabs = ({navigation,route}) => {

  return (
    <Tab.Navigator screenOptions={{tabBarActiveTintColor:'darkblue'}}>
      <Tab.Screen name="Drawers" component={Drawers}  options={{
        headerShown:false,
      tabBarLabel: 'Home',
      tabBarIcon: ({ color, size }) => (
        <FontAwesome name="home" color={color} size={size} />
      ),}}/>

      <Tab.Screen name="OrderHistory" component={OrderHistory} options={{
      tabBarLabel: 'Order History',
      tabBarIcon: ({ color, size }) => (
        <FontAwesome name="user" color={color} size={size} />
      ),headerTitle:"Order History"}}/>

<Tab.Screen name="AdminScreen" component={AdminScreen} options={{
      tabBarLabel: 'AdminScreen',
      tabBarIcon: ({ color, size }) => (
        <FontAwesome name="user" color={color} size={size} />
      ),headerTitle:"AdminScreen"}}/>
    </Tab.Navigator>
  )
}

export default Tabs

const styles = StyleSheet.create({})