import React, {useRef, useContext, useState, useEffect} from 'react'
import {StyleSheet, ScrollView, Text, Image, View, Alert} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {useNavigation} from '@react-navigation/native'
import Title from '../../components/Title'
import TermsConditions from '../../components/TermsConditions'
import {useForm, useWatch} from 'react-hook-form'
import Input from '../../components/Input'
import CustomProgressDialog from '../../components/ProgressDialog'
import {AuthContext} from '../../context/Auth'
import Colors from '../../constants/Colors'
import AuthButton from '../../components/AuthButton'
import PaymentView from '../../components/PaymentView'
import CaspioUrl from '../../constants/CaspioUrl'
import tables from '../../constants/CaspioTableNames'

const TelephoneNo = () => {
  const [termAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [initiatePayment, setInitiatePayment] = useState(false)
  const {authToken} = useContext(AuthContext)

  const toggleSwitch = () =>
    setTermsAccepted((previousState) => {
      setValue('terms', !previousState)
      return !previousState
    })

  const navigation = useNavigation()
  const emailRef = useRef()
  const telephoneRef = useRef()

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    reset,
    watch,
    setValue,
    // setValue,
  } = useForm()

  const email = register('email')
  const telephone = register('telephone')
  const terms = register('terms', {
    required: 'Terms and Conditions are required to be Accepted',
  })

  const onSubmit = (data) => {
    console.log('data', data)
    setInitiatePayment(true)
    // navigation.navigate('licenseVerification', {searchByPhone: true})
  }

  const successPayment = async () => {
    setInitiatePayment(false)
    setLoading(true)
    await AsyncStorage.setItem('guestEmail', watch('email'))
    await fetch(
      `${CaspioUrl}/rest/v2/tables/${tables.phoneVerify}/records?response=rows`,
      {
        method: 'POST',
        body: JSON.stringify({
          PhoneID: watch('telephone'),
          Email: watch('email'),
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      },
    )
      .then((res) => res.json())
      .catch((e) => console.log(e))
    fetch(`https://checkmyhelp.com/verify?searchPhone=${watch('telephone')}`)
      .then((res) => res.json())
      .then(async (data) => {
        setLoading(false)

        if (!data) {
          return Alert.alert('', 'Results not found')
        }
        console.log(data)

        navigation.navigate('filterDateOfBirth', {
          email: watch('email'),
          data: data.length ? data : [data],
        })
      })
      .catch((e) => {
        Alert.alert(e.message)
        // Alert.alert(
        //   '',
        //   'Sorry, we are unable to complete your request. Please try again later.',
        // )
        setLoading(false)
      })

    // navigation.navigate('licenseVerification', {
    //   item: 'dasd',
    // })
  }
  // () => {
  //   setInitiatePayment(false)
  //   navigation.navigate('filterDateOfBirth', {
  //     telephone: watch('telephone'),
  //     searchByPhone: true,
  //     email: watch('email'),
  //   })
  // }
  if (initiatePayment) {
    return (
      <PaymentView
        amount={200}
        email={watch('email')}
        onCancel={() => setInitiatePayment(false)}
        onSuccess={successPayment}
      />
    )
  }
  console.log(errors)
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <CustomProgressDialog loading={loading} />
      <Title text="Are you an employer, landlord or business owner? Verify the identity of your employees or business partners. Ensure they are who they say they are." />
      <View style={{width: '100%', alignSelf: 'center', borderRadius: 10}}>
        <Image
          source={require('../../assets/Searchbyphone.jpg')}
          style={{
            width: '80%',
            height: 150,
            borderRadius: 20,
            // resizeMode:'contain',
            marginBottom: 10,
            alignSelf: 'center',
            aspectRatio: 4 / 3,
          }}
          borderRadius={10}
        />
      </View>

      <Input
        style={styles.input}
        control={control}
        name="telephone"
        placeholder="Telephone"
        rules={{required: true, minLength: 8, maxLength: 15}}
        errors={errors.telephone}
        ref={(e) => {
          telephone.ref(e)
          telephoneRef.current = e
        }}
        onSubmitEditing={() => {
          emailRef.current.focus()
        }}
        blurOnSubmit={false}
        keyboardType="phone-pad"
        maxLength={15}
      />
      {errors.telephone && (
        <Text style={styles.errorText} allowFontScaling={false}>
          This field is Required
        </Text>
      )}

      <Input
        style={styles.input}
        control={control}
        rules={{
          required: 'Email is Required',
          pattern: {
            value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            message: 'Must be a valid Email',
          },
        }}
        errors={errors.email}
        name="email"
        placeholder="Email"
        ref={(e) => {
          email.ref(e)
          emailRef.current = e
        }}
        onSubmitEditing={() => {
          emailRef.current.blur()
        }}
        blurOnSubmit={false}
        returnKeyType="next"
        keyboardType="email-address"
      />
      {errors.email && (
        <Text style={styles.errorText} allowFontScaling={false}>
          {errors.email.message}
        </Text>
      )}

      <TermsConditions termsAccepted={termAccepted} toggleSwitch={toggleSwitch}>
        {errors.terms && (
          <Text style={styles.errorText} allowFontScaling={false}>
            {errors.terms.message}
          </Text>
        )}
      </TermsConditions>
      <AuthButton
        style={styles.buttonContainer}
        onPress={handleSubmit(onSubmit)}>
        Procced to VERIFY NIN
      </AuthButton>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    paddingBottom: 10,
  },

  buttonContainer: {
    marginTop: 50,
  },
  errorText: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    color: Colors.common.errorColor,
  },
})

export default TelephoneNo
