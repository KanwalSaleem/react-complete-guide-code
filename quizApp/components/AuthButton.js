import React from 'react'
import {TouchableOpacity, StyleSheet, Text} from 'react-native'

import Colors from '../constants/Colors'

const AuthButton = props => {
  return (
    <TouchableOpacity
      style={{...styles.buttonContainer, ...props.style}}
      onPress={props.onPress}
      activeOpacity={0.7}>
      <Text style={styles.buttonText}>{props.children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '80%',
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontSize: 15,
    color: '#fff',
  },
})

export default AuthButton
