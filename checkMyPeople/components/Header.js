import React, {forwardRef} from 'react'
import {TextInput, StyleSheet, View, Text} from 'react-native'
import {useController} from 'react-hook-form'
import Colors from '../constants/Colors'

const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text} allowFontScaling={false}>
        Identity Verification Service (IVS)
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  text: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
  },
})

export default Header
