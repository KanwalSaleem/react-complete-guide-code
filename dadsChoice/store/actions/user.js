import fetch from 'node-fetch'
import {APIURL} from '../../constants/url'

export const getUser = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token

    try {
      const response = await fetch(`${APIURL}/api/profile-info`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const resData = await response.json()

      const {data} = resData
      console.log(data, 'data')

      if (!response.ok) {
        throw new Error(resData.message)
      }

      dispatch({
        type: 'GET_USER',
        firstName: data.first_name,
        lastName: data.last_name,
        address: data.address,
        email: data.email,
        city: data.city,
        postal: data.Post_code,
        country: data.country,
        phoneNumber: data.phone_number,
        img: data.img,
        region: data.region,
      })
    } catch (e) {
      throw new Error(e)
    }
  }
}

export const updateUser = (data) => ({
  type: 'UPDATE_USER',
  firstName: data.firstName,
  lastName: data.lastName,
  address: data.address,
  email: data.email,
  city: data.city,
  postal: data.postal,
  country: data.country,
  phoneNumber: data.number,
  img: data.photo,
})

// export const setUserPushId = (pushId) => ({
//   type: 'PUSH_ID',
//   pushId,
// })

export const setUserPushId = (pushId) => ({
  type: 'PUSH_ID',
  pushId,
})
