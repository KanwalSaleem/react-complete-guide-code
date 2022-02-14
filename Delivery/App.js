/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler'
import 'intl'
import 'intl/locale-data/jsonp/en'
import React, {useEffect} from 'react'

import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper'
import {AppProvider} from './context/auth'

import SplashScreen from 'react-native-splash-screen'

import NavigationContainer from './Navigation/NavigationContainer'
import colors from './constants/colors'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.blue,
    accent: '#2020d5',
    lightBlue: '#bce0fd',
  },
}

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide()
    }, 2000)
  }, [])
  return (
    <AppProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer />
      </PaperProvider>
    </AppProvider>
  )
}

export default App
