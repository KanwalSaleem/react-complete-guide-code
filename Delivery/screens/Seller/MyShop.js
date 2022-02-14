import React, {useEffect, useContext, useState} from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native'
import {CommonActions} from '@react-navigation/native'
import BottomBar from '../../components/BottomBar'
import Header from '../../components/Header'

import {AppContext} from '../../context/auth'
import colors from '../../constants/colors'

const MyShop = ({navigation}) => {
  const {userType} = useContext(AppContext)

  useEffect(() => {
    if (userType === 'buyer') {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'home/chooseCategory'}],
        }),
      )
    }
  }, [navigation, userType])
  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('shop/productsServices')}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>{`Products & Services`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('shop/orders')}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('shop/refunds')}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Refunds</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('shop/campaigns')}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Campaigns</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('shop/fbMarket')}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>FB MarketPlace</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('shop/settings')}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',

    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    paddingVertical: 15,
    // marginBottom: 100,
  },
  button: {
    backgroundColor: colors.blue,
    height: 50,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
  },
})

export default MyShop
