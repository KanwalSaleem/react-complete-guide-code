import React, {createContext, useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CaspioUrl from '../constants/CaspioUrl'
import tables from '../constants/CaspioTableNames'

export const AuthContext = createContext({})

export const AuthProvider = (props) => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [authToken, setAuthToken] = useState('')
  const [user, setUser] = useState()
  const [cart, setCart] = useState(1000)
  console.log('user', user)
  useEffect(() => {
    fetch(`${CaspioUrl}/oauth/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials&client_id=139863c907764045ad4f53793f9e1df4a8ffc4f38bd6f33585&client_secret=4ebad78107a44ff4b8e8b210ebea2f6ca2977422881341cc40',
    })
      .then((res) => res.json())
      .then((resData) => {
        console.log(resData)
        setAuthToken(resData.access_token)
      })

      .catch((e) => console.log(e))

    const getUser = async () => {
      const user = await AsyncStorage.getItem('user')
      if (user) {
        const parsedUser = JSON.parse(user)
        setUser(parsedUser)
      }
    }
    getUser()
  }, [])
  const logout = () => {
    setUser(null)
    AsyncStorage.removeItem('user')
  }

  const updateUserProfile = async (newData) => {
    console.log('new', newData)
    return fetch(
      `${CaspioUrl}/rest/v2/tables/${tables.customerTable}/records?q.where=Email='${user.Email}'&response=rows`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...newData,
        }),
      },
    )
      .then(async (res) => {
        // console.log(res)

        return res.json()
      })
      .then(async (resData) => {
        const parsedUser = JSON.stringify(resData.Result[0])
        await AsyncStorage.setItem('user', parsedUser)
        return resData
      })
      .catch((e) => console.log(e))
  }

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        authToken,
        user,
        setUser,
        logout,
        cart,
        setCart,
        updateUserProfile,
      }}>
      {props.children}
    </AuthContext.Provider>
  )
}
