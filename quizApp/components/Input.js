import React from 'react'
import {TextInput, StyleSheet} from 'react-native'
import {useController} from 'react-hook-form'

const Input = React.forwardRef((props, ref) => {
  const {field} = useController({
    control: props.control,
    defaultValue: '',
    name: props.name,
    rules: props.rules,
  })

  return (
    <TextInput
      maxLength={props.maxLength}
      value={field.value}
      onChangeText={field.onChange}
      style={{...styles.input, ...props.style}}
      placeholder={props.placeholder}
      secureTextEntry={props.secureTextEntry}
      placeholderTextColor={'white'}
      returnKeyType={props.returnKeyType}
      ref={ref}
      keyboardType={props.keyboardType}
      onSubmitEditing={props.onSubmitEditing}
      blurOnSubmit={props.blurOnSubmit}
      editable={props.editable}
    />
  )
})

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    color: 'white',
  },
})

export default Input
