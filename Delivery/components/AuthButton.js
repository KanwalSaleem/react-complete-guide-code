import React from 'react'
import {TouchableOpacity, StyleSheet, Text} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import Colors from '../constants/colors'

const AuthButton = (props) => {
  return (
    <TouchableOpacity
      style={props.style}
      onPress={props.onPress}
      activeOpacity={0.6}
      disabled={props.disabled}>
      <LinearGradient
        // colors={['#4c669f', '#3b5998', '#192f6a']}
        colors={[Colors.primary, '#192f6a']}
        style={{...styles.authButton, ...props.authButton}}>
        <Text style={{...styles.authButtonText, ...props.authButtonText}}>
          {props.children}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  authButton: {
    padding: 10,
    // width: '70%',
    alignSelf: 'center',
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  authButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    fontSize: 18,

    // backgroundColor: 'transparent',
  },
})

export default AuthButton
