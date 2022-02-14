import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useContext, useRef} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  Animated,
  View,
  TextInput,
  useWindowDimensions,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import InstagramLogin from 'react-native-instagram-login';

import {Checkbox} from 'react-native-paper';
import ION from 'react-native-vector-icons/Ionicons';
import MON from 'react-native-vector-icons/MaterialIcons';
import color from '../../common/colors';
import FormData from 'form-data';
import services from '../../common/service';
import Toast from 'react-native-simple-toast';
import jwt_decode from 'jwt-decode';

import {
  LoginButton,
  AccessToken,
  LoginManager,
  Profile,
} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../context/AuthContext';

import {
  appleAuthAndroid,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

function UserForm({role, social}) {
  const {
    passState,
    setPassState,
    tokenGotType,
    registrationType,
    setTokenGotType,
    setIsLoggedIn,
    language,
    selectedLanguage,
  } = useContext(AuthContext);

  // const [name, setName] = useState(
  //   passState == undefined
  //     ? ''
  //     : tokenGotType == registrationType
  //     ? passState.name
  //     : '',
  // )

  const [name, setName] = useState(passState?.name ? passState.name : '');
  const [email, setEmail] = useState(passState?.email ? passState.email : '');
  // const [email, setEmail] = useState(
  //   passState == undefined
  //     ? ''
  //     : tokenGotType == registrationType
  //     ? passState.email
  //     : '',
  // )
  const [socialType, setSocialType] = useState(
    passState == undefined ? '' : passState.type,
  );
  let instaRef = useRef(null);
  const setIgToken = async data => {
    // console.log(data.user_id);
    checkSocialLogin('instagram', data.user_id);
  };

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');

  // const [company, setCompany] = useState(
  //   passState == undefined
  //     ? ''
  //     : tokenGotType == registrationType
  //     ? passState.name
  //     : '',
  // )
  const [company, setCompany] = useState(passState?.name ? passState.name : '');

  const [cAddress, setcAddress] = useState('');

  const [checked, setChecked] = useState(true);

  const [passVisible, setPassVisible] = useState(true);
  const [cPassVisible, setCPassVisible] = useState(true);

  const navigation = useNavigation();

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePassword(password) {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    return passwordPattern.test(String(password));
  }

  const checkSocialLogin = (type, resData) => {
    console.log('social login');
    let data = new FormData();
    if (type == 'google') {
      data.append('social_type', 'google');
      data.append('go_id', resData.id);
    } else if (type == 'facebook') {
      data.append('social_type', 'facebook');
      data.append('fb_id', resData.userID);
    } else if (type == 'apple') {
      console.log('type apple');
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

        await AsyncStorage.setItem('loginStatus', 'loggedIn');
        await AsyncStorage.setItem('loginType', type);

        await AsyncStorage.setItem(
          'userCredentials',
          JSON.stringify(response.data.user),
        );
        setIsLoggedIn(true);
      })
      .catch(async err => {
        console.log('error');
        setTokenGotType(registrationType);
        if (type == 'google') {
          await GoogleSignin.signOut();
          setPassState({
            name: resData.name,
            email: resData.email,
            userid: resData.id,
            type: 'google',
          });
        } else if (type == 'facebook') {
          setPassState({
            name: resData.name,
            email: '',
            userid: resData.userID,
            type: 'facebook',
          });
        } else if (type == 'instagram') {
          setPassState({
            name: '',
            email: '',
            userid: resData.user_id,
            type: 'instagram',
          });
        } else if (type == 'apple') {
          console.log(resData.email + 'suresh');

          setPassState({
            name: '',
            email: resData.email,
            userid: resData.email,
            type: 'apple',
          });
        }
      });
  };

  const userRegHandler = () => {
    console.log('userHandler', password);
    let data = new FormData();
    let roles;
    switch (role) {
      case 'user':
        roles = 'buyer';
        break;
      case 'agent':
        roles = 'agent';
        break;
      case 'company':
        roles = 'owner';
        break;
      default:
        roles = 'buyer';
    }

    if (role == 'company') {
      data.append('full_name', company);
      data.append('company_add', cAddress);
    } else if (role == 'agent') {
      data.append('full_name', name);
      data.append('company_add', cAddress);
    } else {
      data.append('full_name', name);
    }
    data.append('role', roles);
    data.append('email', email);
    data.append('mobile_no', phoneNumber);
    data.append('password', password);

    if (socialType == 'google') {
      data.append('go_id', passState.userid);
      data.append('social_type', 'google');
    } else if (socialType == 'facebook') {
      data.append('fb_id', passState.userid);
      data.append('social_type', 'facebook');
    } else if (socialType == 'instagram') {
      data.append('insta_id', passState.userid);
      data.append('social_type', 'instagram');
    } else if (socialType == 'apple') {
      data.append('apple_id', passState.userid);
      data.append('social_type', 'apple');
    }

    if (
      (role == 'company' ? company.length != 0 : name.length != 0) &&
      email.length != 0 &&
      phoneNumber.length != 0 &&
      password.length != 0 &&
      // cPassword != 0 &&
      (role == 'company' ? cAddress.length != 0 : true)
    ) {
      if (checked) {
        if (validateEmail(email)) {
          if (validatePassword(password)) {
            services
              .getOTP('?mobile_no=' + phoneNumber)
              .then(res => {
                const response = res.data;
                if (response.status == true) {
                  // Toast.show('OTP : ' + response.data.otp, Toast.LONG);
                  navigation.navigate('OTP', {
                    formData: data,
                    otp: response.data.otp,
                    mobile: phoneNumber,
                  });
                } else {
                  Toast.show(language.somethingWentWrong, Toast.SHORT);
                }
              })
              .catch(err => {
                console.log(err.response.data);
              });
          } else {
            Toast.show(
              language.mustIncludeCharactersUpperCaseLetterAndNumber,
              Toast.LONG,
            );
          }
        } else {
          Toast.show(language.enterAValidEmail, Toast.SHORT);
        }
      } else {
        Toast.show(language.pleaseCheckPrivacyPolicy, Toast.SHORT);
      }
    } else {
      Toast.show(language.allFieldsRequired, Toast.SHORT);
    }
  };

  const userRegViaSocial = () => {
    let data = new FormData();
    let roles;
    switch (role) {
      case 'user':
        roles = 'buyer';
        break;
      case 'agent':
        roles = 'agent';
        break;
      case 'company':
        roles = 'owner';
        break;
      default:
        roles = 'buyer';
    }

    if (role == 'company') {
      data.append('full_name', company);
      data.append('company_add', cAddress);
    } else if (role == 'agent') {
      data.append('full_name', name);
      role != 'user' && data.append('company_add', cAddress);
    } else {
      data.append('full_name', name);
    }
    data.append('role', roles);
    data.append('email', email);
    data.append('mobile_no', phoneNumber);
    data.append('password', 'test');

    if (socialType == 'google') {
      data.append('go_id', passState.userid);
      data.append('social_type', 'google');
    } else if (socialType == 'facebook') {
      data.append('fb_id', passState.userid);
      data.append('social_type', 'facebook');
    } else if (socialType == 'instagram') {
      data.append('insta_id', passState.userid);
      data.append('social_type', 'instagram');
    } else if (socialType == 'apple') {
      data.append('apple_id', passState.userid);
      data.append('social_type', 'apple');
    }

    if (
      (role == 'company' ? company.length != 0 : name.length != 0) &&
      email.length != 0 &&
      phoneNumber.length != 0 &&
      // password.length != 0 &&
      // cPassword != 0 &&
      (role == 'company' ? cAddress.length != 0 : true)
    ) {
      if (checked) {
        if (validateEmail(email)) {
          // if (password == cPassword) {
          services
            .getOTP('?mobile_no=' + phoneNumber)
            .then(res => {
              const response = res.data;
              if (response.status == true) {
                // Toast.show('OTP : ' + response.data.otp, Toast.LONG);
                navigation.navigate('OTP', {
                  formData: data,
                  otp: response.data.otp,
                  mobile: phoneNumber,
                });
              } else {
                Toast.show(language.somethingWentWrong, Toast.SHORT);
              }
            })
            .catch(err => {
              console.log(err.response.data);
            });
          // } else {
          //   Toast.show('Entered passwords do not match', Toast.SHORT);
          // }
        } else {
          Toast.show(language.enterAValidEmail, Toast.SHORT);
        }
      } else {
        Toast.show(language.pleaseCheckPrivacyPolicy, Toast.SHORT);
      }
    } else {
      Toast.show(language.allFieldsRequired, Toast.SHORT);
    }
  };

  const googleLoginHandler = async () => {
    GoogleSignin.configure({
      androidClientId:
        '237354320338-d203qgacc6lnbt14j58vqn60liqfmdua.apps.googleusercontent.com',
    });

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
            console.log('fb profile');
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

  return (
    <View style={[styles.container, {flex: 1}]}>
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <ScrollView
          contentContainerStyle={{
            justifyContent: 'space-between',
            flexGrow: 1,
          }}>
          <KeyboardAvoidingView
          // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView contentContainerStyle={{marginHorizontal: 20}}>
              <View
                style={{
                  // flex: 0.85,
                  width: '100%',
                  justifyContent: 'flex-start',
                  alignContent: 'flex-start',
                  alignSelf: 'flex-start',
                }}>
                {role == 'company' ? (
                  <>
                    <View
                      style={[
                        styles.searchSection,
                        selectedLanguage === 'arabic' && {
                          flexDirection: 'row-reverse',
                        },
                      ]}>
                      <MON
                        style={styles.searchIcon}
                        name="work"
                        size={20}
                        color={color.themeRed}
                      />
                      <TextInput
                        keyboardType="default"
                        style={[
                          styles.input,
                          selectedLanguage === 'arabic' && {textAlign: 'right'},
                        ]}
                        placeholder={language.companyName}
                        defaultValue={company}
                        placeholderTextColor={color.inputFontBlack}
                        onChangeText={searchString => {
                          setCompany(searchString);
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
                      <ION
                        style={styles.searchIcon}
                        name="location-sharp"
                        size={20}
                        color={color.themeRed}
                      />
                      <TextInput
                        keyboardType="default"
                        style={[
                          styles.input,
                          selectedLanguage === 'arabic' && {textAlign: 'right'},
                        ]}
                        placeholder={language.companyAddress}
                        placeholderTextColor={color.inputFontBlack}
                        onChangeText={searchString => {
                          setcAddress(searchString);
                        }}
                        underlineColorAndroid="transparent"
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <View
                      style={[
                        styles.searchSection,
                        selectedLanguage === 'arabic' && {
                          flexDirection: 'row-reverse',
                        },
                      ]}>
                      <ION
                        style={styles.searchIcon}
                        name="person"
                        size={20}
                        color={color.themeRed}
                      />
                      <TextInput
                        keyboardType="default"
                        style={[
                          styles.input,
                          selectedLanguage === 'arabic' && {textAlign: 'right'},
                        ]}
                        placeholder={language.name}
                        placeholderTextColor={color.inputFontBlack}
                        defaultValue={name}
                        onChangeText={searchString => {
                          setName(searchString);
                        }}
                        underlineColorAndroid="transparent"
                      />
                    </View>
                    {role != 'user' && (
                      <View
                        style={[
                          styles.searchSection,
                          selectedLanguage === 'arabic' && {
                            flexDirection: 'row-reverse',
                          },
                        ]}>
                        <ION
                          style={styles.searchIcon}
                          name="location-sharp"
                          size={20}
                          color={color.themeRed}
                        />
                        <TextInput
                          keyboardType="default"
                          style={[
                            styles.input,
                            selectedLanguage === 'arabic' && {
                              textAlign: 'right',
                            },
                          ]}
                          placeholder={language.address}
                          placeholderTextColor={color.inputFontBlack}
                          onChangeText={searchString => {
                            setcAddress(searchString);
                          }}
                          underlineColorAndroid="transparent"
                        />
                      </View>
                    )}
                  </>
                )}

                <View
                  style={[
                    styles.searchSection,
                    selectedLanguage === 'arabic' && {
                      flexDirection: 'row-reverse',
                    },
                  ]}>
                  <MON
                    style={styles.searchIcon}
                    name="email"
                    size={20}
                    color={color.themeRed}
                  />
                  <TextInput
                    keyboardType="email-address"
                    style={[
                      styles.input,
                      selectedLanguage === 'arabic' && {textAlign: 'right'},
                    ]}
                    defaultValue={email}
                    placeholder={language.email}
                    placeholderTextColor={color.inputFontBlack}
                    onChangeText={searchString => {
                      setEmail(searchString);
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
                    onChangeText={searchString => {
                      setPhoneNumber(searchString);
                    }}
                    underlineColorAndroid="transparent"
                  />
                </View>
                {social === false && (
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
                      onChangeText={searchString => {
                        setPassword(searchString);
                      }}
                      underlineColorAndroid="transparent"
                    />
                    {/* {passVisible ? (
                      <MON
                        style={styles.searchIcon}
                        name="visibility"
                        size={20}
                        onPress={() => {
                          setPassVisible(false)
                        }}
                        color={color.themeRed}
                      />
                    ) : (
                      <MON
                        style={styles.searchIcon}
                        name="visibility-off"
                        size={20}
                        onPress={() => {
                          setPassVisible(true)
                        }}
                        color={color.themeRed}
                      />
                    )} */}
                  </View>
                )}
                {/* {social === false && (
                  <View style={styles.searchSection}>
                    <MON
                      style={styles.searchIcon}
                      name="lock"
                      size={20}
                      color={color.themeRed}
                    />
                    <TextInput
                      style={styles.input}
                      secureTextEntry={cPassVisible}
                      placeholder={language.confirmPassword}
                      placeholderTextColor={color.inputFontBlack}
                      onChangeText={searchString => {
                        setCPassword(searchString);
                      }}
                      underlineColorAndroid="transparent"
                    />
                   
                  </View>
                )} */}

                {/* <View
                  style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    flexDirection:
                      selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
                    alignItems: 'center',
                  }}>
                  <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    color={color.themeRed}
                    onPress={() => {
                      setChecked(!checked);
                    }}
                  />
                  <View
                    style={{
                      width: '90%',
                      flexDirection:
                        selectedLanguage === 'arabic'
                          ? 'row-reverse'
                          : 'column',
                    }}>
                    <Text style={{fontFamily: 'Roboto-Regular', fontSize: 13}}>
                      {language.iAccept}{' '}
                      <Text
                        style={{
                          color: color.themeRed,
                          fontFamily: 'Roboto-Regular',
                          fontSize: 13,
                        }}
                        onPress={() => {
                          navigation.navigate('termsConditions');
                        }}>
                        {language.termsConditions}{' '}
                      </Text>
                      <Text
                        style={{fontFamily: 'Roboto-Regular', fontSize: 13}}>
                        {language.andSymbol}{' '}
                      </Text>
                      <Text
                        style={{
                          color: color.themeRed,
                          fontFamily: 'Roboto-Regular',
                          fontSize: 13,
                        }}
                        onPress={() => {
                          navigation.navigate('privacyPolicy');
                        }}>
                        {language.privacyPolicy}
                      </Text>
                    </Text>
                  </View>
                </View> */}

                <View
                  style={{
                    paddingTop: 10,
                    paddingBottom: 10,

                    flexDirection:
                      selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
                    alignItems: 'center',
                  }}>
                  <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    color={color.themeRed}
                    onPress={() => {
                      setChecked(!checked);
                    }}
                  />
                  <View
                    style={{
                      width: '85%',

                      flexDirection:
                        selectedLanguage === 'arabic'
                          ? 'row-reverse'
                          : 'column',
                    }}>
                    <Text style={{fontFamily: 'Roboto-Regular', fontSize: 13}}>
                      {language.byClickingCreateAnAccount}{' '}
                      <Text
                        style={{
                          color: color.themeRed,
                          fontFamily: 'Roboto-Regular',
                          fontSize: 13,
                        }}
                        onPress={() => {
                          navigation.navigate('termsConditions');
                        }}>
                        {language.termsOfUse}{' '}
                      </Text>
                      <Text
                        style={{fontFamily: 'Roboto-Regular', fontSize: 13}}>
                        {language.andSymbol}{' '}
                      </Text>
                      <Text
                        style={{
                          color: color.themeRed,
                          fontFamily: 'Roboto-Regular',
                          fontSize: 13,
                        }}
                        onPress={() => {
                          navigation.navigate('privacyPolicy');
                        }}>
                        {language.privacyPolicy}
                      </Text>
                    </Text>
                  </View>
                </View>

                <View>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('otp');
                      // navigation.navigate('OTP');
                      social === true ? userRegViaSocial() : userRegHandler();
                    }}
                    style={[
                      styles.button,
                      {width: '90%', alignSelf: 'center'},
                    ]}>
                    <Text style={styles.submitText}>
                      {language.createAnAccount}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* socail login itmem */}

          <View
            style={{
              alignSelf: 'center',
              width: '100%',
              paddingBottom: 5,
              marginTop: 10,
            }}>
            {/* check for border 
                              borderWidth: 6,
                borderLeftWidth: 0.1,
                borderRightWidth: 0.1,
                borderBottomWidth: 0,
                borderTopLeftRadius: 60,
                borderTopRightRadius: 60,
              */}

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
              style={
                {
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
                  paddingTop: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      borderBottomColor: color.inputFontBlack,
                      borderBottomWidth: 1,
                      flex: 0.9,
                    }}
                  />
                  <View style={{padding: 10, flex: 1.2, alignItems: 'center'}}>
                    <Text style={{fontFamily: 'Roboto-Regular', fontSize: 14}}>
                      {language.orSignUpUsing}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderBottomColor: color.inputFontBlack,
                      borderBottomWidth: 1,
                      flex: 0.9,
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
                    paddingBottom: 10,
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity onPress={doAppleLogin}>
                    <Image
                      style={styles.socialLogo}
                      source={require('../../assets/apple.png')}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={googleLoginHandler}>
                    <Image
                      style={styles.socialLogo}
                      source={require('../../assets/google.png')}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={FacebookLoginHandler}>
                    <Image
                      style={styles.socialLogo}
                      source={require('../../assets/facebook.png')}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={InstagramLoginHandler}>
                    <Image
                      style={styles.socialLogo}
                      source={require('../../assets/instagram.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection:
                      selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
                    alignSelf: 'center',
                    padding: 10,
                  }}>
                  <Text style={{fontFamily: 'Roboto-Regular', fontSize: 14}}>
                    {' '}
                    {language.alreadyHaveAnAccount}{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.replace('Login');
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Roboto-Bold',
                        color: color.secondRed,
                      }}>
                      {language.signIn}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  button: {
    margin: 12,
    padding: 10,
    backgroundColor: color.themeRed,
    borderRadius: 40,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  submitText: {
    color: '#fff',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Roboto-Medium',
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    padding: 1,
    marginBottom: 10,
    backgroundColor: color.inputBgGrey,
    paddingLeft: 10,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 14,
    paddingRight: 10,
    paddingBottom: 14,
    paddingLeft: 5,
    fontFamily: 'Roboto-Regular',
    borderRadius: 20,
    backgroundColor: color.inputBgGrey,
    color: '#424242',
  },

  socialLogo: {
    height: 22,
    resizeMode: 'contain',
    width: 22,
    margin: 5,
  },
});

export default UserForm;
