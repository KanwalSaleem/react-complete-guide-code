import React, {useRef, useContext, useState, useEffect} from 'react'
import {StyleSheet, ScrollView, Text, Image, View, Alert} from 'react-native'

import {useForm} from 'react-hook-form'
import {useNavigation} from '@react-navigation/native'

import {AuthContext} from '../context/Auth'

import Title from '../components/Title'
import TermsConditions from '../components/TermsConditions'
import Input from '../components/Input'
import AuthButton from '../components/AuthButton'
import ProgressDialog from '../components/ProgressDialog'

import Colors from '../constants/Colors'

const TelephoneNo = () => {
  const {user, authToken, setUser, updateUserProfile} = useContext(AuthContext)
  const [termAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
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
    setValue,
    // setValue,
  } = useForm()

  const email = register('email')
  const telephone = register('telephone')
  const terms = register('terms', {
    required: 'Terms and Conditions are required to be Accepted',
  })

  const onSubmit = async (data) => {
    const telephone = data.telephone
    if (user.Account_Bal < 1000) {
      return Alert.alert(
        '',
        'You don`t have sufficient balance in your wallet. Please load your wallet first and then try.',
        [{onPress: () => navigation.navigate('balance')}],
      )
    }
    setLoading(true)
    await updateUserProfile({Account_Bal: user.Account_Bal - 200})
    setUser((prev) => ({...prev, Account_Bal: prev.Account_Bal - 200}))
    fetch(`https://checkmyhelp.com/verify?searchPhone=${data.telephone}`)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false)
        if (!data) {
          return Alert.alert('', 'Results not found')
        }

        // console.log(data)

        navigation.navigate('filterDateOfBirth', {
          data: data.length ? data : [data],
          phone: telephone,
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
    // updateUserProfile({Account_Bal: user.Account_Bal - 200})
    // setUser((prev) => ({...prev, Account_Bal: prev.Account_Bal - 200}))

    // navigation.navigate('filterDateOfBirth', {
    //   telephone: data.telephone,
    // })
  }
  useEffect(() => {
    if (user) {
      reset({email: user.Email, terms: termAccepted})
    }
  }, [reset])

  console.log(errors)
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <ProgressDialog loading={loading} />
      <Title text="Are you an employer, landlord or business owner? Verify the identity of your employees or business partners. Ensure they are who they say they are." />
      <View style={{width: '100%', alignSelf: 'center', borderRadius: 10}}>
        <Image
          source={require('../assets/Searchbyphone.jpg')}
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
      {!user && (
        <>
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
