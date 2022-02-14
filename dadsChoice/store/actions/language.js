// export const setLang = (language) => ({
//   type: language,
// })

import AsyncStorage from '@react-native-async-storage/async-storage'

export const setLang = (language) => {
  return async (dispatch) => {
    await AsyncStorage.setItem('language', language)
    dispatch({type: language})
  }
}
