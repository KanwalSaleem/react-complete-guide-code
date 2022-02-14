import React, {useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import ProgressDialog from 'react-native-progress-dialog';
import AuthNavigator from './AuthNavigation';
import MainNavigator from './MainNavigator';
import AppContext from '../Context/AppContext';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiUrl from '../Constants/ApiUrl';

const AppNavigationContainer = () => {
  const {user, setUser, setAppIntro} = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getLocalUser = async () => {
      // const id = await AsyncStorage.getItem('id');
      const email = await AsyncStorage.getItem('email');
      const appIntro = await AsyncStorage.getItem('appIntro');
      if (appIntro) {
        setAppIntro(true);
      }

      if (email) {
        // const parsedId = JSON.parse(id);
        // const parsedUser = JSON.parse(user);
        // console.log(parsedUser, 'as');
        console.log(email, 'email');
        try {
          const formData = new FormData();

          formData.append('token', 'ZFSgldjzfnvzkjdfbzdzfvbzdbdjkgSGVFddzfv');
          formData.append('user_email', email);
          formData.append('logintype', false);
          setLoading(true);
          const response = await fetch(`${ApiUrl}/authenticate.php`, {
            method: 'POST',
            body: formData,
            'Content-type': 'application/json',
          });
          const resData = await response.json();

          if (resData.Data.status == 0) {
            AsyncStorage.removeItem('appIntro');
            await AsyncStorage.removeItem('email', () => {
              // setIsUserSaved(false)

              setUser(null);
            });

            return;
          }

          // setIsUserSaved(true)
          // setTempId(parsedId);
          setUser(resData.Data);
          console.log(resData, 'alksdua098sjdlkadmn098');
        } catch (e) {
          Alert.alert('', e.message);
        }
        setLoading(false);
      } else {
        // console.log('asd')
      }
    };
    getLocalUser();
  }, []);

  return (
    <NavigationContainer theme={DarkTheme}>
      <ProgressDialog visible={loading} />
      {!user && <AuthNavigator />}
      {/* <MainNavigator /> */}
      {user && <MainNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigationContainer;
