import React, {useContext} from 'react'
import {SafeAreaView} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'

import {AuthNavigator} from './AppNavigation'
import {MainNavigator} from './AppNavigation'
import BottomBar from '../components/BottomBar'
import {AppContext} from '../context/auth'
import colors from '../constants/colors'

const AppNavigationContainer = () => {
  const {user} = useContext(AppContext)
  return (
    <>
      {/* <SafeAreaView style={{backgroundColor: colors.lightBlue}} /> */}
      <NavigationContainer>
        {user ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </>
  )
}

export default AppNavigationContainer
