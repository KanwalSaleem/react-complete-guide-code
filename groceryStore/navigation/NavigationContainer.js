import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {DrawerNavigator} from './AppNavigation';
import {AuthContext} from '../context/Auth';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppNavigationContainer = () => {
  OneSignal.addSubscriptionObserver(async event => {
    console.log('OneSignal: subscription changed to userId:', event.to);

    if (event.to.isSubscribed) {
      const state = await OneSignal.getDeviceState();
      console.log('push Token', state.userId);
      AsyncStorage.setItem('deviceToken', state.userId);
    }
  });

  const {getUserDetails} = useContext(AuthContext);

  useEffect(() => {
    getUserDetails();
  }, []);
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
};

export default AppNavigationContainer;
