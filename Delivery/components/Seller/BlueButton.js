import React from 'react'
import {TouchableOpacity, Text, StyleSheet} from 'react-native'
import colors from '../../constants/colors'

const BlueButton = (props) => {
  return (
    <TouchableOpacity
      style={[styles.button, {...props.style}]}
      {...props}
      disabled={props.disabled}>
      <Text style={styles.text}>{props.children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.blue,
    width: 120,
    alignSelf: 'center',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: 'white',
  },
})

export default BlueButton
