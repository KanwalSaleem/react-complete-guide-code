import React from 'react'
import {Platform, TouchableOpacity, Text} from 'react-native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import LoginForm from '../screens/LoginForm'
import Colors from '../constants/Colors'
import LoginScreen from '../screens/LoginScreen'

import SignUpForm from '../screens/SignUpForm'
import NIN from '../screens/GuestVerification/NIN'
import DocumentNo from '../screens/GuestVerification/DocumentNo'
import TelephoneNo from '../screens/GuestVerification/TelephoneNo'
import FAQ from '../screens/FAQ'
import VerifyNIN from '../screens/GuestVerification/VerifyNIN'
import Profile from '../screens/Profile'

import SubmissionSuccessful from '../screens/SubmissionSuccesful'
import HowToVideos from '../screens/HowToVideos'
import VerificationHistory from '../screens/GuestVerification/VerificationHistory'
import ForgotPassword from '../screens/ForgotPassword'
import HowItWorks from '../screens/HowItWorks'
import LicensVerification from '../screens/GuestVerification/LicenseVerification'
import OTP from '../screens/OTP'
import ResetPassword from '../screens/ResetPassword'
import AppOverview from '../screens/Videos/AppOverview'
import HowToVerify from '../screens/Videos/HowToVerify'
import LoadAccountBalance from '../screens/Videos/LoadAccountBalance'
import DateOfBirth from '../screens/GuestVerification/DateOfBirth'

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
  headerTintColor: 'black',
})
const AuthStack = createNativeStackNavigator()

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={defaultNavOptions}
      initialRouteName="loginScreen">
      <AuthStack.Screen
        name="loginScreen"
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
        name="document"
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
        options={{title: 'Search Types'}}
      />
      <AuthStack.Screen
        name="profile"
        component={Profile}
        options={{title: 'Home'}}
      />
      <AuthStack.Screen
        name="submissionsuccess"
        component={SubmissionSuccessful}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="videos"
        component={HowToVideos}
        options={{title: 'How to videos'}}
      />

      <AuthStack.Screen name="faq" component={FAQ} options={{title: 'FAQ'}} />
      <AuthStack.Screen
        name="howItWorks"
        component={HowItWorks}
        options={{title: 'How It Works'}}
      />
      <AuthStack.Screen
        name="licenseVerification"
        component={LicensVerification}
        options={{title: 'Verify NIN'}}
      />

      <AuthStack.Screen
        name="verificationHistory"
        component={VerificationHistory}
        options={{title: 'Verification History'}}
      />
      <AuthStack.Screen
        name="forgotPassword"
        component={ForgotPassword}
        options={{title: 'Forgot Password'}}
      />
      <AuthStack.Screen name="otp" component={OTP} options={{title: ''}} />
      <AuthStack.Screen
        name="resetPassword"
        options={{title: 'Reset Password'}}
        component={ResetPassword}
      />
      <AuthStack.Screen
        name="appOverview"
        component={AppOverview}
        options={{title: 'App Overview'}}
      />
      <AuthStack.Screen
        name="howToVerify"
        component={HowToVerify}
        options={{title: 'How To Verify'}}
      />
      <AuthStack.Screen
        name="loadAccountBalance"
        component={LoadAccountBalance}
        options={{title: 'Load Account Balance'}}
      />
      <AuthStack.Screen
        name="filterDateOfBirth"
        component={DateOfBirth}
        options={{headerShown: false}}
      />
    </AuthStack.Navigator>
  )
}
