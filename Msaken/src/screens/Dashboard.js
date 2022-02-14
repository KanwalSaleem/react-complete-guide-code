import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useContext, useEffect, useState} from 'react';

import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Drawer} from 'react-native-paper';

import ION from 'react-native-vector-icons/Ionicons';
import color from '../common/colors';
import {AuthContext} from '../context/AuthContext';

function Dashboard() {
  const TAG = new Date().toLocaleTimeString() + ' : dasboard : ';

  // const toggleDrawer = () => {
  //   navigation.toggleDrawer();
  // };
  const {isLoggedIn, setIsLoggedIn, userCred} = useContext(AuthContext);
  const logoutHandler = async () => {
    await AsyncStorage.setItem('loginStatus', 'loggedOut');
    setIsLoggedIn(false);
  };
  const [active, setActive] = React.useState('');
  const [tokenData, setTokenData] = useState();

  useEffect(() => {
    console.log(TAG + 'value changed');

    try {
      setTokenData(JSON.parse(userCred));
    } catch (error) {
      console.log(error);
    }
  }, [userCred]);

  return (
    <SafeAreaView>
      <View>
        {tokenData != undefined ? (
          (tokenData != undefined?.data.user.role) == 'buyer' ? (
            <Image
              style={{
                width: '100%',
                height: '100%',
                paddingTop: 10,
                resizeMode: 'cover',
              }}
              source={require('../assets/home_user.png')}
            />
          ) : (
            <Image
              style={{width: '100%', height: '100%'}}
              source={require('../assets/home_agent.png')}
            />
          )
        ) : (
          <Image
            style={{
              width: '100%',
              height: '100%',
              paddingTop: 10,
              resizeMode: 'cover',
            }}
            source={require('../assets/home_user.png')}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default Dashboard;
