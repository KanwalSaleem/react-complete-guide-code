import React from 'react'

import {Platform, Text, TouchableOpacity} from 'react-native'

import {createNativeStackNavigator} from '@react-navigation/native-stack'
import LoginForm from '../screens/LoginForm'
import Colors from '../constants/Colors'
import LoginScreen from '../screens/LoginScreen'
import SignUpForm from '../screens/SignUpForm'
import NIN from '../screens/NIN'
import DocumentNo from '../screens/DocumentNo'
import TelephoneNo from '../screens/TelephoneNo'
import MyProfile from '../screens/MyProfile'
import FAQ from '../screens/FAQ'
import Balance from '../screens/Balance'
import Cart from '../screens/Cart'
import SubmissionSuccessful from '../screens/SubmissionSuccesful'
import VerifyNIN from '../screens/VerifyNIN'
import Profile from '../screens/Profile'
import Dashboard from '../screens/Dashboard'
import LicenseVerification from '../screens/LicenseVerification'
import VerificationHistory from '../screens/VerficationHistory'
import PaymentHistory from '../screens/PaymentHistory'
import HowItWorks from '../screens/HowItWorks'
import HowToVideos from '../screens/HowToVideos'

const defaultNavOptions = (props) => ({
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? '#E5E5E5' : '#E5E5E5',
  },

  headerLeft: () => {
    return (
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Inter-SemiBold',
            color: Colors.primary,
          }}
          allowFontScaling={false}>
          Back
        </Text>
      </TouchableOpacity>
    )
  },
  headerShadowVisible: false,
  headerTitleAlign: 'center',
  headerTintColor: Platform.OS === 'android' ? 'black' : Colors.primary,
})

const AuthStack = createNativeStackNavigator()
const MainStack = createNativeStackNavigator()
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={(props) => ({
        headerStyle: {
          backgroundColor: Platform.OS === 'android' ? '#E5E5E5' : 'white',
        },
        headerTitleStyle: {
          fontSize: 24,
          fontFamily: 'Inter-SemiBold',
        },

        headerLeft: () => {
          return (
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Inter-SemiBold',
                  color: Colors.primary,
                }}
                allowFontScaling={false}>
                Back
              </Text>
            </TouchableOpacity>
          )
        },
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTintColor: Platform.OS === 'android' ? 'black' : Colors.primary,
      })}>
      <AuthStack.Screen
        name="login Screen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="loginForm"
        component={LoginForm}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="signUpForm"
        component={SignUpForm}
        options={{title: 'Sign Up'}}
      />
      <AuthStack.Screen name="nin" component={NIN} options={{title: 'NIN'}} />
      <AuthStack.Screen
        name="documentNo"
        component={DocumentNo}
        options={{title: 'Document Number'}}
      />
      <AuthStack.Screen
        name="telephoneNo"
        component={TelephoneNo}
        options={{title: 'Telephone Number'}}
      />
      <AuthStack.Screen
        name="verifynin"
        component={VerifyNIN}
        options={{title: 'Verify NIN'}}
      />
      <AuthStack.Screen
        name="profile"
        component={Profile}
        options={{title: 'Profile'}}
      />
      <AuthStack.Screen
        name="dashboard"
        component={Dashboard}
        options={{title: 'Dashboard'}}
      />
      <AuthStack.Screen
        name="verifylicense"
        component={LicenseVerification}
        options={{title: 'Verfy NIN'}}
      />
      <AuthStack.Screen
        name="verificationHistory"
        component={VerificationHistory}
        options={{title: 'Verification History'}}
      />
      <AuthStack.Screen
        name="paymentHistory"
        component={PaymentHistory}
        options={{title: 'Payment History'}}
      />
      <AuthStack.Screen
        name="submissionsuccess"
        component={SubmissionSuccessful}
        options={{headerShown: false}}
      />
    </AuthStack.Navigator>
  )
}

const MainStackNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={defaultNavOptions}
      initialRouteName="howtovideos">
      <MainStack.Screen
        name="balance"
        component={Balance}
        options={{title: 'Balance'}}
      />
      <MainStack.Screen
        name="cart"
        component={Cart}
        options={{title: 'Cart'}}
      />
      <MainStack.Screen
        name="myProfile"
        component={MyProfile}
        options={{title: 'My Profile'}}
      />
      <MainStack.Screen name="faq" component={FAQ} options={{title: 'FAQ'}} />
      <MainStack.Screen
        name="howitworks"
        component={HowItWorks}
        options={{title: 'How it works'}}
      />
      <MainStack.Screen
        name="howtovideos"
        component={HowToVideos}
        options={{title: 'How to videos'}}
      />
    </MainStack.Navigator>
  )
}
