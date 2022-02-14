import AsyncStorage from '@react-native-async-storage/async-storage'
import fetch from 'node-fetch'
import {APIURL} from '../../constants/url'

export const authenticate = (userId, token, roleId) => ({
  type: 'AUTHENTICATE',
  userId,
  token,
  roleId,
})

export const login = (userId, token, roleId) => {
  return async (dispatch) => {
    await AsyncStorage.setItem(
      'userData',
      JSON.stringify({userId, token, roleId}),
    )

    dispatch(authenticate(userId, token, roleId))
  }
}

export const tryLogin = () => ({
  type: 'TRY_LOGIN',
})

export const logout = () => {
  return async (dispatch, getState) => {
    const {token, pushId} = getState().auth
    // const pushId = getState()..pushId

    console.log(pushId)

    // eslint-disable-next-line no-undef
    const formData = new FormData()

    formData.append('device_token', pushId)
    try {
      const response = await fetch(`${APIURL}/api/logout`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const resData = await response.json()
      if (!response.ok) {
        throw new Error(resData.message)
      }
      await AsyncStorage.removeItem('language')
      // await AsyncStorage.removeItem('notification')

      await AsyncStorage.removeItem('userData')

      dispatch({
        type: 'LOGOUT',
      })
    } catch (e) {
      throw new Error(e)
    }
  }
}
