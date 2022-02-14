import React, {useState, useContext, useLayoutEffect} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native'
import {Colors} from 'react-native/Libraries/NewAppScreen'
import AuthButton from '../components/AuthButton'
import Header from '../components/Header'
import {useNavigation, CommonActions} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'
import {AuthContext} from '../context/Auth'

const cellCount = 4
const OTP = ({route, navigation}) => {
  const [value, setValue] = useState('')
  const ref = useBlurOnFulfill({value, cellCount})
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  })
  const {setUser} = useContext(AuthContext)
  const [error, setError] = useState(false)

  const onSubmit = async () => {
    if (value.length === 0) {
      setError(true)
    }

    if (parseInt(value) === route.params.otp && value.length === 4) {
      // Alert.alert('Success', 'Successfully Logged In')
      const parsedUser = JSON.stringify(route.params.user)
      await AsyncStorage.setItem('user', parsedUser)
      setUser(route.params.user)
      console.log(route.params.user)
    } else if (parseInt(value) !== route.params.otp && value.length === 4) {
      Alert.alert(
        '',
        'Whoops, this verification code doesn’t match the secure code we’ve shared with you on your registered email. Please re-enter the code',
        [{onPress: () => setValue('')}],
      )
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {/* <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
      <View style={styles.screen}>
        {/* <Header /> */}
        <View style={styles.logo}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logoImage}
          />
        </View>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Inter-Regular',
            textAlign: 'center',
            fontSize: 18,
            marginHorizontal: 5,
          }}
          allowFontScaling={false}>
          We sent you email with OTP code. Please enter OTP to proceed.
        </Text>
        <CodeField
          ref={ref}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          textInputStyle={{
            shadowColor: 'black',
            shadowOpacity: 0.26,
            shadowOffset: {width: 0, height: 2},
            shadowRadius: 8,
            width: 50,
            height: 50,
            padding: 5,
            fontSize: 24,
            borderRadius: 5,
          }}
          onChangeText={setValue}
          cellCount={cellCount}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <View
              key={index}
              onLayout={getCellOnLayoutHandler(index)}
              style={[
                styles.cell,
                isFocused && styles.focusCell,
                error === true && styles.errorBorder,
              ]}>
              <Text
                style={{
                  fontSize: 24,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  color: 'black',
                  alignSelf: 'center',
                }}
                allowFontScaling={false}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />

        <AuthButton style={styles.buttonContainer} onPress={onSubmit}>
          Verify
        </AuthButton>

        {/* <View style={styles.conditionContainer}>
          <Text style={styles.text}>Don’t have an account ?</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('signUpForm')}>
            <Text style={[styles.text, {color: Colors.primary}]}>
              Registration
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
      {/* </KeyboardAvoidingView> */}
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    paddingTop: 20,
    // paddingBottom:20
  },
  logo: {
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    marginHorizontal: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  conditionContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    marginHorizontal: 2,
  },
  forgotText: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: 'Inter-Regular',
    marginVertical: 10,
  },
  logoImage: {
    width: '100%',
    height: 30,
    marginTop: 20,
  },
  codeFieldRoot: {
    marginTop: 40,
    marginBottom: 20,
  },
  cell: {
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    width: 50,
    height: 50,
    padding: 5,
    fontSize: 24,
    borderRadius: 5,
    // borderWidth: 1.5,
    marginHorizontal: 5,

    color: 'black',
    backgroundColor: '#fff',
    elevation: 5,

    // borderColor: Colors.themeRed,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
    color: '#000',
  },
  errorBorder: {
    borderWidth: 0.5,
    borderColor: 'red',
  },
})

export default OTP
