import React, {useContext} from 'react'
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native'
import {useNavigation, useRoute} from '@react-navigation/native'

import {AuthContext} from '../context/Auth'

const BottomBar = () => {
  const navigation = useNavigation()
  const {loggedIn, user} = useContext(AuthContext)
  const route = useRoute()
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('verifynin')}>
        {route.name === 'verifynin' ? (
          <Image
            source={require('../assets/personchehmark.png')}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require('../assets/persongreycheckmark.png')}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          user
            ? navigation.navigate('dashboard')
            : navigation.navigate('profile')
        }}>
        {route.name.includes('profile') || route.name === 'dashboard' ? (
          <Image
            source={require('../assets/personblue.png')}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require('../assets/persongrey.png')}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // height: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'center',
  },
})

export default BottomBar
