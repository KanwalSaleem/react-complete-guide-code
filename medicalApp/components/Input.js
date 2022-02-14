import React, {forwardRef} from 'react'
import {TextInput, StyleSheet} from 'react-native'
import {useController} from 'react-hook-form'

const Input = forwardRef((props, ref) => {
  const {field} = useController({
    control: props.control,
    defaultValue: props.defaultValue || '',
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
      maxLength={props.maxLength}
    />
  )
})

const styles = StyleSheet.create({
  input: {
    // borderColor: Colors.lightBlue,
    fontSize: 16,
    color: 'black',
    // flexBasis: '90%',
    fontFamily: 'Roboto-Regular',

    // textAlignVertical: 'bottom',
  },
})

export default Input
