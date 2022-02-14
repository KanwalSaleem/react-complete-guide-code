import React from 'react'
import {Platform} from 'react-native'
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions'

export const permissionTypes = {
  ios: {
    microphone: PERMISSIONS.IOS.MICROPHONE,
    video: PERMISSIONS.IOS.CAMERA,
    location: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  },
  android: {
    microphone: PERMISSIONS.ANDROID.RECORD_AUDIO,
    video: PERMISSIONS.ANDROID.CAMERA,
    location: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  },
}

export const checkPermission = async (type) => {
  try {
    if (Platform.OS === 'android') {
      const result = await check(type)
      console.log(result, 'hello')
      if (result !== RESULTS.GRANTED) {
        requestPermission(type)
      }
    } else if (Platform.OS === 'ios') {
      const result = await check(type)
      if (result !== RESULTS.GRANTED) {
        return requestPermission(type)
      }
    }
  } catch (e) {
    console.log(e)
  }
}

const requestPermission = async (type) => {
  try {
    if (Platform.OS === 'android') {
      const result = await request(type)
      console.log(result, '1')

      if (result === RESULTS.GRANTED) {
        return result
      }
    } else if (Platform.OS === 'ios') {
      const result = await request(type)
      if (result === RESULTS.GRANTED) {
        return result
      }
    }
  } catch (e) {
    console.log(e)
  }
}
