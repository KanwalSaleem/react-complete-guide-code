import React, {forwardRef} from 'react'
import {TextInput, StyleSheet} from 'react-native'
import {useController} from 'react-hook-form'
import Colors from '../constants/colors'

const Input = forwardRef((props, ref) => {
  const {field} = useController({
    control: props.control,
    defaultValue: '',
    name: props.name,
    rules: props.rules,
  })

  return (
    <TextInput
      value={field.value}
      onChangeText={field.onChange}
      style={{...styles.input, ...props.style}}
      placeholder={props.placeholder}
      secureTextEntry={props.secureTextEntry}
      multiline={props.multiline}
      numberOfLines={props.numberOfLines}
      returnKeyType={props.returnKeyType || 'next'}
      focusable={true}
      keyboardType={props.keyboardType}
      ref={ref}
      onSubmitEditing={props.onSubmitEditing}
      blurOnSubmit={props.blurOnSubmit}
      placeholderTextColor={props.placeholderTextColor}
    />
  )
})

const styles = StyleSheet.create({
  input: {
    // borderColor: Colors.lightBlue,
    color: 'black',
    height: 50,
    fontSize: 16,
    fontWeight: '600',
  },
})

export default Input
