import React, {useContext} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import AppNavigator from './MainNav';
import PublicNavigator from './PublicNav';
import {NavigationContainer} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import color from '../common/colors';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkipNavigator from './SkipNavigator';

const AppNavigationContainer = () => {
  const {isLoggedIn, isLoading, isSkip} = useContext(AuthContext);

  OneSignal.addSubscriptionObserver(async event => {
    console.log('OneSignal: subscription changed to userId:', event.to);

    if (event.to.isSubscribed) {
      const state = await OneSignal.getDeviceState();
      console.log('push Token', state.userId);
      AsyncStorage.setItem('deviceToken', state.userId);
    }
  });

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={color.themeRed} />
    </View>
  ) : (
    <NavigationContainer>
      {isLoggedIn ? (
        <AppNavigator />
      ) : isSkip ? (
        <SkipNavigator />
      ) : (
        <PublicNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigationContainer;
