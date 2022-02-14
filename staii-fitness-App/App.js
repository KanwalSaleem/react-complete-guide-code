/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react'

import {LogBox} from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import {AppProvider} from './Context/AppContext'
import AgeSelection from './Screens/AgeSelection'
import {Provider as PaperProvider, Provider} from 'react-native-paper'

LogBox.ignoreAllLogs()

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen'
import AppNavigationContainer from './Navigation/NavigationContainer'

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide()
    }, 2000)
  }, [])

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // }

  return (
    <PaperProvider>
      <AppProvider>
        <AppNavigationContainer />
      </AppProvider>
    </PaperProvider>
  )
}

export default App
