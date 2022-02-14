import React, {useContext} from 'react';
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
import Toast from 'react-native-simple-toast';
import {AuthContext} from '../context/AuthContext';

import FA from 'react-native-vector-icons/FontAwesome';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Colors} from 'react-native/Libraries/NewAppScreen';

function OTP({route, navigation}) {
  const {passState, setPassState, language, selectedLanguage} =
    useContext(AuthContext);

  const CELL_COUNT = 6;

  const [formData, setFormData] = useState(
    route.params ? route.params.formData : '',
  );
  const [mobile, setMobile] = useState(route.params ? route.params.mobile : '');
  const [otp, setOtp] = useState(route.params ? route.params.otp : '');

  const [value, setValue] = useState('' + otp);

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const regHandler = () => {
    services
      .verifyOTP('?mobile_no=' + mobile + '&otp=' + value)
      .then(res => {
        const response = res.data;
        console.log(response);
        if (response.status == true) {
          services
            .register(formData)
            .then(res => {
              const response = res.data;
              console.log(response, 'numberRegister');
              if (response.status == true) {
                Toast.show(' ' + response.message, Toast.SHORT);
                navigation.replace('Login');
                setPassState({});
              } else {
                Toast.show(language.somethingWentWrong, Toast.SHORT);
              }
            })
            .catch(err => {
              console.log(err);
              const error = err.response.data;
              if (error.error == true) {
                Toast.show(' ' + error.message, Toast.SHORT);
              } else {
                Toast.show(language.somethingWentWrong, Toast.SHORT);
              }
            });
        } else {
          Toast.show(language.somethingWentWrong, Toast.SHORT);
        }
      })
      .catch(err => {
        const error = err.response.data;
        console.log(err);
        if (error.error == true) {
          Toast.show(' ' + error.message, Toast.SHORT);
        } else {
          Toast.show(language.somethingWentWrong, Toast.SHORT);
        }
      });
  };

  const sendOTP = () => {
    console.log('mobile ' + mobile);
    services
      .getOTP('?mobile_no=' + mobile)
      .then(res => {
        const response = res.data;
        if (response.status == true) {
          Toast.show('OTP : ' + response.data.otp, Toast.LONG);
        } else {
          Toast.show(language.somethingWentWrong, Toast.SHORT);
        }
      })
      .catch(err => {
        console.log(err.response.data);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {/* <Image
        source={require('../assets/photo_1.png')}
        // resizeMode="contain"
        style={{alignSelf: 'center', width: '100%', height: 400}}
      /> */}
      {/* <ImageBackground
        style={{
          flex: 1,
          // justifyContent: 'flex-end',
        }}
        source={require('../assets/otpLogo.png')}
        resizeMode="cover">
          </ImageBackground> */}
      {/* <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,

            backgroundColor: 'rgba(0,0,30,0.3)',
          }}
        />

        <KeyboardAvoidingView
          style={{
            backgroundColor: 'white',
            padding: 10,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}>
          <View
            style={{
              borderRadius: 50,
              height: 100,
              width: 100,
              marginTop: -50,
              alignSelf: 'center',
              backgroundColor: 'green',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: color.themeRed,
                borderRadius: 50,
                height: 100,
                width: 100,
                borderWidth: 10,
                borderColor: color.themeWhite,
              }}>
              <FA name="mobile-phone" size={50} color="#fff" />
            </View>
          </View>

          <View style={{paddingTop: 20, paddingHorizontal: 30}}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 16,
                paddingBottom: 15,
                fontFamily: 'Roboto_Bold',
              }}>
              {language.pleaseEnterTheVerificationCode}
            </Text>

            <Text
              style={{
                alignSelf: 'center',
                // paddingBottom: 15,
                textAlign: 'center',
                color: color.grey,
                fontFamily: 'Roboto-Regular',
                fontSize: 14,
              }}>
              {language.weHaveSendAVerificationCodeToYourRegisteredPhoneNumber}{' '}
            </Text>
          </View>

          <View style={{paddingHorizontal: 0, padding: 10}}>
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
          <View
            style={{
              flexDirection:
                selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
              padding: 10,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                paddingRight: 5,
                fontSize: 14,
                fontFamily: 'Roboto-Regular',
              }}>
              {language.didNotgetaCode}
            </Text>
            <TouchableOpacity
              onPress={() => {
                sendOTP();
              }}>
              <Text
                style={{
                  color: color.themeRed,

                  fontSize: 14,
                  fontFamily: 'Roboto_Bold',
                }}>
                {language.sendAgain}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{paddingBottom: 40}}>
            <TouchableOpacity
              onPress={() => {
                regHandler();
              }}
              style={[styles.button, {width: '90%', alignSelf: 'center'}]}>
              <Text style={styles.submitText}>{language.verify}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView> */}
      <ImageBackground
        style={{
          // flex: 1,
          // justifyContent: 'flex-end',
          width: '100%',
          height: 420,
        }}
        source={require('../assets/otpLogo1.png')}
        // resizeMode="contain"
      >
        {/* <View
          style={{
            width: '100%',
            height: 400,
            backgroundColor: 'red',
            // top: -70,
            top: 350,
          }}> */}
        <View
          style={{
            // marginTop: 40,
            // top: 20,
            // position: 'absolute',
            // top: 0,
            // left: 0,
            // right: 0,
            // bottom: 30,
            // top: -40,
            // backgroundColor: 'rgba(0,0,30,0.3)',
            width: '100%',
            height: 320,
            // flex: 1,
            // top: 320,
          }}
        />

        <KeyboardAvoidingView
          style={{
            backgroundColor: 'white',
            padding: 10,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}>
          <View
            style={{
              borderRadius: 50,
              height: 100,
              width: 100,
              marginTop: -50,
              alignSelf: 'center',
              backgroundColor: 'green',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: color.themeRed,
                borderRadius: 50,
                height: 100,
                width: 100,
                borderWidth: 10,
                borderColor: color.themeWhite,
              }}>
              <FA name="mobile-phone" size={50} color="#fff" />
            </View>
          </View>

          <View style={{paddingTop: 20, paddingHorizontal: 30}}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 16,
                paddingBottom: 15,
                fontFamily: 'Roboto_Bold',
              }}>
              {language.pleaseEnterTheVerificationCode}
            </Text>

            <Text
              style={{
                alignSelf: 'center',
                // paddingBottom: 15,
                textAlign: 'center',
                color: color.grey,
                fontFamily: 'Roboto-Regular',
                fontSize: 14,
              }}>
              {language.weHaveSendAVerificationCodeToYourRegisteredPhoneNumber}{' '}
            </Text>
          </View>

          <View style={{paddingHorizontal: 0, padding: 10}}>
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
          <View
            style={{
              flexDirection:
                selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
              padding: 10,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                paddingRight: 5,
                paddingLeft: 5,
                fontSize: 14,
                fontFamily: 'Roboto-Regular',
              }}>
              {language.didNotgetaCode}
            </Text>
            <TouchableOpacity
              onPress={() => {
                sendOTP();
              }}>
              <Text
                style={{
                  color: color.themeRed,

                  fontSize: 14,
                  fontFamily: 'Roboto_Bold',
                }}>
                {language.sendAgain}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{paddingBottom: 40}}>
            <TouchableOpacity
              onPress={() => {
                regHandler();
              }}
              style={[styles.button, {width: '90%', alignSelf: 'center'}]}>
              <Text style={styles.submitText}>{language.verify}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        {/* </View> */}
      </ImageBackground>
      {/* <View
        style={{
          // marginTop: 40,
          top: 20,
          // position: 'absolute',
          // top: 0,
          // left: 0,
          // right: 0,
          // bottom: 30,
          // top: -40,
          backgroundColor: 'rgba(0,0,30,0.3)',
        }}
      />

      <KeyboardAvoidingView
        style={{
          backgroundColor: 'white',
          // padding: 10,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
        }}>
        <View
          style={{
            borderRadius: 50,
            height: 100,
            width: 100,
            // marginTop: -50,
            alignSelf: 'center',
            backgroundColor: 'green',
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: color.themeRed,
              borderRadius: 50,
              height: 100,
              width: 100,
              borderWidth: 10,
              borderColor: color.themeWhite,
            }}>
            <FA name="mobile-phone" size={50} color="#fff" />
          </View>
        </View>

        <View style={{paddingTop: 20, paddingHorizontal: 30}}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 16,
              paddingBottom: 15,
              fontFamily: 'Roboto_Bold',
            }}>
            {language.pleaseEnterTheVerificationCode}
          </Text>

          <Text
            style={{
              alignSelf: 'center',
              // paddingBottom: 15,
              textAlign: 'center',
              color: color.grey,
              fontFamily: 'Roboto-Regular',
              fontSize: 14,
            }}>
            {language.weHaveSendAVerificationCodeToYourRegisteredPhoneNumber}{' '}
          </Text>
        </View>

        <View style={{paddingHorizontal: 0, padding: 10}}>
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
        <View
          style={{
            flexDirection:
              selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
            padding: 10,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              paddingRight: 5,
              fontSize: 14,
              fontFamily: 'Roboto-Regular',
            }}>
            {language.didNotgetaCode}
          </Text>
          <TouchableOpacity
            onPress={() => {
              sendOTP();
            }}>
            <Text
              style={{
                color: color.themeRed,

                fontSize: 14,
                fontFamily: 'Roboto_Bold',
              }}>
              {language.sendAgain}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{paddingBottom: 40}}>
          <TouchableOpacity
            onPress={() => {
              regHandler();
            }}
            style={[styles.button, {width: '90%', alignSelf: 'center'}]}>
            <Text style={styles.submitText}>{language.verify}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  codeFieldRoot: {marginTop: 20, marginHorizontal: 10},
  cell: {
    width: 45,
    height: 55,
    lineHeight: 38,
    fontSize: 32,
    borderWidth: 1.5,
    borderRadius: 10,
    color: '#1E1F20',
    backgroundColor: '#fff',
    borderColor: color.themeRed,
    textAlign: 'center',
    marginHorizontal: 2,
    textAlignVertical: 'center',
    fontFamily: 'Roboto-Regular',
  },
  focusCell: {
    borderColor: '#000',
    color: '#000',
  },
  button: {
    margin: 12,
    padding: 13,
    backgroundColor: color.themeRed,
    borderRadius: 40,
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 16,
    // fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Roboto-Medium',
  },
});

export default OTP;
