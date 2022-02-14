import React from 'react'
import {Platform} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'
// import { createDrawerNavigator } from '@react-navigation/drawer'

import SignUpScreen from '../screens/SignUpScreen'
import SignInScreen from '../screens/SignInScreen'
import Language from '../screens/Language'
import ForgotPassword from '../screens/ForgotPassword'

import Colors from '../constants/Colors'
import NotActivated from '../screens/Specialist User/NotActivated'

const defaultStackNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : 'white',
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold',
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
}

const AuthStack = createStackNavigator()

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={defaultStackNavOptions}
      initialRouteName="language">
      <AuthStack.Screen
        name="language"
        component={Language}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="signup"
        component={SignUpScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="signin"
        component={SignInScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="forgotPassword"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="notActivated"
        component={NotActivated}
        options={{headerShown: false}}
      />
    </AuthStack.Navigator>
  )
}
