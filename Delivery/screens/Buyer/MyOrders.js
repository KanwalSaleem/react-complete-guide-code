import React, {useEffect, useContext} from 'react'
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

const MyOrders = ({navigation}) => {
  const {userType} = useContext(AppContext)

  useEffect(() => {
    if (userType === 'seller') {
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
          onPress={() => navigation.navigate('orders/CurrentOrders')}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Current Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('orders/pendingOrders')}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Pending Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('orders/orderHistory')}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Order History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('orders/disputes')}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Dispute Resolutions</Text>
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
  },
  button: {
    backgroundColor: '#224794',
    height: 60,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
  },
})

export default MyOrders
