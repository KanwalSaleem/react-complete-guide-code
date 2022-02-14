import 'react-native-gesture-handler';
import React, {useState, useEffect, useCallback} from 'react';

import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import color from './src/common/colors';
import {AuthContext, AuthProvider} from './src/context/AuthContext';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AppNavigationContainer from './src/navigation/NavigationContainer';
import SplashScreen from 'react-native-splash-screen';
import OneSignal from 'react-native-onesignal';

const App = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  // const [userCred, setUserCred] = useState('')
  // const [passState, setPassState] = useState(undefined)
  // const [registrationType, setRegistrationType] = useState('company')
  // const [tokenGotType, setTokenGotType] = useState('')
  // const [filterData, setFilterData] = useState([])

  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId('1cc26aee-66d7-414a-bf06-2adea748add5');
  //END OneSignal Init Code

  //Prompt for push on iOS
  OneSignal.promptForPushNotificationsWithUserResponse(response => {
    console.log('Prompt response:', response);
  });

  useEffect(() => {
    SplashScreen.hide();
    GoogleSignin.configure({
      androidClientId:
        '237354320338-9lq52n55cptqip0rm7vqsbbp7jtdon4u.apps.googleusercontent.com',
    });
  }, []);

  // useEffect(async () => {
  //   try {
  //     const value = await AsyncStorage.getItem('loginStatus');
  //     if (value !== null) {
  //       console.log(value);
  //       if (value == 'loggedIn') {
  //         const user = await AsyncStorage.getItem('userCredentials');
  //         if (user != null) {
  //           setUserCred(user);
  //         }
  //         // setIsLoggedIn(true);
  //         setIsLoggedIn(true);
  //       } else {
  //         setIsLoggedIn(false);
  //       }
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, []);

  const theme = {
    ...DefaultTheme,
    roundness: 3,
    colors: {
      ...DefaultTheme.colors,
      primary: color.themeRed,
      // accent: color.themeRed,
    },
  };

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <AppNavigationContainer />
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
