import React, {useContext} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import ForgotPassword from '../screens/ForgotPassword';

import OTP from '../screens/OTP';

import ForgotOTP from '../screens/ForgotOTP';
import ResetPassword from '../screens/ResetPassword';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import TermsConditions from '../screens/TermsConditions';
import {AuthContext} from '../context/AuthContext';

const Stack = createStackNavigator();

function PublicNav() {
  const {language} = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={({navigation}) => ({
        headerShown: false,
        // animationEnabled: false,
        headerShadowVisible: true,
        headerTitleAlign: 'center',
        title: '',

        headerLeft: () => (
          <TouchableOpacity
            style={{marginLeft: 20}}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-ios" size={25} color={'black'} />
          </TouchableOpacity>
        ),
      })}>
      {/* <Stack.Screen name="SplashScreen" component={SplashScreen} /> */}

      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          // headerTransparent: true,
          headerTitle: '',

          headerShown: true,
        }}
      />
      <Stack.Screen name="OTP" component={OTP} />
      <Stack.Screen name="ForgotOTP" component={ForgotOTP} />

      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          headerShown: true,
          title: language.changePassword,
          headerStyle: {
            elevation: 5,
            shadowColor: 'black',
            shadowOpacity: 0.26,
          },

          headerLeft: () => <></>,
        }}
      />
      {/* <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsConditions" component={TermsConditions} /> */}
      <Stack.Screen
        name="termsConditions"
        component={TermsConditions}
        options={{
          headerTitle: language.termsOfUse,
          headerShown: true,
          headerTitleStyle: {fontFamily: 'Roboto-Bold', fontSize: 18},
        }}
      />
      <Stack.Screen
        name="privacyPolicy"
        component={PrivacyPolicy}
        options={{
          headerTitle: language.privacyPolicy,
          headerShown: true,
          headerTitleStyle: {fontFamily: 'Roboto-Bold', fontSize: 18},
        }}
      />
    </Stack.Navigator>
  );
}

export default PublicNav;
