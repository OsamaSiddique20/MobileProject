import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './components/Home';
import Settings from './components/Settings';
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

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="AdminScreen" component={AdminScreen} />
    <Stack.Screen name="ResturantScreen" component={ResturantScreen} />
  </Stack.Navigator>
)

const RestTocart = () => (
  <Stack.Navigator>

    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="MenuScreen" component={MenuScreen} />
    <Stack.Screen name="MenuDetails" component={MenuDetails} />
    <Stack.Screen name="Cart" component={Cart} />
    <Stack.Screen name="Delivery" component={Delivery} />
  </Stack.Navigator>
)

export default function App() {
  return (
    // <NavigationContainer>
    //   <Tab.Navigator>
      
    //     <Tab.Screen name="HomeScreen" component={RestTocart} />

    //     <Tab.Screen name="OrderHistory" component={OrderHistory} />

    //     <Tab.Screen name="AdminScreenTab" component={HomeStack} />
  
    //   </Tab.Navigator>
    // </NavigationContainer>


    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{
            headerShown: false,
          }}
        />
          {/* <Stack.Screen
          name="RestTocart"
          component={RestTocart}
          options={{
            headerShown: false,
          }}
        /> */}
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="MenuScreen" component={MenuScreen} />
    <Stack.Screen name="MenuDetails" component={MenuDetails} />
    <Stack.Screen name="Cart" component={Cart} />
    <Stack.Screen name="Delivery" component={Delivery} />
      
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
