import React from 'react'
import {TouchableOpacity, StyleSheet, Text} from 'react-native'

import Colors from '../constants/Colors'

const AuthButton = (props) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, props.style]}
      onPress={props.onPress}
      disabled={props.disabled}
      activeOpacity={0.7}>
      <Text style={styles.buttonText} allowFontScaling={false}>
        {props.children}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '90%',
    backgroundColor: Colors.primary,
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
  },

  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Inter-Regular',
  },
})

export default AuthButton
