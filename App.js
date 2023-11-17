import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './components/Home';
import Settings from './components/Settings';
import LoginScreen from './components/LoginScreen';
import AdminScreen from './components/AdminScreen';
import ResturantScreen from './components/ResturantScreen';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="AdminScreen" component={AdminScreen} />
    <Stack.Screen name="ResturantScreen" component={ResturantScreen} />
  </Stack.Navigator>
);
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Settings" component={Settings} />
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="AdminScreenTab" component={HomeStack} />
  
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
