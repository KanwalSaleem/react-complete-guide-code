import AsyncStorage from '@react-native-async-storage/async-storage'
import {APIURL} from '../../constants/url'

export const authenticate = (user, token) => ({
  type: 'AUTHENTICATE',
  user,
  token,
})

export const login = (user, token) => {
  return async (dispatch) => {
    const stringUser = JSON.stringify({user, token})
    await AsyncStorage.setItem('userData', stringUser)

    dispatch(authenticate(user, token))
  }
}

export const tryLogin = () => ({
  type: 'TRY_LOGIN',
})

export const logout = () => {
  const formData = new FormData()
  const headers = new Headers()
  return async (dispatch, getState) => {
    const auth = getState().auth
    formData.append('user_id', auth.user.id)
    headers.append('Authorization', `Bearer ${auth.token}`)

    try {
      const response = await fetch(`${APIURL}/api/logout`, {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      })

      const resData = await response.json()
      if (!response.ok) {
        throw new Error(resData.message)
      }
      console.log(resData)
      await AsyncStorage.removeItem('userData')

      dispatch(authenticate(null, null))
      // setUser(resData.data['user-data'])
    } catch (e) {
      throw new Error(e)
    }
  }
}
