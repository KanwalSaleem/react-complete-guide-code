import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import Colors from '../Constants/Colors';

const PrimaryButton = props => {
  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      onPress={props.onPress}
      disabled={props.disabled}
      activeOpacity={props.activeOpacity}>
      <Text style={[styles.text, props.childrenStyle]}>{props.children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    borderRadius: 30,
    width: '90%',
    alignSelf: 'center',
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
    fontWeight: '700',
  },
});

export default PrimaryButton;
