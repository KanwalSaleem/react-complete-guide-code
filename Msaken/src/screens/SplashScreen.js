import React, {useContext, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import {
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SplashScreen() {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(async () => {
      try {
        const value = await AsyncStorage.getItem('loginStatus');
        if (value !== null) {
          console.log(value);
          if (value !== 'loggedIn') {
          // if (value === 'loggedIn') {
            navigation.replace('Login');
          }
        } else {
          navigation.replace('Login');
        }
      } catch (e) {
        console.log(e);
      }
    }, 1500);
  }, []);

  return (
    <SafeAreaView>
      <Image
        style={styles.splashImage}
        source={require('../assets/splash.png')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splashImage: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;
