import React from 'react'
import {View, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native'
import {Card} from 'react-native-paper'

import RNPickerSelect from 'react-native-picker-select'

import LinearGradient from 'react-native-linear-gradient'

import {Controller, useController, useForm} from 'react-hook-form'

const DebitCardForm = (props) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm()

  const onSubmit = (data) => {
    // props.onSubmit(data)
    console.log(data)
  }
  console.log(errors)

  return (
    <Card style={styles.card} elevation={5}>
      <Text
        style={
          styles.info
        }>{`We'll save this card for your convenience. Remove it by going to Your Account section`}</Text>
      <Controller
        control={control}
        name="name"
        rules={{required: true, pattern: /^[a-zA-Z]+$/}}
        render={({field: {value, onChange}}) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Name on your Card"
            placeholderTextColor="grey"
            style={[styles.field, errors.name && styles.redBorder]}
          />
        )}
      />

      <Controller
        control={control}
        name="number"
        rules={{required: true, minLength: 16, maxLength: 16}}
        render={({field: {value, onChange}}) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Card Number"
            placeholderTextColor="grey"
            style={[styles.field, errors.number && styles.redBorder]}
            keyboardType={'number-pad'}
            maxLength={16}
          />
        )}
      />

      <Text
        style={{
          marginVertical: 10,
          marginLeft: 10,
          fontFamily: 'Poppins-Regular',
          color: '#8d949a',
        }}>
        Expiry Date
      </Text>
      <View style={styles.expiryView}>
        <Controller
          control={control}
          name="month"
          render={({field: {value, onChange}}) => (
            <RNPickerSelect
              placeholder={{label: 'Month', value: null}}
              style={{
                viewContainer: {
                  // width: 126,
                  height: 50,
                },
                inputAndroid: {
                  color: 'black',
                  width: 140,
                  marginHorizontal: -10,
                },
              }}
              items={[
                {label: 'January', value: '01'},
                {label: 'February', value: '02'},
                {label: 'March', value: '03'},
                {label: 'April', value: '04'},
                {label: 'May', value: '05'},
                {label: 'June', value: '06'},
                {label: 'July', value: '07'},
                {label: 'August', value: '08'},
                {label: 'September', value: '09'},
                {label: 'October', value: '10'},
                {label: 'November', value: '11'},
                {label: 'December', value: '12'},
              ]}
              value={value}
              onValueChange={onChange}
            />
          )}
        />
        <Controller
          name="year"
          control={control}
          render={({field: {value, onChange}}) => (
            <RNPickerSelect
              placeholder={{label: 'YEAR', value: null}}
              style={{
                viewContainer: {
                  // width: 112,
                  height: 50,
                },
                inputAndroid: {color: 'black', width: 140},
              }}
              // useNativeAndroidPickerStyle={false}
              // useNativeAndroidPickerStyle={false}
              items={[
                {label: '2021', value: '21'},
                {label: '2022', value: '22'},
                {label: '2023', value: '23'},
                {label: '2024', value: '24'},
                {label: '2025', value: '25'},
                {label: '2026', value: '26'},
                {label: '2027', value: '27'},
                {label: '2028', value: '28'},
                {label: '2029', value: '29'},
                {label: '2030', value: '30'},
              ]}
              value={value}
              onValueChange={(value) => {
                onChange(value)
              }}
            />
          )}
        />

        <Controller
          name="cvv"
          control={control}
          rules={{required: true, maxLength: 3, minLength: 3}}
          render={({field: {value, onChange}}) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              keyboardType={'number-pad'}
              placeholder="CVV"
              style={[
                styles.field,
                {marginTop: -10},
                errors.cvv && styles.redBorder,
              ]}
              maxLength={3}
            />
          )}
        />
      </View>
      <View style={{width: '100%', alignItems: 'center'}}>
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
              Save
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8faff',
    width: '98%',
    alignSelf: 'center',
    // height: 300,
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  info: {
    fontSize: 10,
  },
  field: {
    borderBottomWidth: 2,
    fontSize: 16,
    borderBottomColor: '#cccc',
    marginTop: 10,
  },
  expiryView: {
    width: '100%',
    minHeight: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  redBorder: {
    borderBottomColor: '#c12323',
  },
})

export default DebitCardForm
