import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Auth from './src/Pages/Auth';
import Home from './src/Pages/Home';
import AIsuggest from './src/Pages/AIsuggest'; 
import ProductSearch from './src/Pages/ProductSearch';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ProductSearch" component={ProductSearch} />
        <Stack.Screen name="AIsuggest" component={AIsuggest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
