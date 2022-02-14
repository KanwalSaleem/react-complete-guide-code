import React, {useContext} from 'react'
import {TouchableOpacity, Image} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Login from '../Screens/Login'
import close from '../assets/Close.png'
import OTP from '../Screens/OTP'
import AppContext from '../Context/AppContext'
import OnBoarding from '../Screens/OnBoarding'

import SportSelection from '../Screens/SportSelection'
import back from '../assets/back.png'
import AgeSelection from '../Screens/AgeSelection'

const Stack = createNativeStackNavigator()
const OnBoardingStack = createNativeStackNavigator()

const AuthNavigator = () => {
  const {appIntro} = useContext(AppContext)
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        animation: 'slide_from_right',
      }}>
      {appIntro ? (
        <Stack.Group>
          <Stack.Screen
            name="login"
            component={Login}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen name="otp" component={OTP} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <OnBoardingStack.Screen
            name="onBoarding"
            component={OnBoarding}
            options={{headerShown: false}}
          />
        </Stack.Group>
      )}
      <Stack.Group
        screenOptions={({navigation}) => {
          return {
            headerShown: true,
            animation: 'slide_from_right',
            headerBackImageSource: back,
            contentStyle: {
              backgroundColor: 'black',
              paddingTop: 20,
            },
            headerStyle: {
              backgroundColor: 'black',
            },
            // headerBackVisible: true,
            headerTitle: '',
            // headerLeft: () => (
            //   <TouchableOpacity
            //     onPress={() => navigation.goBack()}
            //     style={{marginLeft: 10}}>
            //     <Icon name="arrow-back" color={'#EDECF4'} size={25} />
            //   </TouchableOpacity>
            // ),
            // headerRight: () => (
            //   // <></>
            //   <TouchableOpacity
            //     onPress={() => navigation.replace('dashBoardStack')}>
            //     <Image source={close} style={{width: 16, height: 16}} />
            //   </TouchableOpacity>
            // ),
          }
        }}>
        <Stack.Screen
          name="selectSport"
          component={SportSelection}
          options={{
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="selectAge"
          component={AgeSelection}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default AuthNavigator
