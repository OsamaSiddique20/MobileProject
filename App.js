import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,SafeAreaView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {FontAwesome } from 'react-native-vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider,  } from "react-native-safe-area-context";

import LoginScreen from './components/LoginScreen';
import AdminScreen from './components/AdminScreen';
import ResturantScreen from './components/ResturantScreen';
import HomeScreen from './components/HomeScreen';
import MenuScreen from './components/MenuScreen';
import MenuDetails from './components/MenuDetails';
import Cart from './components/Cart';
import Delivery from './components/Delivery';
import OrderHistory from './components/OrderHistory';
import DrawerScreen from './components/DrawerScreen';
import Tabs from './components/Tabs';
const Tab = createBottomTabNavigator();
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

import {
  createDrawerNavigator,
  DrawerToggleButton,
} from "@react-navigation/drawer";

const HomeStack = () => (
  <Stack.Navigator>
      <Tab.Navigator>
        <Tab.Screen name="RestTocart" component={RestTocart} options={{ title: 'Home' }} />
        <Tab.Screen name="OrderHistoryTab" component={OrderHistory} options={{ title: 'Order History' }} />
      </Tab.Navigator>
    </Stack.Navigator>
)

const RestTocart = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false }}/>
    <Stack.Screen name="MenuScreen" component={MenuScreen} options={{headerShown: false }}/>
    <Stack.Screen name="MenuDetails" component={MenuDetails} options={{headerShown: false }}/>
    <Stack.Screen name="Cart" component={Cart} options={{headerShown: false }}/>
    <Stack.Screen name="Delivery" component={Delivery} options={{headerShown: false }}/>
  </Stack.Navigator>
)

const TabNavigator = () =>(
 
  <Tab.Navigator screenOptions={{tabBarActiveTintColor:'darkblue'}}  >
    
  <Tab.Screen name="RestTocart" component={RestTocart} options={{
    
  tabBarLabel: 'Home', headerShown: false ,
  tabBarIcon: ({ color, size }) => (
    <FontAwesome name="home" color={color} size={size} />
  ),headerTitle:"" }}/>

<Tab.Screen name="OrderHistory" component={OrderHistory} options={{
  tabBarLabel: 'OrderHistory',headerShown: false ,
  tabBarIcon: ({ color, size }) => (
    <FontAwesome name="user" color={color} size={size} />
  ),headerTitle:"OrderHistory"}}/>
</Tab.Navigator>

)
const DrawerStack = () =>(
  
  <Drawer.Navigator
  initialRouteName="HomeScreen"
  screenOptions={{
    drawerPosition: "left",
    headerLeft: () => <DrawerToggleButton />,
    headerTitle: '',
      headerStyle: { backgroundColor: '#F7F7F7' },
  }}
>
  <Drawer.Screen
    name="TabNavigator"
    component={TabNavigator}
    screenOptions={{
      drawerPosition: "left",
      headerLeft: () => <DrawerToggleButton />,
      headerRight: false,
    }}
  />
  <Drawer.Screen
    name="Cart"
    component={Cart}
   
  />

</Drawer.Navigator>

)

export default function App() {
  return (
<SafeAreaView style={styles.container}>
    <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="DrawerStack" component={DrawerStack}  
  />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    
  },
});
