import React, {useContext} from 'react'
import {Platform, TouchableOpacity, Text} from 'react-native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import NIN from '../screens/NIN'
import DocumentNo from '../screens/DocumentNo'
import TelephoneNo from '../screens/TelephoneNo'
import FAQ from '../screens/FAQ'
import VerifyNIN from '../screens/VerifyNIN'
import HowToVideos from '../screens/HowToVideos'
import VerificationHistory from '../screens/VerficationHistory'
import PaymentHistory from '../screens/PaymentHistory'
import HowItWorks from '../screens/HowItWorks'
import LicensVerification from '../screens/LicenseVerification'
import Colors from '../constants/Colors'
import Dashboard from '../screens/Dashboard'
import Balance from '../screens/Balance'
import Cart from '../screens/Cart'
import MyProfile from '../screens/MyProfile'
import {AuthContext} from '../context/Auth'
import AppOverview from '../screens/Videos/AppOverview'
import HowToVerify from '../screens/Videos/HowToVerify'
import LoadAccountBalance from '../screens/Videos/LoadAccountBalance'
import Pay from '../screens/Payment'
import DateOfBirth from '../screens/DateOfBirth'

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
const MainStack = createNativeStackNavigator()

export const MainNavigator = () => {
  const {setLoggedIn} = useContext(AuthContext)
  return (
    <MainStack.Navigator
      screenOptions={defaultNavOptions}
      initialRouteName="dashboard">
      <MainStack.Screen
        name="dashboard"
        component={Dashboard}
        options={{title: 'Dashboard'}}
      />
      <MainStack.Screen name="nin" component={NIN} options={{title: 'NIN'}} />
      <MainStack.Screen
        name="document"
        component={DocumentNo}
        options={{title: 'Document Number'}}
      />
      <MainStack.Screen
        name="telephoneNo"
        component={TelephoneNo}
        options={{title: 'Telephone Number'}}
      />

      <MainStack.Screen
        name="verifynin"
        component={VerifyNIN}
        options={{title: 'Search Types'}}
      />
      <MainStack.Screen
        name="videos"
        component={HowToVideos}
        options={{title: 'How to videos'}}
      />

      <MainStack.Screen name="faq" component={FAQ} options={{title: 'FAQ'}} />
      <MainStack.Screen
        name="howItWorks"
        component={HowItWorks}
        options={{title: 'How It Works'}}
      />
      <MainStack.Screen
        name="licenseVerification"
        component={LicensVerification}
        options={{title: 'Verify NIN'}}
      />
      <MainStack.Screen
        name="verificationHistory"
        component={VerificationHistory}
        options={{title: 'Verification History'}}
      />
      <MainStack.Screen
        name="paymentHistory"
        component={PaymentHistory}
        options={{title: 'Payment History'}}
      />

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
      <MainStack.Screen
        name="appOverview"
        component={AppOverview}
        options={{title: 'App Overview'}}
      />
      <MainStack.Screen
        name="howToVerify"
        component={HowToVerify}
        options={{title: 'How To Verify'}}
      />
      <MainStack.Screen
        name="loadAccountBalance"
        component={LoadAccountBalance}
        options={{title: 'Load Account Balance'}}
      />
      <MainStack.Screen
        name="payment"
        component={Pay}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="filterDateOfBirth"
        component={DateOfBirth}
        options={{headerShown: false}}
      />
    </MainStack.Navigator>
  )
}
