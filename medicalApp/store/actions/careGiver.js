import AsyncStorage from '@react-native-async-storage/async-storage'

export const setItem = (id, status) => {
  return async (dispatch) => {
    await AsyncStorage.setItem(
      'careGiverItem',
      JSON.stringify({
        id,
        status,
      }),
    )

    dispatch({
      type: 'SET_CAREGIVER_ITEM',
      id,
      status,
    })
  }
}

export const getItem = () => {
  return async (dispatch) => {
    const item = await AsyncStorage.getItem('careGiverItem')
    const parsedItem = JSON.parse(item)
    if (item) {
      dispatch({
        type: 'GET_CAREGIVER_ITEM',
        id: parsedItem?.id,
        status: parsedItem?.status,
      })
    }
  }
}

export const removeItem = () => {
  return async (dispatch) => {
    await AsyncStorage.removeItem('careGiverItem')

    dispatch({
      type: 'REMOVE_CAREGIVER_ITEM',
    })
  }
}
