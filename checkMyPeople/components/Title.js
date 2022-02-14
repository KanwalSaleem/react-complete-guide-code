import React, {forwardRef} from 'react'
import {TextInput, StyleSheet, View, Text} from 'react-native'
import {useController} from 'react-hook-form'
import Colors from '../constants/Colors'
import fonts from '../constants/fonts'

const Title = (props) => {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={[fonts.title, props.titleStyle]} allowFontScaling={false}>
        {props.text}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: 10,
  },
})

export default Title
