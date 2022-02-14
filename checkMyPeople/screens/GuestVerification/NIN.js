import React, {useState, useRef, useContext} from 'react'
import {View, StyleSheet, Text, Image, Alert, ScrollView} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useNavigation} from '@react-navigation/native'
import Title from '../../components/Title'
import TermsConditions from '../../components/TermsConditions'
import {useForm} from 'react-hook-form'
import Input from '../../components/Input'
import {AuthContext} from '../../context/Auth'
import AuthButton from '../../components/AuthButton'
import PaymentView from '../../components/PaymentView'
import ProgressDialog from '../../components/ProgressDialog'
import Colors from '../../constants/Colors'
import CaspioUrl from '../../constants/CaspioUrl'
import tables from '../../constants/CaspioTableNames'

const NIN = () => {
  const [termAccepted, setTermsAccepted] = useState(false)
  const [initiatePayment, setInitiatePayment] = useState(false)
  const [loading, setLoading] = useState(false)

  const {user, authToken} = useContext(AuthContext)
  const navigation = useNavigation()
  const emailRef = useRef()
  const ninRef = useRef()

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    watch,
    setValue,
  } = useForm()

  const email = register('email')
  const nin = register('nin')
  const terms = register('terms', {
    required: 'Terms and Conditions are required to be Accepted',
  })
  const toggleSwitch = () =>
    setTermsAccepted((previousState) => {
      setValue('terms', !previousState)
      return !previousState
    })

  const onSubmit = (data) => {
    console.log('data', data)
    setInitiatePayment(true)
  }
  console.log(authToken)
  const successPayment = async () => {
    setInitiatePayment(false)
    setLoading(true)
    await AsyncStorage.setItem('guestEmail', watch('email'))
    fetch(`https://checkmyhelp.com/verify?NewNIN=${watch('nin')}`)
      .then((res) => res.json())
      .then(async (data) => {
        setLoading(false)

        if (!data) {
          throw new Error('Results not found')
        } else {
          console.log(data, 'resData')
          return data
        }
      })
      .then((data) =>
        fetch(
          `${CaspioUrl}/rest/v2/tables/${tables.ninVerify}/records?response=rows`,
          {
            method: 'POST',
            body: JSON.stringify({
              NIN: watch('nin'),
              Email: watch('email'),
              LastName: data.surname,
              FirstName: data.firstname,
            }),

            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          },
        ).then(async (res) => {
          await res.json()

          navigation.navigate('licenseVerification', {
            item: data,
          })
        }),
      )
      .catch((e) => {
        Alert.alert(e.message)
        // Alert.alert(
        //   '',
        //   'Sorry, we are unable to complete your request. Please try again later.',
        // )
        setLoading(false)
      })
  }

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

  const ninVeri = () => {
    fetch(
      `${CaspioUrl}/rest/v2/tables/${tables.ninVerify}/records?response=rows`,
      {
        method: 'POST',
        body: JSON.stringify({
          NIN: watch('nin'),
          Email: watch('email'),
          FirstName: 'SodaisM',
          LastName: 'Muhammad',
        }),

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      },
    ).then(async (res) => {
      await res.json()
    })
  }
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <ProgressDialog loading={loading} />
      <Title text="Do your NIN Verification to avoid delays in passport processing, bank account opening, pension claims processing, student registration, Identity verification etc." />
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/NIN.png')}
          style={styles.image}
          // resizeMode="center"
        />
      </View>
      <Input
        style={styles.input}
        control={control}
        name="nin"
        placeholder="NIN"
        rules={{
          required: 'NIN must be 11 digits',
          minLength: {value: 11, message: 'NIN must be 11 digits'},
          maxLength: {value: 11, message: 'NIN must be 11 digits'},
        }}
        errors={errors.nin}
        ref={(e) => {
          nin.ref(e)
          ninRef.current = e
        }}
        onSubmitEditing={() => {
          emailRef.current.focus()
        }}
        blurOnSubmit={false}
        keyboardType="number-pad"
        maxLength={11}
      />
      {errors.nin && (
        <Text style={styles.errorText} allowFontScaling={false}>
          {errors.nin.message}
        </Text>
      )}
      {!user && (
        <>
          <Input
            style={styles.input}
            control={control}
            rules={{
              required: 'E-mail is Required',
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: 'Enter a valid E-mail',
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
        </>
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
  imageContainer: {
    backgroundColor: 'rgba(76, 150, 214, 0.12)',
    width: '60%',
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: '80%',
    height: 100,
    aspectRatio: 16 / 9,
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

export default NIN
