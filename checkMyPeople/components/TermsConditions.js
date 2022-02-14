import React, {forwardRef, useState} from 'react'
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Linking,
} from 'react-native'
import {useController} from 'react-hook-form'
import Colors from '../constants/Colors'
import fonts from '../constants/fonts'

const TermsConditions = ({termsAccepted, toggleSwitch, children}) => {
  return (
    <View style={styles.container}>
      <Switch
        style={styles.switch}
        trackColor={{false: '#767577', true: Colors.primary}}
        thumbColor={termsAccepted ? 'white' : '#f4f3f4'}
        onValueChange={toggleSwitch}
        value={termsAccepted ? true : false}
      />
      {children}

      <View style={styles.privacyContainer} allowFontScaling={false}>
        <Text style={styles.privacyTitle} allowFontScaling={false}>
          I have read, understood, and agree to
        </Text>
        {/* <Text style={[styles.privacyTitle, {color: Colors.primary}]}>
          Check My People
        </Text> */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            Linking.openURL('https://checkmypeople.com/terms/')
          }}>
          <Text
            style={[
              styles.privacyTitle,
              {color: Colors.primary, textDecorationLine: 'underline'},
            ]}
            allowFontScaling={false}>
            Check My People “Terms {'&'} Conditions”
          </Text>
        </TouchableOpacity>
        <Text style={styles.privacyTitle} allowFontScaling={false}>
          {' '}
          and
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            Linking.openURL('https://checkmypeople.com/privacy/')
          }}>
          <Text
            style={[
              styles.privacyTitle,
              {color: Colors.primary, textDecorationLine: 'underline'},
            ]}
            allowFontScaling={false}>
            {'Privacy Policy'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  privacyContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '80%',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  privacyTitle: {
    fontSize: 13,
    color: Colors.black,
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 4,
  },
  switch: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginVertical: 5,
    marginBottom: 2,
  },
})

export default TermsConditions
