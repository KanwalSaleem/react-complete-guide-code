import React, {useContext} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {MainNavigator} from './MainNavigation'
import {AuthNavigator} from './AuthNavigation'
import {AuthContext} from '../context/Auth'

const AppNavigationContainer = () => {
  const {user} = useContext(AuthContext)

  return (
    <NavigationContainer>
      {!user ? <AuthNavigator /> : <MainNavigator />}
      {/* <MainNavigator /> */}
    </NavigationContainer>
  )
}

export default AppNavigationContainer
