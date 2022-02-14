import React, {useContext, useState, useEffect} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {AuthNavigator, QuizNavigator} from './AppNavigation'
import {AuthContext} from '../context/auth'
import SplashScreen from '../screens/SplashScreen'
import {View} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AppNavigationContainer = () => {
  const {isAuthenticated, fetchLogin, userId} = useContext(AuthContext)

  const [splash, setSplash] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setSplash(true)
    }, 2000)
  }, [])
  useEffect(() => {
    fetchLogin()
  }, [fetchLogin])

  return (
    <NavigationContainer>
      {splash === false ? (
        <SplashScreen />
      ) : (
        <>{!isAuthenticated ? <AuthNavigator /> : <QuizNavigator />}</>
      )}

      {/* <QuizNavigator /> */}
    </NavigationContainer>
  )
}

export default AppNavigationContainer
