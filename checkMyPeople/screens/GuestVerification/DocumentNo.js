import React, {useState, useRef, useEffect, useContext} from 'react'
import {View, StyleSheet, Text, Image, Alert, ScrollView} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useNavigation} from '@react-navigation/native'
import Title from '../../components/Title'
import TermsConditions from '../../components/TermsConditions'
import {useForm} from 'react-hook-form'
import Input from '../../components/Input'
import {AuthContext} from '../../context/Auth'
import Colors from '../../constants/Colors'
import AuthButton from '../../components/AuthButton'
import PaymentView from '../../components/PaymentView'
import ProgressDialog from '../../components/ProgressDialog'
import CaspioUrl from '../../constants/CaspioUrl'
import tables from '../../constants/CaspioTableNames'
const DocumentNo = () => {
  const [termAccepted, setTermsAccepted] = useState(false)
  const [initiatePayment, setInitiatePayment] = useState(false)
  const [loading, setLoading] = useState(false)
  const toggleSwitch = () =>
    setTermsAccepted((previousState) => {
      setValue('terms', !previousState)
      return !previousState
    })
  const {user, authToken} = useContext(AuthContext)
  const navigation = useNavigation()
  const emailRef = useRef()
  const docidRef = useRef()

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    reset,
    watch,
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

  const onSubmit = (data) => {
    console.log('data', data)
    setInitiatePayment(true)
  }

  const successPayment = async () => {
    setInitiatePayment(false)
    setLoading(true)
    await AsyncStorage.setItem('guestEmail', watch('email'))
    fetch(`https://checkmyhelp.com/verify?searchDOC=${watch('docid')}`)
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data, 'data')
        if (data == null) {
          throw new Error('Results not found')
          // return Alert.alert('', 'Results not found')
        } else {
          return data
        }
      })
      // .catch((e) => {
      //   Alert.alert(e.message)
      //   setLoading(false)
      // })
      .then((data) =>
        fetch(
          `${CaspioUrl}/rest/v2/tables/${tables.docVerify}/records?response=rows`,
          {
            method: 'POST',
            body: JSON.stringify({
              DOCID: watch('docid'),
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
          setLoading(false)
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
    // fetch(`https://checkmyhelp.com/verify?searchDOC=${watch('docid')}`)
    //   .then((res) => res.json())
    //   .then(async (data) => {
    //     setLoading(false)

    //     if (!data) {
    //       return Alert.alert('', 'Results not found')
    //     }
    //     console.log(data)

    //     navigation.navigate('licenseVerification', {
    //       item: data,
    //     })

    //   })
    //   .catch((e) => {
    //     Alert.alert(e.message)
    //     setLoading(false)
    //   })

    // navigation.navigate('licenseVerification', {
    //   item: 'dasd',
    // })
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
  console.log(errors)
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <ProgressDialog loading={loading} />
      <Title text="Do your NIN Verification to avoid delays in passport processing, bank account opening, pension claims processing, student registration, Identity verification etc." />
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/document.png')}
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
