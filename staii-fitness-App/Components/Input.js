import React from 'react'
import {View, TextInput, StyleSheet} from 'react-native'
import {useController} from 'react-hook-form'

const Input = (props) => {
  const {field} = useController({
    control: props.control,
    defaultValue: '',
    name: props.name,
    rules: props.rules,
  })

  return (
    <View style={[styles.inputContainer, props.containerStyle]}>
      <TextInput
        value={field.value}
        onChangeText={field.onChange}
        style={[styles.input, props.style]}
        placeholder={props.placeholder}
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        returnKeyType={props.returnKeyType || 'next'}
        focusable={true}
        keyboardType={props.keyboardType}
        onSubmitEditing={props.onSubmitEditing}
        blurOnSubmit={props.blurOnSubmit}
        placeholderTextColor={'grey'}
        maxLength={props.maxLength}
        editable={props.editable}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 5,
    // borderColor: 'white',
    borderWidth: 0.5,
    paddingHorizontal: 3,
    marginTop: 30,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#2B2E3D',
  },
  input: {color: 'white', flexGrow: 1},
})

export default Input
