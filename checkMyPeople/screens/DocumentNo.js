import React, {useState, useRef, useEffect, useContext} from 'react'
import {View, StyleSheet, Text, Image, Alert, ScrollView} from 'react-native'

import Colors from '../constants/Colors'
import AuthButton from '../components/AuthButton'

import {useNavigation} from '@react-navigation/native'
import Title from '../components/Title'
import TermsConditions from '../components/TermsConditions'
import {useForm} from 'react-hook-form'

import Input from '../components/Input'
import {AuthContext} from '../context/Auth'
import ProgressDialog from '../components/ProgressDialog'

const DocumentNo = () => {
  const [termAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggleSwitch = () =>
    setTermsAccepted((previousState) => {
      setValue('terms', !previousState)
      return !previousState
    })
  const {user, authToken, setUser, updateUserProfile} = useContext(AuthContext)
  const navigation = useNavigation()
  const emailRef = useRef()
  const docidRef = useRef()

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    reset,
    setValue,
    // setValue,
  } = useForm({
    mode: 'all',
  })

  const email = register('email')
  const docid = register('docid')
  const terms = register('terms', {
    required: 'Terms and Conditions are required to be Accepted',
  })

  const onSubmit = async (data) => {
    console.log('data', data)
    if (user.Account_Bal < 200) {
      return Alert.alert(
        '',
        'You don`t have sufficient balance in your wallet. Please load your wallet first and then try.',
        [{onPress: () => navigation.navigate('balance')}],
      )
    }
    setLoading(true)
    fetch(`https://checkmyhelp.com/verify?searchDOC=${data.docid}`)
      .then((res) => res.json())
      .then(async (data) => {
        await updateUserProfile({Account_Bal: user.Account_Bal - 200})
        setLoading(false)
        setUser((prev) => ({
          ...prev,
          Account_Bal: prev.Account_Bal - 200,
        }))
        if (!data) {
          throw new Error('Results not found')
        }
        console.log(data)

        navigation.navigate('licenseVerification', {
          item: data,
          searchByDocument: true,
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
  }
  useEffect(() => {
    if (user) {
      reset({email: user.Email, terms: termAccepted})
    }
  }, [reset, user])

  console.log(errors)
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <ProgressDialog loading={loading} />
      <Title text="Do your NIN Verification to avoid delays in passport processing, bank account opening, pension claims processing, student registration, Identity verification etc." />
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/document.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Input
        style={styles.input}
        control={control}
        name="docid"
        placeholder="DOCID"
        rules={{required: true, minLength: 10, maxLength: 10}}
        errors={errors.docid}
        ref={(e) => {
          docid.ref(e)
          docidRef.current = e
        }}
        onSubmitEditing={() => {
          emailRef.current.focus()
        }}
        blurOnSubmit={false}
        keyboardType="number-pad"
        maxLength={10}
      />
      {errors.docid && (
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

export default DocumentNo
