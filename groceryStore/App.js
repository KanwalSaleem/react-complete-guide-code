/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {Text, View, Image, Platform, StatusBar} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import AppNavigationContainer from './navigation/NavigationContainer';
import {AuthProvider} from './context/Auth';
import OneSignal from 'react-native-onesignal';
import SplashScreen from 'react-native-splash-screen';
import splash from './assets/splash.gif';

const App = () => {
  const [appLoading, setAppLoading] = useState(true);
  //OneSignal Init Code
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId('daa2ba7b-daef-4363-935e-d5138d73cf98');
  //END OneSignal Init Code

  //Prompt for push on iOS
  OneSignal.promptForPushNotificationsWithUserResponse(response => {
    console.log('Prompt response:', response);
  });

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      setTimeout(() => {
        SplashScreen.hide();
      }, 3500);
    } else {
      SplashScreen.hide();
      setTimeout(() => {
        setAppLoading(false);
      }, 3500);
    }
  }, []);

  return (
    <AuthProvider>
      <PaperProvider>
        {/* <StatusBar barStyle="light-content" /> */}
        {Platform.OS === 'ios' && (
          <>
            {appLoading ? (
              <View>
                <Image
                  source={splash}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </View>
            ) : (
              <AppNavigationContainer />
            )}
          </>
        )}
        {Platform.OS !== 'ios' && <AppNavigationContainer />}
      </PaperProvider>
    </AuthProvider>
  );
};

export default App;
