import React, {useState, useEffect, useCallback, useRef} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import SplashScreen from 'react-native-splash-screen'
import OneSignal from 'react-native-onesignal'
import {setLang} from '../store/actions/language'
import {useSelector, useDispatch} from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'

import {DrawerNavigator as IndividualUserNavigator} from './IndividualUserNavigation'
import {DrawerNavigator as SpecialUserNavigator} from './SpecialUserNavigation'

import {AuthNavigator} from './AppNavigation'

import {login, tryLogin} from '../store/actions/auth'
import {getUser, setUserPushId} from '../store/actions/user'

const AppNavigationContainer = () => {
  const [isStarting, setIsStarting] = useState(false)
  const token = useSelector((state) => !!state.auth.token)
  const roleId = useSelector((state) => state.auth.roleId)

  const dispatch = useDispatch()

  const getLocalUser = useCallback(
    async () => {
      const userData = await AsyncStorage.getItem('userData')
      if (!userData) {
        return dispatch(tryLogin)
      }
      const parsedUser = JSON.parse(userData)

      await dispatch(
        login(parsedUser.userId, parsedUser.token, parsedUser.roleId),
      )
      OneSignal.addSubscriptionObserver(async (event) => {
        console.log('OneSignal: subscription changed to userId:', event.to)

        if (event.to.isSubscribed) {
          const state = await OneSignal.getDeviceState()

          await AsyncStorage.setItem('pushId', state.pushToken)
        }
      })

      dispatch(getUser())
    },
    [dispatch],
  )

  useEffect(
    () => {
      getLocalUser()
    },
    [getLocalUser],
  )
  useEffect(
    () => {
      const getLang = async () => {
        const language = await AsyncStorage.getItem('language')
        if (language) {
          dispatch(setLang(language))
          console.log("language"+language)
        }
      }
      getLang()
    },
    [dispatch],
  )
  OneSignal.addSubscriptionObserver(async (event) => {
    console.log('OneSignal: subscription changed to userId:', event.to)

    if (event.to.isSubscribed) {
      const state = await OneSignal.getDeviceState()

      await AsyncStorage.setItem('pushId', state.userId)
    }
  })

  // useEffect(
  //   () => {
  //     dispatch(setUserPushId())
  //   },
  //   [dispatch],
  // )

  return (
    <NavigationContainer>
      {/* {isStarting === false ? (
        <StartScreen />
      ) : (
        <> */}
      {!token && <AuthNavigator />}
      {roleId == 3 && token && <SpecialUserNavigator />}
      {roleId == 2 && token && <IndividualUserNavigator />}
      {/* </> */}
      {/* )} */}
    </NavigationContainer>
  )
}

export default AppNavigationContainer
