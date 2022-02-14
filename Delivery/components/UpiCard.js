import React from 'react'
import {View, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native'
import {Card} from 'react-native-paper'

import LinearGradient from 'react-native-linear-gradient'

import {useController, useForm} from 'react-hook-form'

const UpiCard = (props) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({mode: 'all'})

  const {field} = useController({
    control: control,
    defaultValue: 'asdasd',
    name: 'upi',
    rules: {required: true},
  })

  const onSubmit = (data) => {
    // props.onSubmit(data)
    console.log(data)
  }

  return (
    <Card style={{...styles.upiCard, ...props.style}}>
      <Text style={styles.upiText}>Please enter your UPI ID</Text>
      <View style={[styles.upiFieldContainer, errors.upi && styles.redBorder]}>
        <TextInput
          placeholder="Ex:MobileNumber@upi"
          placeholderTextColor="grey"
          value={field.value}
          onChangeText={field.onChange}
          keyboardType="name-phone-pad"
        />
        <TouchableOpacity activeOpacity={0.6} onPress={handleSubmit(onSubmit)}>
          <LinearGradient
            colors={['#336CF9', '#1BE6D6']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{
              width: 120,
              height: 40,
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontFamily: 'Poppins-Regular',
              }}>
              Verfiy
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  upiCard: {
    backgroundColor: '#f8faff',
    width: '100%',
    height: 170,
    borderRadius: 10,
    padding: 20,
    justifyContent: 'space-between',
  },
  upiText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  upiFieldContainer: {
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d8d9da',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  redBorder: {
    borderColor: '#c12323',
  },
})

export default UpiCard
