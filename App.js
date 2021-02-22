import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';

import * as firebase from 'firebase';
const firebaseConfig = {
  apiKey: 'AIzaSyBXmnhyfBa7zjJhxHzzUp7SSTjzVWBVLkg',
  authDomain: 'instagram-dev-b79da.firebaseapp.com',
  projectId: 'instagram-dev-b79da',
  storageBucket: 'instagram-dev-b79da.appspot.com',
  messagingSenderId: '987392304480',
  appId: '1:987392304480:web:f05f77ad16a5d5424b2a05',
  measurementId: 'G-SZ92YC11G8',
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Landing'>
        <Stack.Screen
          name='Landing'
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name='Register' component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
