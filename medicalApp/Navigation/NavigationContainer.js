import React, {useContext, useEffect, useCallback} from 'react'
import {Alert, Platform} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {AuthNavigator} from './AppNavigation'
import {AuthContext} from '../context/auth'
import OneSignal from 'react-native-onesignal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNLocation from 'react-native-location'
import {checkPermission, permissionTypes} from '../utils/appPermissions'

import {useSelector, useDispatch} from 'react-redux'

import PhysicianNavigator from './PhysicianNavigation'
import CaregiverNavigator from './CaregiverNavigation'

import {tryLogin, login} from '../store/actions/auth'

import {getLocation} from '../store/actions/location'

const AppNavigationContainer = () => {
  const {user, token} = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const getLocalUser = useCallback(async () => {
    const userData = await AsyncStorage.getItem('userData')

    if (!userData) {
      return dispatch(tryLogin)
    }
    const parsedUser = JSON.parse(userData)
    console.log(parsedUser)

    dispatch(login(parsedUser.user, parsedUser.token))
    OneSignal.addSubscriptionObserver(async (event) => {
      console.log('OneSignal: subscription changed to userId:', event.to)

      if (event.to.isSubscribed) {
        const state = await OneSignal.getDeviceState()

        const userId = JSON.stringify(state.userId)
        await AsyncStorage.setItem('pushId', userId)
      }
    })
  }, [dispatch])

  OneSignal.addSubscriptionObserver(async (event) => {
    console.log('OneSignal: subscription changed to userId:', event.to)
    console.log(event.to)
    if (event.to.isSubscribed) {
      const state = await OneSignal.getDeviceState()
      const userId = JSON.stringify(state.userId)
      await AsyncStorage.setItem('pushId', userId)
    }
  })

  useEffect(() => {
    // const checkCamerePermission = async () => {
    //   if (Platform.OS === 'ios') {
    //     checkPermission(permissionTypes.ios.location)
    //   } else if (Platform.OS === 'android') {
    //     checkPermission(permissionTypes.android.location)
    //   }
    // }

    // checkCamerePermission()
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
        rationale: {
          title: 'Location permission',
          message: 'Need Location Permission for the Patients near you.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      },
    })
      .then((granted) => {
        RNLocation.configure({
          distanceFilter: 5.0,
        })
        if (granted) {
          RNLocation.getLatestLocation({timeout: 60000})
            .then((latestLocation) => {
              console.log(latestLocation)
              dispatch(
                getLocation(latestLocation.latitude, latestLocation.longitude),
              )
              // return latestLocation
            })

            .catch((e) => console.log(e))
        }
      })
      .catch((e) => console.log(e))

    getLocalUser()
    // dispatch(getItem())
  }, [dispatch, getLocalUser])

  // useEffect(() => {
  //   const enableLocation = async () => {
  //     if (!enabled) {
  //       await requestResolution()
  //       GetLocation.getCurrentPosition({
  //         enableHighAccuracy: true,
  //         timeout: 150000,
  //       })
  //         .then((location) => {
  //           console.log(location)
  //           dispatch(
  //             getLocation({
  //               longitude: location.longitude,
  //               latitude: location.latitude,
  //             }),
  //           )
  //         })
  //         .catch((error) => {
  //           const {code, message} = error
  //           console.log(code)
  //           if (code === 'UNAVAILABLE') {
  //             Alert.alert(
  //               'Location not Available',
  //               'Please turn on Location Services',
  //             )
  //           } else if (code === 'UNAUTHORIZED') {
  //             Alert.alert('Please Allow the Location Permissions')
  //           }
  //         })
  //     }
  //   }
  //   enableLocation()
  // }, [HIGH_ACCURACY, dispatch, enabled, requestResolution])

  // OneSignal.setNotificationOpenedHandler((openedEvent) => {
  //   console.log('OneSignal: notification opened:', openedEvent)
  //   const {action, notification} = openedEvent
  // })
  // OneSignal.setNotificationWillShowInForegroundHandler(
  //   (notificationReceivedEvent) => {
  //     console.log(
  //       'OneSignal: notification will show in foreground:',
  //       notificationReceivedEvent,
  //     )
  //     let notification = notificationReceivedEvent.getNotification()
  //     console.log('notification: ', notification)
  //     const data = notification.additionalData
  //     console.log('additionalData: ', data)
  //     //Silence notification by calling complete() with no argument
  //     notificationReceivedEvent.complete(notification)
  //   },
  // )
  return (
    <NavigationContainer>
      {/* {user ? <MainNavigator /> : <AuthNavigator />} */}
      {/* <MainNavigator /> */}
      {!token && <AuthNavigator />}

      {token && user.role_id == 3 && <PhysicianNavigator />}
      {token && user.role_id == 2 && <CaregiverNavigator />}
    </NavigationContainer>
  )
}

export default AppNavigationContainer
