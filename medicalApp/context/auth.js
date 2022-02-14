import React, {createContext, useState, useEffect, useCallback} from 'react'
import {GoogleSignin} from '@react-native-google-signin/google-signin'

export const AuthContext = createContext({})

export const AuthProvider = (props) => {
  const [user, setUser] = useState()

  GoogleSignin.configure()

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}>
      {props.children}
    </AuthContext.Provider>
  )
}
