import React from 'react'
import {TouchableOpacity, Text, StyleSheet} from 'react-native'

const AuthButton = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={{...styles.buttonView, ...props.style}}
      onPress={props.onPress}
      disabled={props.disabled}>
      <Text style={styles.buttonText}>{props.children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonView: {
    // marginVertical: 20,
    width: '80%',
    height: 40,
    backgroundColor: 'red',
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    // fontWeight: '700',
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
  },
})
export default AuthButton
