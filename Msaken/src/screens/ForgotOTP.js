import React from 'react';
import {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Animated,
  View,
  useWindowDimensions,
  ImageBackground,
  KeyboardAvoidingView,
} from 'react-native';
import services from '../common/service';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import color from '../common/colors';
import FA from 'react-native-vector-icons/FontAwesome';

import Toast from 'react-native-simple-toast';

function ForgotOTP({route, navigation}) {
  const CELL_COUNT = 6;
  const [mobile, setMobile] = useState(route.params ? route.params.mobile : '');
  const [otp, setOtp] = useState(route.params ? route.params.otp : '');
  const [value, setValue] = useState('' + otp);

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      setTimerActive(false);
    }
  }, [timer]);

  const regHandler = () => {
    if (value.length < 6) {
      Toast.show('Enter valid otp !', Toast.SHORT);
    } else {
      services
        .verifyOTP('?mobile_no=' + mobile + '&otp=' + value)
        .then(res => {
          const response = res.data;
          if (response.status == true) {
            // mobile
            navigation.navigate('ResetPassword', {
              mobile: mobile,
            });
          } else {
            Toast.show('Something went wrong !', Toast.SHORT);
          }
        })
        .catch(err => {
          const error = err.response;
          console.log('error ' + error);
          if (error.error == true) {
            Toast.show(' ' + error.message, Toast.SHORT);
          } else {
            Toast.show('Something went wrong !', Toast.SHORT);
          }
        });
    }
  };

  const sendOTP = () => {
    console.log('ss');
    services
      .getOTP('?mobile_no=' + mobile)
      .then(res => {
        const response = res.data;
        if (response.status == true) {
          setTimer(30);
          Toast.show('OTP : ' + response.data.otp, Toast.LONG);
        } else {
          Toast.show('Something went wrong !', Toast.SHORT);
        }
      })
      .catch(err => {
        console.log(err.response.data);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}
        source={require('../assets/property.png')}
        resizeMode="cover">
        <KeyboardAvoidingView
          style={{
            padding: 10,
            borderTopLeftRadius: 50,
            backgroundColor: 'white',

            borderTopRightRadius: 50,
          }}>
          <View
            style={{
              borderRadius: 45,
              height: 90,
              marginTop: -46,
              width: 90,
              alignSelf: 'center',
              backgroundColor: 'green',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: color.themeRed,
                borderRadius: 45,
                height: 90,
                width: 90,
                borderWidth: 10,
                borderColor: color.themeWhite,
              }}>
              <FA name="mobile-phone" size={50} color="#fff" />
            </View>
          </View>

          <View style={{paddingTop: 20}}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 20,
                fontWeight: '600',
                paddingBottom: 15,
              }}>
              Please enter the Verification Code
            </Text>
          </View>
          <View>
            <Text
              style={{
                alignSelf: 'center',
                paddingBottom: 5,
                textAlign: 'center',
              }}>
              we have send a verification code to your registered phone number{' '}
            </Text>
          </View>

          <View style={{paddingHorizontal: 20, padding: 10}}>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
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
          {timerActive ? (
            <View style={{alignItems: 'center', padding: 10}}>
              <Text
                style={{
                  color: color.themeRed,
                  fontSize: 18,
                  fontWeight: '500',
                }}>
                {timer}
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                padding: 10,
                alignSelf: 'center',
              }}>
              <Text style={{paddingRight: 5}}>Didn{"'"}t get a code ?</Text>
              <TouchableOpacity onPress={sendOTP}>
                <Text style={{color: color.themeRed, fontWeight: '600'}}>
                  Send again
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{paddingBottom: 40}}>
            <TouchableOpacity
              onPress={() => {
                regHandler();
              }}
              style={[styles.button, {width: '90%', alignSelf: 'center'}]}>
              <Text style={styles.submitText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 1.5,
    borderRadius: 5,
    color: color.inputFontBlack,
    backgroundColor: '#fff',
    borderColor: color.themeRed,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
    color: '#000',
  },
  button: {
    margin: 12,
    padding: 10,
    backgroundColor: color.themeRed,
    borderRadius: 40,
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ForgotOTP;
