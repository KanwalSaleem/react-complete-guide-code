import React from 'react'
import SignUpForm from '../screens/SignUpForm'
import SignIn from '../screens/SignIn'
import Otpscreen from '../screens/OTPScreen'
import ForgotPassword from '../screens/ForgotPassword'
import ResetPassword from '../screens/ResetPassword'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import CaregiverInfo from '../screens/Caregiver/ProfessionalInfo'
import PhysicianInfo from '../screens/Physician/ProfessionalInfo'
import PrivacyPolicy from '../screens/PrivacyPolicy'
import TermsCondition from '../screens/TermsCondition'
import Dashboard from '../screens/Caregiver/Dashboard'
import BankingInfo from '../screens/Physician/BankingInfo'

import DiagnosticTreatmentPlan from '../screens/Physician/DiagnosticTreatment'

import Map from '../screens/Caregiver/Map'
import TreatmentScreen from '../screens/Caregiver/TreatmentScreen'
import AfterTreatmentChecklist from '../screens/Caregiver/AfterTreatmentChecklist'
import ServiceRequest from '../screens/Caregiver/ServiceRequest'

const AuthStack = createNativeStackNavigator()
const MainStack = createNativeStackNavigator()

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen name="signIn" component={SignIn} />
      <AuthStack.Screen name="forgetPassword" component={ForgotPassword} />

      <AuthStack.Screen name="signUp" component={SignUpForm} />
      <AuthStack.Screen name="resetPassword" component={ResetPassword} />
      <AuthStack.Screen name="otp" component={Otpscreen} />

      <AuthStack.Screen name="bankingInfo" component={BankingInfo} />
      <AuthStack.Screen name="caregiver" component={CaregiverInfo} />
      <AuthStack.Screen name="physician" component={PhysicianInfo} />
      <AuthStack.Screen name="policy" component={PrivacyPolicy} />
      <AuthStack.Screen name="terms" component={TermsCondition} />
    </AuthStack.Navigator>
  )
}

export const MainNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="home">
      <MainStack.Screen name="home" component={Dashboard} />
      <MainStack.Screen name="diagnostic" component={DiagnosticTreatmentPlan} />

      <MainStack.Screen name="map" component={Map} />
      <MainStack.Screen name="treatment" component={TreatmentScreen} />
      {/* <MainStack.Screen
        name="afterTreatment"
        component={AfterTreatmentChecklist}
      /> */}
      {/* <MainStack.Screen name="serviceRequest" component={ServiceRequest} /> */}
    </MainStack.Navigator>
  )
}
