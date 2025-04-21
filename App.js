import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import SoundPlayerScreen from './screens/SoundPlayerScreen'
import WelcomeScreen from "./screens/WelcomeScreen";
import AccountScreen from "./screens/AccountScreen";
import PersonalInfoScreen from "./screens/PersonalInfoScreen";
import HelpSupportScreen from "./screens/HelpSupportScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
              headerShown: false,
            }}
        >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SoundPlayer" component={SoundPlayerScreen} />
            <Stack.Screen name="Account" component={AccountScreen} />
            <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
            <Stack.Screen name="Support" component={HelpSupportScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
