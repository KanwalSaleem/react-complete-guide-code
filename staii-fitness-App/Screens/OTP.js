import React, {useState, useRef, useEffect, useContext} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {Colors} from 'react-native/Libraries/NewAppScreen'
// import AuthButton from '../components/AuthButton'
// import Header from '../components/Header'
import AppContext from '../Context/AppContext'

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'

const cellCount = 4
const OTP = ({route, navigation}) => {
  const {user, otp, email} = route.params
  const {setUser, setTempId} = useContext(AppContext)

  const [value, setValue] = useState('')
  const ref = useBlurOnFulfill({value, cellCount})
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  })

  useEffect(() => {
    const otpHandler = async () => {
      // const userType = user.user_type === 'teacher' ? 'E' : 'S';
      console.log(value)
      if (parseInt(value) === otp && value.length === 4) {
        // Alert.alert('Success', 'Successfully Logged In')
        // if (user.already_completed) {
        //   await AsyncStorage.setItem('email', user.user_email)
        //   await AsyncStorage.setItem('appIntro', 'true')
        //   setUser(user)
        //   return
        // }
        // console.log(res, 'res')
        if (user.already_completed) {
          await AsyncStorage.setItem('email', user.user_email)
          await AsyncStorage.setItem('appIntro', 'true')
          setUser(user)
          return
        }
        navigation.replace('selectSport', {
          user,
        })
        // navigation.dispatch(
        //   CommonActions.reset({
        //     index: 1,
        //     routes: [
        //       {
        //         name: 'selectSport',
        //         params: {
        //           // otp: res.OTP_code,
        //           // email: res.Data.user_email,
        //           user,
        //         },
        //       },
        //     ],
        //   }),
        // )

        // const parseUser = {
        //   ...user,
        //   academy: `Academy${user.accadamy_id}`,
        //   user_id,
        // };
        // delete parseUser.accadamy_id

        // setTempId(user.user_id);
        // setUser(route.params.user)
      } else if (parseInt(value) !== otp && value.length === 4) {
        Alert.alert(
          '',
          'Whoops, this verification code doesn’t match the secure code we’ve shared with you on your registered email. Please re-enter the code',
          [{onPress: () => setValue('')}],
        )
      }
    }
    otpHandler()
  }, [otp, user, value])

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.screen}>
        {/* <Header /> */}
        <Text style={styles.heading}>Enter Verification code</Text>
        <Text style={[styles.text, {marginTop: 10}]}>
          We`ve sent a 4-digit code your registered email {email}.
        </Text>
        <Text style={styles.text}>
          Please enter it below the enter the world of STAII
        </Text>
        <CodeField
          ref={ref}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          onChangeText={setValue}
          cellCount={cellCount}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'black',
    // alignItems: 'center',
    paddingTop: 20,
    justifyContent: 'center',
  },
  heading: {
    color: 'white',
    paddingHorizontal: 10,
    fontFamily: 'Roboto-Bold',
    fontSize: 23,
    marginLeft: '10%',
    fontWeight: '700',
  },

  text: {
    fontSize: 16,
    color: 'white',
    marginLeft: '10%',
    marginHorizontal: 2,
  },

  codeFieldRoot: {
    marginTop: 40,
    marginBottom: 20,
    width: '80%',
    alignSelf: 'center',
  },
  cell: {
    width: 50,
    height: 50,
    padding: 5,
    fontSize: 24,
    // borderWidth: 1.5,
    marginHorizontal: 5,
    borderRadius: 5,
    color: 'black',
    backgroundColor: '#F1F4FAC2',
    elevation: 5,
    shadowColor: 'black',
    borderColor: Colors.themeRed,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
    color: '#000',
  },
})

export default OTP
