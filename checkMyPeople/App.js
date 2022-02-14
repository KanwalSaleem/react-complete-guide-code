/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react'
import {Text, View} from 'react-native'
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper'
import AppNavigationContainer from './navigation/NavigationContainer'
import {AuthProvider} from './context/Auth'
import SplashScreen from 'react-native-splash-screen'
import Colors from './constants/Colors'

const App = () => {
  React.useEffect(() => {
    const timer = setTimeout(() => SplashScreen.hide(), 2000)
    return () => clearTimeout(timer)
  }, [])
  return (
    <AuthProvider>
      <PaperProvider
        theme={{
          ...DefaultTheme,
          colors: {...DefaultTheme.colors, primary: Colors.primary},
        }}>
        <AppNavigationContainer />
      </PaperProvider>
    </AuthProvider>
  )
}

export default App
