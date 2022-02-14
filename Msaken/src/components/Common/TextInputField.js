import React, {useState} from 'react';
import {Text, View, StyleSheet, TextInput} from 'react-native';
import ION from 'react-native-vector-icons/Ionicons';
import color from '../../common/colors';

function TextInputField({icon, hint}) {
  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <ION
          style={styles.searchIcon}
          name="call"
          size={20}
          color={color.themeRed}
        />
        <TextInput
          keyboardType="phone-pad"
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor={color.inputFontBlack}
          onChangeText={searchString => {
            // setPhoneNumber(searchString);
          }}
          underlineColorAndroid="transparent"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  button: {
    margin: 12,
    padding: 10,
    backgroundColor: color.themeRed,
    borderRadius: 40,
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: color.inputBgGrey,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    borderRadius: 40,
    backgroundColor: color.inputBgGrey,
    color: '#424242',
  },
});

export default TextInputField;
