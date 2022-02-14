import React from 'react'
import {TextInput, StyleSheet} from 'react-native'
import {useController} from 'react-hook-form'

const ModalField = (props) => {
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
      style={[styles.input, props.style]}
      maxLength={props.maxLength}
      placeholder={props.placeholder}
      secureTextEntry={props.secureTextEntry}
      multiline={props.multiline}
      numberOfLines={props.numberOfLines}
      returnKeyType={props.returnKeyType || 'next'}
      focusable={true}
      keyboardType={props.keyboardType}
      onSubmitEditing={props.onSubmitEditing}
      blurOnSubmit={props.blurOnSubmit}
      placeholderTextColor={props.placeholderTextColor}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 2,
    fontSize: 16,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    // alignItems: 'center',
    borderBottomColor: '#cccc',
    marginTop: 10,
  },
})

export default ModalField
