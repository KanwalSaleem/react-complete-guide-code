import React, {useContext, useState, useRef} from 'react';

import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  Platform,
  ToastAndroid,
} from 'react-native';

import {Checkbox} from 'react-native-paper';
import {
  LoginButton,
  AccessToken,
  LoginManager,
  Profile,
} from 'react-native-fbsdk-next';
import InstagramLogin from 'react-native-instagram-login';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
// import CheckBox from '@react-native-community/checkbox';

import ION from 'react-native-vector-icons/Ionicons';
import MON from 'react-native-vector-icons/MaterialIcons';
import color from '../common/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/core';
import Toast from 'react-native-simple-toast';

import services from '../common/service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/AuthContext';
import {
  appleAuthAndroid,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import FormData from 'form-data';

import jwt_decode from 'jwt-decode';
import {Colors} from 'react-native/Libraries/NewAppScreen';

function Login() {
  const [passVisible, setPassVisible] = useState(true);
  const navigation = useNavigation();
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {isLoggedIn, setIsLoggedIn, language, selectedLanguage, setIsSkip} =
    useContext(AuthContext);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const {userCred, setUserCred, passState, setPassState} =
    useContext(AuthContext);
  let instaRef = useRef(null);

  const checkSocialLogin = (type, resData) => {
    let data = new FormData();
    if (type == 'google') {
      data.append('social_type', 'google');
      data.append('go_id', resData.id);
    } else if (type == 'facebook') {
      data.append('social_type', 'facebook');
      data.append('fb_id', resData.userID);
    } else if (type == 'apple') {
      data.append('social_type', 'apple');
      data.append('apple_id', resData.email);
    } else if (type == 'instagram') {
      data.append('social_type', 'instagram');
      data.append('insta_id', resData.user_id);
    } else {
      Toast.show(language.somethingWentWrong, Toast.SHORT);
      return;
    }

    services
      .socialLogin(data)
      .then(async res => {
        const response = res.data;
        console.log(res.data.data);

        await AsyncStorage.setItem('loginStatus', 'loggedIn');
        await AsyncStorage.setItem('loginType', type);

        await AsyncStorage.setItem('userCredentials', JSON.stringify(response));
        setUserCred(JSON.stringify(response));
        setIsLoggedIn(true);
      })
      .catch(async err => {
        Toast.show(language.registerToContinue, Toast.SHORT);
        if (type == 'google') {
          await GoogleSignin.signOut();
          setPassState({
            name: resData.name,
            email: resData.email,
            userid: resData.id,
            type: 'google',
          });
          navigation.navigate('Signup', {
            social: true,
          });
        } else if (type == 'facebook') {
          console.log(resData);
          setPassState({
            name: resData.name,
            email: '',
            userid: resData.userID,
            type: 'facebook',
          });
          navigation.navigate('Signup', {
            social: true,
          });
        } else if (type == 'instagram') {
          setPassState({
            name: '',
            email: '',
            userid: resData.user_id,
            type: 'instagram',
          });

          navigation.navigate('Signup', {
            social: true,
          });
        } else if (type == 'apple') {
          setPassState({
            name: '',
            email: resData.email,
            userid: resData.email,
            type: 'apple',
          });
          navigation.navigate('Signup', {
            social: true,
          });
        }
      });
  };

  const googleLoginHandler = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo != null) {
        checkSocialLogin('google', userInfo.user);
      }
    } catch (error) {
      console.log('error');
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('You cancelled the sign in.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Google sign In operation is in process');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Play Services not available');
      } else {
        alert(
          'Something unknown went wrong with Google sign in. ' + error.message,
        );
      }
    }
  };

  const FacebookLoginHandler = () => {
    if (Platform.OS === 'android') {
      LoginManager.setLoginBehavior('web_only');
    }

    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      async function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          Profile.getCurrentProfile().then(async currentProfile => {
            // console.log(currentProfile.userID);
            checkSocialLogin('facebook', currentProfile);
          });
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  const loginHandler = async () => {
    // setIsLoading(true);
    if (phoneNumber.length != 0 && password != 0) {
      services
        .login('?mobile_no=' + phoneNumber + '&password=' + password)
        .then(async res => {
          const response = res.data;
          if (response.error == false) {
            try {
              // const value = await AsyncStorage.getItem('loginStatus');
              await AsyncStorage.setItem('loginStatus', 'loggedIn');
              await AsyncStorage.setItem(
                'userCredentials',
                JSON.stringify(response),
              );
              setUserCred(JSON.stringify(response));
              setIsLoggedIn(true);
            } catch (error) {
              console.log(error);
            }
          } else {
            Toast.show(language.somethingWentWrong, Toast.SHORT);
          }
        })
        .catch(err => {
          const error = err.response.data;
          if (error.error == true) {
            Toast.show(' ' + error.message, Toast.SHORT);
          } else {
            Toast.show(language.somethingWentWrong, Toast.SHORT);
          }
        });
    } else {
      Toast.show(language.allFieldsRequired, Toast.SHORT);
    }
  };

  const InstagramLoginHandler = () => {
    instaRef.show();
  };

  const doAppleLogin = async () => {
    if (appleAuthAndroid.isSupported) {
      try {
        appleAuthAndroid.configure({
          clientId: 'com.xionex.msaken',
          redirectUri: 'https://xionex.in/msaken/applelogin.php',
          scope: appleAuthAndroid.Scope.EMAIL,
          responseType: appleAuthAndroid.ResponseType.ALL,
        });

        const response = await appleAuthAndroid.signIn();

        if (response) {
          const code = response.code; // Present if selected ResponseType.ALL / ResponseType.CODE
          const id_token = response.id_token; // Present if selected ResponseType.ALL / ResponseType.ID_TOKEN

          let decoded = await jwt_decode(id_token);

          console.log('suresh' + decoded.email);

          checkSocialLogin('apple', {
            email: decoded.email,
          });
          // await AsyncStorage.setItem('loginStatus', 'loggedIn');
          // await AsyncStorage.setItem('loginType', 'apple');
          // setIsLoggedIn(true);
        }
      } catch (error) {
        if (error && error.message) {
          switch (error.message) {
            case appleAuthAndroid.Error.NOT_CONFIGURED:
              console.log('appleAuthAndroid not configured yet.');
              Toast.show(language.appleSigninDevError, Toast.SHORT);

              break;
            case appleAuthAndroid.Error.SIGNIN_FAILED:
              console.log('Apple signin failed.');
              Toast.show(language.appleSigninFailed, Toast.SHORT);

              break;
            case appleAuthAndroid.Error.SIGNIN_CANCELLED:
              console.log('User cancelled Apple signin.');
              Toast.show(language.appleSigninCancelled, Toast.SHORT);
              break;
            default:
              break;
          }
        }
      }
    } else {
      Toast.show(language.appleLoginNotSupportedInYourDevice, Toast.LONG);
    }
  };

  const setIgToken = async data => {
    console.log(data);
    // checkSocialLogin('instagram', data.user_id)
  };

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={color.themeRed} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        <View style={{flex: 1}}>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                width: '85%',
                flex: 1,
                // justifyContent: 'center',
                marginTop: 40,
                flexDirection: 'column',
              }}>
              <View style={styles.skipContainer}>
                <View style={styles.titleView}>
                  <Text style={styles.title}>{language.msaken}</Text>
                  <Text style={styles.subTitle}>{language.realEstate}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setIsSkip(true)}>
                  <Text style={styles.skipTitle}>{language.skip}</Text>
                </TouchableOpacity>
              </View>
              {/* <View>
                <Image
                  style={styles.userIcon}
                  source={require('../assets/user_pic1.png')}
                />
              </View> */}

              <View
                style={{
                  marginVertical: 20,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Medium',
                    fontSize: 20,
                    padding: 5,
                  }}>
                  {language.welcome}
                </Text>
                <Text
                  style={{
                    fontSize: 14,

                    fontFamily: 'Roboto-Regular',
                  }}>
                  {language.signinToContinue}
                </Text>
              </View>

              <View
                style={[
                  styles.searchSection,
                  selectedLanguage === 'arabic' && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <ION
                  style={styles.searchIcon}
                  name="call"
                  size={20}
                  color={color.themeRed}
                />
                <TextInput
                  keyboardType="phone-pad"
                  style={[
                    styles.input,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}
                  placeholder={language.phoneNumber}
                  placeholderTextColor={color.inputFontBlack}
                  onChangeText={text => {
                    setPhoneNumber(text);
                  }}
                  underlineColorAndroid="transparent"
                />
              </View>

              <View
                style={[
                  styles.searchSection,
                  selectedLanguage === 'arabic' && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <MON
                  style={styles.searchIcon}
                  name="lock"
                  size={20}
                  color={color.themeRed}
                />
                <TextInput
                  style={[
                    styles.input,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}
                  secureTextEntry={passVisible}
                  placeholder={language.password}
                  placeholderTextColor={color.inputFontBlack}
                  onChangeText={password => {
                    setPassword(password);
                  }}
                  underlineColorAndroid="transparent"
                />
                {passVisible ? (
                  <MON
                    style={styles.searchIcon}
                    name="visibility"
                    size={20}
                    onPress={() => {
                      setPassVisible(false);
                    }}
                    color={color.themeRed}
                  />
                ) : (
                  <MON
                    style={styles.searchIcon}
                    name="visibility-off"
                    size={20}
                    onPress={() => {
                      setPassVisible(true);
                    }}
                    color={color.themeRed}
                  />
                )}
              </View>

              {/* <View
                style={{
                  padding: 10,
                  flexDirection:
                    selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
                  alignItems: 'center',
                }}>
                <Checkbox
                  status={checked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked(!checked);
                  }}
                />
                <Text style={{fontFamily: 'Roboto-Regular'}}>
                  {language.keepMeSigningIn}
                </Text>
              </View> */}

              <View
                style={{
                  alignSelf: 'flex-end',
                  marginRight: 10,
                  marginBottom: 40,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ForgotPassword');
                  }}>
                  <Text
                    style={{
                      color: color.secondRed,
                      fontFamily: 'Roboto-Medium',
                      textAlign: 'center',

                      fontSize: 14,
                    }}>
                    {language.forgotPassword}
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  onPress={() => {
                    loginHandler();
                  }}
                  style={[styles.button, {width: '92%', alignSelf: 'center'}]}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={color.themeWhite} />
                  ) : (
                    <Text style={styles.submitText}>{language.signIn}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <InstagramLogin
            ref={ref => (instaRef = ref)}
            appId="230392432436807"
            appSecret="ad2b848254c73bb31f02bc7aea8e4975"
            redirectUrl="https://xionex.in/msaken"
            scopes={['user_profile']}
            onLoginSuccess={setIgToken}
            onLoginFailure={() => {
              console.log('failed');
            }}
          />

          <View
            style={{
              marginTop: 40,
              // flex: 0.25,
              backgroundColor: 'white',
              alignSelf: 'center',
              width: '100%',
              paddingBottom: 5,
              // justifyContent: 'flex-end',
            }}>
            <View
              style={
                {
                  // borderColor: 'red',
                  // borderTopWidth: 5,
                  // borderTopLeftRadius: 30,
                  // borderColor: 'red',
                  // borderWidth: 6,
                  // borderLeftWidth: 0.1,
                  // borderRightWidth: 0.1,
                  // borderBottomWidth: 0,
                  // borderTopLeftRadius: 60,
                  // borderTopRightRadius: 60,
                }
              }>
              <View
                style={{
                  width: '80%',
                  // paddingTop: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      borderBottomColor: color.inputFontBlack,
                      borderBottomWidth: 1,
                      flex: 1,
                    }}
                  />
                  <View style={{padding: 10, alignItems: 'center'}}>
                    <Text> {language.orSignInUsing}</Text>
                  </View>
                  <View
                    style={{
                      borderBottomColor: color.inputFontBlack,
                      borderBottomWidth: 1,
                      flex: 1,
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '40%',
                    alignContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity onPress={() => doAppleLogin()}>
                    <Image
                      style={styles.socialLogo}
                      source={require('../assets/apple.png')}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={googleLoginHandler}>
                    <Image
                      style={styles.socialLogo}
                      source={require('../assets/google.png')}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={FacebookLoginHandler}>
                    <Image
                      style={styles.socialLogo}
                      source={require('../assets/facebook.png')}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={InstagramLoginHandler}>
                    <Image
                      style={styles.socialLogo}
                      source={require('../assets/instagram.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection:
                      selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
                    alignSelf: 'center',
                    padding: 20,
                  }}>
                  <Text style={{fontFamily: 'Roboto-Regular', fontSize: 14}}>
                    {' '}
                    {language.dontHaveAnAccount}{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.replace('Signup');
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Bold',
                        color: color.secondRed,
                      }}>
                      {language.signUp}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: 'Roboto-Bold',
    color: color.themeRed,
  },
  subTitle: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    color: '#3B3B3B',
    letterSpacing: 2,
  },

  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  userIcon: {
    height: 95,
    width: 95,
    paddingBottom: 20,
    margin: 20,
    alignSelf: 'center',
  },

  button: {
    // margin: 12,
    padding: 10,
    backgroundColor: color.themeRed,
    borderRadius: 40,
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 18,

    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Roboto-Medium',
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    margin: 10,
    backgroundColor: color.inputBgGrey,
    paddingLeft: 10,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    borderRadius: 20,
    backgroundColor: color.inputBgGrey,
    color: '#424242',
    fontFamily: 'Roboto-Regular',
  },
  socialLogo: {
    height: 22,
    resizeMode: 'contain',
    width: 22,
    margin: 5,
  },
  skipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: color.inputFontBlack,
    textDecorationLine: 'underline',
  },
});

export default Login;
