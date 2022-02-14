import React, {useState, useContext} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PrimaryButton from '../Components/PrimaryButton'
import {useForm, Controller} from 'react-hook-form'

import AppContext from '../Context/AppContext'
import ApiUrl from '../Constants/ApiUrl'

const Login = ({navigation}) => {
  const {setUser} = useContext(AppContext)
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm()
  const [loading, setLoading] = useState(false)
  // console.log(errors)
  const onSubmit = ({email}) => {
    const formData = new FormData()

    formData.append('token', 'ZFSgldjzfnvzkjdfbzdzfvbzdbdjkgSGVFddzfv')
    formData.append('user_email', email)
    formData.append('logintype', true)
    setLoading(true)
    fetch(`${ApiUrl}/authenticate.php`, {
      method: 'POST',
      body: formData,
      'Content-type': 'application/json',
    })
      .then((res) => {
        // console.log(res)

        return res.json()
      })
      .then(async (res) => {
        // console.log(res)
        if (res.response == '404') {
          console.log(res)
          Alert.alert(
            '',
            'STAII is invite only at the moment, but are working hard to launch! Stay tuned!',
          )
          setLoading(false)
          return
        }
        console.log(res.Data.status, 'status')
        if (res.Data.status == 0) {
          Alert.alert('', 'Your account needs to be Activated from the Admin.')
          setLoading(false)
          return
        }

        // console.log(res, 'res')
        // if (res.Data.already_completed) {
        //   await AsyncStorage.setItem('email', res.Data.user_email)
        //   await AsyncStorage.setItem('appIntro', 'true')
        //   setUser(res.Data)
        //   return
        // }
        console.log(res)
        return navigation.navigate('otp', {
          otp: res.OTP_code,
          email: res.Data.user_email,
          user: res.Data,
        })
      })
      .catch((e) => {
        setLoading(false)
        Alert.alert('', e.message)
      })
      .finally(() => setLoading(false))
  }
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Image
        source={require('../assets/loginGraphic.png')}
        style={styles.image}
      />
      <View style={{paddingHorizontal: 10}}>
        <Text style={styles.text}>STAII invite-only at this</Text>
        <Text style={styles.text}>
          time. Please reach out to info@gmail.com for an invite!
        </Text>
        {loading ? (
          <View style={{marginTop: 80}}>
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : (
          <>
            <Controller
              control={control}
              rules={{
                required: 'Email is Required',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Must be a valid Email',
                },
              }}
              name="email"
              render={({field: {value, onChange}}) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Email Address"
                  style={styles.input}
                  placeholderTextColor="grey"
                />
              )}
            />
            {errors.email && (
              <Text
                style={{
                  fontFamily: 'DMSans-Bold',
                  color: 'white',
                  fontSize: 16,
                  alignSelf: 'center',
                }}>
                {errors.email.message}
              </Text>
            )}

            <PrimaryButton
              style={styles.button}
              onPress={handleSubmit(onSubmit)}>
              Send Login Code
            </PrimaryButton>
          </>
        )}
      </View>
    </ScrollView>
    // </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {
    // flex: 1,
    backgroundColor: 'black',
    paddingTop: '20%',
  },
  text: {
    color: 'white',
    fontSize: 27,
    fontWeight: '700',
    textAlign: 'left',
    // alignSelf: '',
    fontFamily: 'Roboto-Bold',
    // marginLeft: 20,
  },
  input: {
    color: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: 'white',
    marginBottom: 15,
    fontWeight: '700',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 354.67,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  button: {margin: 10, borderRadius: 5},
})

export default Login
