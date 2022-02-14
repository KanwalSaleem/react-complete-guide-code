import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {useController} from 'react-hook-form';

const Input = React.forwardRef((props, ref) => {
  const {field} = useController({
    control: props.control,
    defaultValue: '',
    name: props.name,
    rules: props.rules,
  });

  return (
    <TextInput
      autoFocus={props.autoFocus}
      value={field.value}
      onChangeText={field.onChange}
      style={[styles.input, props.style]}
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
      maxLength={props.maxLength}
      editable={props.editable}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    // borderRadius: 10,
    color: 'black',
    height: 50,

    // backgroundColor: '#cecece',
  },
});

export default Input;
