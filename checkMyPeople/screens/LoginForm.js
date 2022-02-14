import React, {useState, useRef, useEffect, useContext} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native'
import AuthButton from '../components/AuthButton'
import Header from '../components/Header'
import Input from '../components/Input'
import CustomProgressDialog from '../components/ProgressDialog'
import {useForm} from 'react-hook-form'
import {AuthContext} from '../context/Auth'
// import ProgressDialog from 'react-native-progress-dialog'
import Colors from '../constants/Colors'
import CaspioUrl from '../constants/CaspioUrl'
import tables from '../constants/CaspioTableNames'

const LoginForm = ({navigation}) => {
  const {setLoggedIn, authToken, setUser} = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const emailRef = useRef()
  const passwordRef = useRef()

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    reset,
    setError,
    // setValue,
  } = useForm()

  const email = register('email')

  // const password = register('password')

  const onSubmit = async (data) => {
    console.log('data', data)
    // setLoggedIn(true)
    try {
      setLoading(true)
      const response = await fetch(
        `${CaspioUrl}/rest/v2/tables/${tables.customerTable}/records?q.where=Email='${data.email}'`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
            // Cookie:
            //   'AWSALB=ea+GJociJSKvKA97k3VvvzQoDZ27Xl+u1a+grSRxY1bFvNK/W9jp/N+5ucZP81gTJTcaBeYLGkV+egoBVglYfDYDbv0zgKoRvyojoDHhq3c4we/QTPbF3XzX1Ol4; AWSALBCORS=ea+GJociJSKvKA97k3VvvzQoDZ27Xl+u1a+grSRxY1bFvNK/W9jp/N+5ucZP81gTJTcaBeYLGkV+egoBVglYfDYDbv0zgKoRvyojoDHhq3c4we/QTPbF3XzX1Ol4',
          },
        },
      )
      const resData = await response.json()
      if (resData.Result.length === 0) {
        setError(
          'email',
          {
            message: 'This Email does not Exist!',
          },
          {
            shouldFocus: true,
          },
        )

        // throw new Error('This Email does not Exist', {
        //   message: 'This Email does not Exist',
        // })
        return setLoading(false)
      } else if (!response.ok) {
        throw new Error(resData.Message, {
          message: resData.Message,
        })
      }
      const formData = new FormData()
      formData.append('token', 'ZFSgldjzfnvzkjdfbzdzfvbzdbdjkgSGVFddzfv')
      formData.append('email', data.email)
      fetch('https://sassolution.org/Checkmypeople/checkmypeople.php', {
        method: 'POST',
        body: formData,
        'Content-Type': 'application/json',
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('login', data)
          navigation.navigate('otp', {
            otp: data.OTP,
            user: resData.Result[0],
          })
          // setLoading(false)
        })
        .catch((e) => {
          // setLoading(false)
          Alert.alert('', e.message)
        })

      // fetch('https://api.checkmypeople.com/app/otp/', {
      //   method: 'POST',
      //   body: formData,
      //   'Content-Type': 'application/json',
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      //     console.log('login', data)
      //     // navigation.navigate('otp', {
      //     //   otp: data.OTP,
      //     //   user: resData.Result[0],
      //     // })
      //   })
      //   .catch((e) => {
      //     // setLoading(false)
      //     Alert.alert('', e.message)
      //   })
    } catch (e) {
      Alert.alert('', e.message)
      console.log(e.message)
    }
    setLoading(false)
    // setLoading(false)
  }

  console.log(errors)

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView contentContainerStyle={styles.screen}>
        <CustomProgressDialog loading={loading} />
        {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={}> */}
        <Header />
        <View style={styles.logo}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logoImage}
          />
        </View>

        <Input
          style={styles.input}
          container={{marginTop: 60}}
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
        {/* <Input
          style={styles.input}
          control={control}
          name="password"
          placeholder="Password"
          rules={{required: 'Password is Required'}}
          errors={errors.password}
          ref={(e) => {
            password.ref(e)
            passwordRef.current = e
          }}
          onSubmitEditing={() => {
            passwordRef.current.blur()
          }}
          blurOnSubmit={false}
          showPassword={true}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )} */}

        <AuthButton
          style={styles.buttonContainer}
          onPress={handleSubmit(onSubmit)}>
          Login
        </AuthButton>
        {/* 
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}>
          <Text style={styles.forgotText}>Continue as Guest</Text>
        </TouchableOpacity> */}
        <View style={styles.conditionContainer}>
          <Text style={styles.text} allowFontScaling={false}>
            Don’t have an account ?
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('signUpForm')}>
            <Text
              style={[styles.text, {color: Colors.primary}]}
              allowFontScaling={false}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
        <Text allowFontScaling={false}>OR</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('loginScreen')}>
          <Text style={styles.forgotText} allowFontScaling={false}>
            Continue as Guest
          </Text>
        </TouchableOpacity>
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    paddingTop: 20,
  },
  logo: {
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginHorizontal: 20,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  conditionContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    marginHorizontal: 2,
  },
  forgotText: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    marginVertical: 10,
    marginBottom: 15,
  },
  logoImage: {
    width: '100%',
    height: 30,
    marginTop: 20,
  },
  errorText: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    color: Colors.common.errorColor,
  },
})

export default LoginForm
