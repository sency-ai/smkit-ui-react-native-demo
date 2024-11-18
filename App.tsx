import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Home';
import ResultDisplayScreen from './ResultDisplayScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Result" component={ResultDisplayScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sdk:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    padding: 10,
    elevation: 2,
    borderColor: "blue",
    borderWidth: 1,
    margin: 5
  },
  textStyle: {
    color: 'blue',
    fontWeight: 'bold',
    textAlign: 'center',
  },
    centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
});

export default App;
