/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react'
import {PermissionsAndroid} from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper'

import {AuthProvider} from './context/auth'
import AppNavigationContainer from './Navigation/NavigationContainer'
import OneSignal from 'react-native-onesignal'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import ReduxThunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import authReducer from './store/reducers/auth'
import Colors from './constants/Colors'
import locationReducer from './store/reducers/location'
import careGiverReducer from './store/reducers/careGiver'

//END OneSignal Init Code

const rootReducer = combineReducers({
  auth: authReducer,
  location: locationReducer,
  careGiver: careGiverReducer,
})
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk)),
)

const App = () => {
  useEffect(() => {
    OneSignal.setLogLevel(6, 0)
    OneSignal.setAppId('16f1e69b-543c-4e44-b340-b6627deba19e')
    OneSignal.addSubscriptionObserver(async (event) => {
      console.log('OneSignal: subscription changed to userId:', event.to)

      if (event.to.isSubscribed) {
        const state = await OneSignal.getDeviceState()

        console.log(state)
      }
    })
    GoogleSignin.configure()
    SplashScreen.hide()
    // setTimeout(() => {

    // }, 2000)
  }, [])

  useEffect(() => {
    const requestCameraAndAudioPermission = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ])
        if (
          granted['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('You can use the cameras & mic')
        } else {
          console.log('Permission denied')
        }
      } catch (err) {
        console.warn(err)
      }
    }
    requestCameraAndAudioPermission()
    // const checkCamerePermission = () =>
    //   checkPermission(permissionTypes.android.location)
    // checkCamerePermission()
  }, [])

  return (
    <Provider store={store}>
      <AuthProvider>
        <PaperProvider
          theme={{
            ...DefaultTheme,
            // mode: 'exact',
            colors: {
              ...DefaultTheme.colors,
              primary: Colors.primary,
            },
          }}>
          <AppNavigationContainer />
        </PaperProvider>
      </AuthProvider>
    </Provider>
  )
}

export default App
