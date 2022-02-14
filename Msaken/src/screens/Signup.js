import React, {useState, useContext, useRef, useEffect} from 'react';

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
  useWindowDimensions,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import InstagramLogin from 'react-native-instagram-login';

import color from '../common/colors';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import UserForm from '../components/Registration/UserForm';
import Company from '../components/Registration/Company';
import {useNavigation} from '@react-navigation/native';
import FormData from 'form-data';
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
import {AuthContext} from '../context/AuthContext';
import services from '../common/service';
import colors from '../common/colors';
import {
  appleAuthAndroid,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import Toast from 'react-native-simple-toast';

function Signup({route, navigation}) {
  const {
    isLoggedIn,
    setIsLoggedIn,
    passState,
    setPassState,
    registrationType,
    setRegistrationType,
    language,
    setIsSkip,
  } = useContext(AuthContext);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  let instaRef = useRef(null);

  const [routes, setRoutes] = useState([
    {key: 'first', title: language.user},
    {key: 'second', title: language.companyAgent},
  ]);
  // const navigation = useNavigation();

  const renderTabBar = props => {
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <React.Fragment key={i}>
              {index == i ? (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 16,
                    backgroundColor: colors.themeRed,
                    borderRadius: 50,
                  }}
                  onPress={() => setIndex(i)}>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'Roboto-Medium',
                      fontSize: 15,
                    }}>
                    {route.title}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 16,
                    backgroundColor: color.inputBgGrey,
                    borderRadius: 50,
                  }}
                  onPress={() => setIndex(i)}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Roboto-Regular',
                      fontSize: 15,
                    }}>
                    {route.title}
                  </Text>
                </TouchableOpacity>
              )}
            </React.Fragment>
          );
        })}
      </View>
    );
  };

  const FirstRoute = () => (
    <UserForm
      role="user"
      data={route.params ? route.params.data : 'none'}
      social={route.params?.social === true ? true : false}
    />
  );
  const SecondRoute = () => (
    <Company
      role="user"
      data={route.params ? route.params.data : 'none'}
      social={route.params?.social === true ? true : false}
    />
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  useEffect(() => {
    if (index == 0) {
      setRegistrationType('user');
      console.log('user');
    } else if (index == 1) {
      setRegistrationType('company');
      console.log('company');
    }
  }, [index, setRegistrationType]);

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
      Toast.show('Something went wrong !', Toast.SHORT);
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

  // const googleLoginHandler = async () => {
  //   GoogleSignin.configure({
  //     androidClientId:
  //       '237354320338-d203qgacc6lnbt14j58vqn60liqfmdua.apps.googleusercontent.com',
  //   });

  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     if (userInfo != null) {
  //       checkSocialLogin('google', userInfo.user);
  //     }
  //   } catch (error) {
  //     console.log('error');
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       alert('You cancelled the sign in.');
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       alert('Google sign In operation is in process');
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       alert('Play Services not available');
  //     } else {
  //       alert(
  //         'Something unknown went wrong with Google sign in. ' + error.message,
  //       );
  //     }
  //   }
  // };

  // const FacebookLoginHandler = () => {
  //   if (Platform.OS === 'android') {
  //     LoginManager.setLoginBehavior('web_only');
  //   }

  //   LoginManager.logInWithPermissions(['public_profile', 'email']).then(
  //     async function (result) {
  //       if (result.isCancelled) {
  //         console.log('Login cancelled');
  //       } else {
  //         Profile.getCurrentProfile().then(async currentProfile => {
  //           console.log('fb profile');
  //           console.log(currentProfile.userID);
  //           checkSocialLogin('facebook', currentProfile);
  //         });
  //       }
  //     },
  //     function (error) {
  //       console.log('Login fail with error: ' + error);
  //     },
  //   );
  // };

  const InstagramLoginHandler = () => {
    instaRef.show();
  };

  // const doAppleLogin = async () => {
  //   if (appleAuthAndroid.isSupported) {
  //     try {
  //       appleAuthAndroid.configure({
  //         clientId: 'com.xionex.msaken',
  //         redirectUri: 'https://xionex.in/msaken/applelogin.php',
  //         scope: appleAuthAndroid.Scope.EMAIL,
  //         responseType: appleAuthAndroid.ResponseType.ALL,
  //       });

  //       const response = await appleAuthAndroid.signIn();
  //       console.log(response);
  //       if (response) {
  //         const code = response.code; // Present if selected ResponseType.ALL / ResponseType.CODE
  //         const id_token = response.id_token; // Present if selected ResponseType.ALL / ResponseType.ID_TOKEN

  //         let decoded = await jwt_decode(id_token);

  //         checkSocialLogin('apple', {
  //           email: decoded.email,
  //         });
  //         // await AsyncStorage.setItem('loginStatus', 'loggedIn');
  //         // await AsyncStorage.setItem('loginType', 'apple');
  //         // setIsLoggedIn(true);
  //       }
  //     } catch (error) {
  //       if (error && error.message) {
  //         switch (error.message) {
  //           case appleAuthAndroid.Error.NOT_CONFIGURED:
  //             console.log('appleAuthAndroid not configured yet.');
  //             Toast.show('Apple signin dev error', Toast.SHORT);

  //             break;
  //           case appleAuthAndroid.Error.SIGNIN_FAILED:
  //             console.log('Apple signin failed.');
  //             Toast.show('Apple signin failed', Toast.SHORT);

  //             break;
  //           case appleAuthAndroid.Error.SIGNIN_CANCELLED:
  //             console.log('User cancelled Apple signin.');
  //             Toast.show('Apple signin cancelled', Toast.SHORT);
  //             break;
  //           default:
  //             break;
  //         }
  //       }
  //     }
  //   } else {
  //     Toast.show('Apple login not supported in your device', Toast.LONG);
  //   }
  // };

  const setIgToken = async data => {
    // console.log(data.user_id);
    checkSocialLogin('instagram', data.user_id);
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: color.themeWhite}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={{flex: 1, paddingBottom: 10}}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        <View style={{flex: 1}}>
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
          <View
            style={{
              alignItems: 'center',
              padding: 5,
              paddingBottom: 15,
              width: '85%',
              alignSelf: 'center',
            }}>
            {route.params?.social === true ? (
              <Text
                style={{
                  // fontWeight: '600',
                  fontSize: 20,
                  padding: 5,
                  fontFamily: 'Roboto-Medium',
                }}>
                {language.createYourProfile}
              </Text>
            ) : (
              <Text
                style={{
                  // fontWeight: '600',
                  fontSize: 20,
                  padding: 5,
                  fontFamily: 'Roboto-Medium',
                }}>
                {language.createAccount}
              </Text>
            )}
            {route.params?.social === true ? (
              <></>
            ) : (
              <Text
                style={{
                  fontSize: 14,

                  fontFamily: 'Roboto-Regular',
                }}>
                {language.signupToGetStarted}
              </Text>
            )}
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
              flex: 1,
              paddingTop: 10,
              width: '100%',
              alignSelf: 'center',
            }}>
            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              renderTabBar={renderTabBar}
              onIndexChange={setIndex}
              initialLayout={{width: layout.width}}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  titleView: {},
  tabBar: {
    flexDirection: 'row',
    backgroundColor: color.inputBgGrey,
    borderRadius: 50,
    marginHorizontal: 20,
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
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
    backgroundColor: color.inputBgGrey,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
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
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 50,
  },
  skipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginHorizontal: 30,
  },
  skipTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: color.inputFontBlack,
    textDecorationLine: 'underline',
  },
});

export default Signup;
