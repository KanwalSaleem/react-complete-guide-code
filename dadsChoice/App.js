import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { LogBox } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import { Provider as PaperProvider } from 'react-native-paper'
import OneSignal from 'react-native-onesignal'
import NavigationContainer from './navigation/NavigationContainer'
import authReducer from './store/reducers/auth'
import locationReducer from './store/reducers/location'
import languageReducer from './store/reducers/language'
import userReducer from './store/reducers/user'
import { composeWithDevTools } from 'redux-devtools-extension'

const rootReducer = combineReducers({
  auth: authReducer,
  location: locationReducer,
  language: languageReducer,
  user: userReducer,
})
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk)),
)

LogBox.ignoreAllLogs()

const App = () => {
  OneSignal.setAppId('857b93f8-2adc-4ba5-ac73-64b404bddf9b')
  OneSignal.promptForPushNotificationsWithUserResponse(response => {
    console.log("Prompt response:", response);
  });

  useEffect(() => {
    setTimeout(() => SplashScreen.hide(), 2000)
  }, [])

  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer />
      </PaperProvider>
    </Provider>
  )
}
export default App
