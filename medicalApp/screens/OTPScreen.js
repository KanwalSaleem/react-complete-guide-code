import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ToastAndroid,
  BackHandler,
} from 'react-native'
import {
  useNavigation,
  StackActions,
  useFocusEffect,
  CommonActions,
} from '@react-navigation/native'
import {Modal, Portal, Checkbox, ActivityIndicator} from 'react-native-paper'
// import {ActivityIndicator} from 'react-native-paper'

import Colors from '../constants/Colors'
import {AuthContext} from '../context/auth'
import {APIURL} from '../constants/url'
import AuthButton from '../components/AuthButton'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FeedBack from '../components/feedBack'
import {useDispatch} from 'react-redux'
import {login} from '../store/actions/auth'

const Otpscreen = (props) => {
  const [verify, setVerify] = useState(false)
  const [visible, setVisible] = useState(false)
  const {setUser} = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()
  let randomOtp = useRef()
  console.log(props.route.params, 'params')
  const OTP = []
  const [success, setSuccess] = useState(false)
  let ref_input = []
  ref_input[0] = useRef()
  ref_input[1] = useRef()
  ref_input[2] = useRef()
  ref_input[3] = useRef()
  ref_input[4] = useRef()
  ref_input[5] = useRef()
  const dispatch = useDispatch()

  const focusNext = (text, index) => {
    if (index < ref_input.length - 1 && text) {
      ref_input[index + 1].current.focus()
    }
    if (index == ref_input.length - 1) {
      ref_input[index].current
    }
    OTP[index] = text
  }
  const focusPrev = (key, index) => {
    if (key === 'Backspace' && index !== 0) {
      ref_input[index - 1].current.focus()
    }
  }

  const onSubmit = async () => {
    const otpCode = OTP.join('')

    console.log(otpCode)
    console.log(randomOtp, 'randomOtp')
    if (randomOtp.current == otpCode) {
      console.log(otpCode)
      setVerify(true)
      setVisible(true)

      if (props.route.params.forgotPassword) {
        props.navigation.navigate('resetPassword', {
          otp: randomOtp.current,
        })
      } else {
        setLoading(false)
        // setUser(props.route.params.user)
        // dispatch(login(props.route.params.user, props.route.params.token))

        return ToastAndroid.showWithGravity(
          'Successfully verified',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        )
      }
      // props.navigation.dispatch(StackActions.replace('home'))
      // navigation.reset({
      //   index: 0,
      //   routes: [{name: 'home'}],
      // })
      // return ToastAndroid.showWithGravity(
      //   'Successfully verified',
      //   ToastAndroid.SHORT,
      //   ToastAndroid.CENTER,
      // );
    }
    // else if (randomOtp.current != otpCode) {
    //   ref_input[0].focus()
    //   ref_input[0] = null
    //   ref_input[1] = null
    //   ref_input[2] = null
    //   ref_input[3] = null
    //   ref_input[4] = null
    //   ref_input[5] = null
    // }

    // return ToastAndroid.showWithGravity(
    //   'Wrong Code',
    //   ToastAndroid.SHORT,
    //   ToastAndroid.CENTER,
    // );
  }

  const sendOtp = useCallback(async () => {
    if (props.route.params.forgotPassword) {
      const formData = new FormData()

      formData.append('OTP', randomOtp.current)
      formData.append('email', props.route.params.email)

      const headers = new Headers()

      headers.append('Accept', 'Application/json')

      try {
        const response = await fetch(`${APIURL}/api/forgot-pass`, {
          method: 'POST',
          body: formData,
          headers,
        })

        const resData = await response.json()
        console.log(resData)
        if (!response.ok) {
          console.log(resData)
          throw new Error(resData.message)
        }

        setSuccess(!!resData)

        ToastAndroid.showWithGravity(
          resData.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        )
      } catch (e) {
        ToastAndroid.showWithGravity(
          e.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        )
      }
    } else {
      const formData = new FormData()

      formData.append('code', randomOtp.current)
      const headers = new Headers()

      headers.append('Accept', 'Application/json')
      headers.append('Authorization', `Bearer ${props.route.params.token}`)

      try {
        const response = await fetch(`${APIURL}/api/sendotp`, {
          method: 'POST',
          body: formData,
          headers,
        })

        const resData = await response.json()
        console.log(resData)
        setSuccess(!!resData)
        if (!response.ok) {
          console.log(resData)
          throw new Error(resData.message)
        }

        ToastAndroid.showWithGravity(
          resData.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        )
      } catch (e) {
        Alert.alert('Error', e.message)
      }
    }
  }, [
    props.route.params.email,
    props.route.params.forgotPassword,
    props.route.params.token,
  ])

  useFocusEffect(
    React.useCallback(() => {
      console.log(verify, 'verify')
      const onBackPress = () => {
        if (verify) {
          setVisible(false)
          // return true;
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'signUp'}],
            }),
          )

          // return false;
        }

        // navigation.dispatch(
        //   CommonActions.reset({
        //     index: 0,
        //     routes: [{name: 'signUp'}],
        //   }),
        // );
        return true

        // CommonActions.reset({
        //   index: 4,
        //   routes: [{name: 'signUp'}],
        // });

        // if (visible === true) {
        // const pushAction = StackActions.push('signUp');
        // navigation.dispatch(pushAction);
        // setVisible(false);
        // return true;
        // } else {
        // return false;
        // }
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [navigation, verify]),
  )

  useEffect(() => {
    randomOtp.current = `${Math.floor(Math.random() * 1)}${Math.floor(
      Math.random() * 9,
    )}${Math.floor(Math.random() * 7)}${Math.floor(
      Math.random() * 8,
    )}${Math.floor(Math.random() * 7)}${Math.floor(Math.random() * 7)}`
    console.log(randomOtp.current)

    sendOtp()
  }, [sendOtp])

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
      }}>
      <View
        style={{
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          borderRadius: 40,
          padding: 10,
          width: '90%',
          alignSelf: 'center',
        }}>
        <View>
          <Image
            style={{
              width: 100,
              height: 100,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              borderRadius: 50,
              borderWidth: 10,
              borderColor: 'white',
              marginTop: -50,
            }}
            source={require('../assets/signUpIcon.jpg')}
          />
          <Text
            style={{
              fontSize: 25,

              fontFamily: 'OpenSans-Bold',
              alignSelf: 'center',
              margin: 5,
              textAlign: 'center',
            }}>
            Please enter your the Verification Code.
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'OpenSans-Light',
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            We have sent a verification code to your registered E-mail address.
          </Text>
          <View
            style={{
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              flexDirection: 'row',
              padding: 25,
            }}>
            <View>
              <View
                style={{
                  // flex: 0.5,
                  backgroundColor: 'white',
                  // alignItems: 'center',
                  justifyContent: 'space-evenly',
                  flexDirection: 'row',
                  // marginBottom: -80,
                }}>
                <TextInput
                  autoFocus={true}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  ref={ref_input[0]}
                  onChangeText={(text) => focusNext(text, 0)}
                  onKeyPress={(e) => focusPrev(e.nativeEvent.key, 0)}
                  maxLength={1}
                  placeholder={'__'}
                  placeholderTextColor="black"
                  style={styles.codeInput}
                />

                <TextInput
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  ref={ref_input[1]}
                  onChangeText={(text) => focusNext(text, 1)}
                  onKeyPress={(e) => focusPrev(e.nativeEvent.key, 1)}
                  maxLength={1}
                  placeholder={'__'}
                  placeholderTextColor="black"
                  style={styles.codeInput}
                />

                <TextInput
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  ref={ref_input[2]}
                  onChangeText={(text) => focusNext(text, 2)}
                  onKeyPress={(e) => focusPrev(e.nativeEvent.key, 2)}
                  maxLength={1}
                  placeholder={'__'}
                  placeholderTextColor="black"
                  style={styles.codeInput}
                />

                <TextInput
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  ref={ref_input[3]}
                  onChangeText={(text) => focusNext(text, 3)}
                  onKeyPress={(e) => focusPrev(e.nativeEvent.key, 3)}
                  maxLength={1}
                  placeholder={'__'}
                  placeholderTextColor="black"
                  style={styles.codeInput}
                />

                <TextInput
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  ref={ref_input[4]}
                  // defaultValue={`${Math.floor(Math.random() * 7)}`}

                  onChangeText={(text) => focusNext(text, 4)}
                  onKeyPress={(e) => focusPrev(e.nativeEvent.key, 4)}
                  maxLength={1}
                  placeholder={'__'}
                  placeholderTextColor="black"
                  style={styles.codeInput}
                />

                <TextInput
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  ref={ref_input[5]}
                  onChangeText={(text) => focusNext(text, 5)}
                  onKeyPress={(e) => focusPrev(e.nativeEvent.key, 5)}
                  maxLength={1}
                  placeholder={'__'}
                  placeholderTextColor="black"
                  style={styles.codeInput}
                />
              </View>
            </View>
          </View>
          <Text
            style={{
              fontSize: 18,
              padding: 40,
              textAlign: 'center',
              marginBottom: -30,
            }}>
            {`  Didn't get a code ?`}
          </Text>
          <TouchableOpacity
            style={{
              fontColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
            }}
            onPress={sendOtp}>
            <Text
              style={{
                fontSize: 18,
                color: 'red',
                backgroundColor: 'white',
                width: 270,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                alignSelf: 'center',
                borderRadius: 9,
                marginTop: -20,
              }}>
              Send again
            </Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator color={Colors.primary} size="large" />
          ) : (
            <TouchableOpacity
              onPress={onSubmit}
              style={styles.button}
              disabled={!success && OTP.join('') !== randomOtp.current}
              // disabled={!success}
              activeOpacity={0.6}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* {feedBack()} */}
        <FeedBack
          onPress={() => {
            dispatch(login(props.route.params.user, props.route.params.token))
            setVisible(false)
          }}
          visible={visible}
          text="Thank You for Providing your Details. We will get back to you
        shortly."
          setVisible={setVisible}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  iconView: {
    marginVertical: 20,
    backgroundColor: Colors.primary,
    width: '12%',
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  button: {
    alignContent: 'center',
    textAlign: 'center',

    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 0,
  },
  buttonText: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'red',
    width: 290,
    height: 57,
    justifyContent: 'center',

    textAlign: 'center',
    alignSelf: 'center',
    borderRadius: 9,
    margin: 4,
    textAlignVertical: 'center',
  },
  codeInput: {
    // backgroundColor: 'white',
    fontWeight: '600',
    color: 'black',

    // padding: 10,
    fontSize: 20,
    // height: 55,
    width: 60,
    borderRadius: 10,
    // borderWidth: 0.5,
    // borderColor: 'white',
    // flexDirection: 'row',
  },
  modalContainer: {
    marginHorizontal: 10,
    // paddingBottom: 20,
    // height: 100,
    alignItems: 'center',
    paddingVertical: 40,
    paddingBottom: 30,
    borderRadius: 20,
    marginTop: 30,
    backgroundColor: 'white',
    // marginVertical: 10,
    // paddingHorizontal: 30,
  },

  doneView: {
    backgroundColor: '#4BAD26',
    width: '18%',
    height: 60,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  textView: {
    width: '80%',
    marginVertical: 30,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
  },
})

export default Otpscreen
