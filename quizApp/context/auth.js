import React, {createContext, useState, useEffect, useCallback} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FormData from 'form-data'
import {Alert, ToastAndroid, View} from 'react-native'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin'

import {LoginManager, Profile} from 'react-native-fbsdk-next'
import {set} from 'react-native-reanimated'

export const AuthContext = createContext({})

export const AuthProvider = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState('')
  const [userId, setUserId] = useState()
  const [isLoading, setLoading] = useState(false)
  const [facebookProfile, setFacebookProfile] = useState()
  const [userDetails, setUserDetails] = useState({})

  // const [userInfo, setUserInfo] = useState([])
  const [isSignedIn, setIsSignedIn] = useState('')
  const [currentUser, setCurrentUser] = useState([])
  const [user, setUser] = useState('')

  GoogleSignin.configure()
  //   {
  //   webClientId:
  //     '174038881582-a6qfrb7bpa2gse3s8btuhh65svof0rpk.apps.googleusercontent.com',
  //   scopes: ['email'],
  // }

  const facebookSignIn = () => {
    LoginManager.logInWithPermissions(['public_profile'])
      .then(
        function (result) {
          if (result.isCancelled) {
            console.log('Login cancelled')
          } else {
            console.log(
              'Login success with permissions: ' +
                result.grantedPermissions.toString(),
            )
          }
        },
        function (error) {
          console.log('Login fail with error: ' + error)
        },
      )
      .then(() =>
        Profile.getCurrentProfile().then(function (currentProfile) {
          if (currentProfile) {
            setFacebookProfile(currentProfile)

            const form = new FormData()
            // console.log(currentProfile, 'cuurentprofile')
            form.append('request_name', 'socialLogin')
            form.append('firstName', currentProfile.firstName)
            form.append('lastName', currentProfile.lastName)
            // form.append('email', currentProfile.useremail)
            form.append('userphone', '')

            form.append('socialid', currentProfile.userID)
            form.append('Social_site', 'Facebook')
            console.log(currentProfile.email, 'facebook email')

            fetch('https://www.worldmcqs.org/Admin/API/postdata.php', {
              method: 'post',
              body: form,
            })
              .then(response => response.json())
              .then(resData => {
                // const userDetailsJson = JSON.stringify(resData.User_Details)
                // AsyncStorage.setItem('User_Details', userDetailsJson)
                console.log(resData.User_Details, 'fb')
                // setUserDetails(resData.User_Details)
                const fbUserDetails = resData.User_Details
                setUserDetails({
                  User_id: fbUserDetails.User_id,
                  user_name: currentProfile.name,
                  profilepic: fbUserDetails.profilepic,
                  user_email: fbUserDetails.user_email,
                })

                const userDetailsJson = JSON.stringify({
                  User_id: fbUserDetails.User_id,
                  user_name: currentProfile.name,
                  profilepic: fbUserDetails.profilepic,
                  user_email: fbUserDetails.user_email,
                })
                AsyncStorage.setItem('User_Details', userDetailsJson)

                setUserId(fbUserDetails.User_id)
                setIsAuthenticated(true)
              })
              .catch(e => console.log(e))

            console.log(
              'The current logged user is: ' +
                currentProfile.name +
                '. His profile id is: ' +
                currentProfile.userID,
              currentProfile.email,
            )
          }
        }),
      )
  }

  const logout = async () => {
    try {
      if (GoogleSignin.isSignedIn) {
        SignOut()
      } else if (facebookProfile) {
        LoginManager.logOut()
      }

      // Profile.getCurrentProfile()
      //   .then((data) => {
      //     if (data) {
      //       LoginManager.logOut()
      //     }
      //   })
      //   .catch((e) => console.log(e))

      await AsyncStorage.removeItem('User_Details')
      setUserDetails(null)
      setIsAuthenticated(false)
    } catch (error) {
      Alert.alert(error.message)
    }
  }

  const login = async data => {
    setLoading(true)
    try {
      let base_url = 'https://www.worldmcqs.org/Admin/API/fetch.php'
      let uploadData = new FormData()
      uploadData.append('request_name', 'authentication')
      uploadData.append('email', data.email)
      uploadData.append('password', data.password)

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      })
      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message)
      } else {
        const user_details = responseData?.User_Details
        console.log(user_details)
        const is_authenticated = responseData?.isAuthenticated
        setUserDetails({
          User_id: user_details.User_id,
          user_name: user_details.user_name,
          profilepic: user_details.profilepic,
          user_email: user_details.user_email,
          user_phone: user_details.user_phone,
        })

        const userDetailsJson = JSON.stringify({
          User_id: user_details.User_id,
          user_name: user_details.name,
          profilepic: user_details.profilepic,
          user_email: user_details.user_email,
        })
        AsyncStorage.setItem('User_Details', userDetailsJson)
        setUserId(user_details?.User_id)

        if (is_authenticated == false) {
          ToastAndroid.show(
            'Invalid Email Address or Password',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          )
          // setLoading(false)
        } else {
          setIsAuthenticated(true)
          // setLoading(true)

          const UserDetails = JSON.stringify(user_details)
          AsyncStorage.setItem('User_Details', UserDetails)
        }
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }
  const fetchLogin = useCallback(async () => {
    try {
      const UserDetailsJson = await AsyncStorage.getItem('User_Details')
      const UserDetails = JSON.parse(UserDetailsJson)
      setUserDetails(UserDetails)
      setIsAuthenticated(UserDetails)
    } catch (error) {
      Alert.alert(error.message)
    }
  }, [])

  const signupApi = async data => {
    setLoading(true)

    const phoneNo = `${data.countryCode}${data.phone}`

    try {
      let base_url = 'https://www.worldmcqs.org/Admin/API/postdata.php'
      let uploadData = new FormData()
      uploadData.append('request_name', 'registration')
      uploadData.append('firstName', data.username)
      uploadData.append('email', data.email)
      uploadData.append('userpassword', data.password)
      uploadData.append('usertype', data.userType)
      uploadData.append('userphone', phoneNo)

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message)
      } else {
        const signUpUserDetails = responseData?.User_Details
        const signupUserDetails = JSON.stringify(signUpUserDetails)
        AsyncStorage.setItem('User_Details', signupUserDetails)
        setUserDetails(responseData.User_Details)
        console.log(responseData.User_Details)
        const is_registered = responseData?.isRegistered

        if (is_registered == false) {
          // Alert.alert(message)
          ToastAndroid.show(
            responseData.Message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          )
          setIsAuthenticated(false)
        } else {
          // console.log(is_registered)
          setIsAuthenticated(true)
        }
      }
    } catch (error) {
      Alert.alert(error.message)
    }
    setLoading(false)
  }

  const googleSignIn = async () => {
    const form = new FormData()

    setLoading(true)
    try {
      // await GoogleSignin.hasPlayServices()
      const UserInfo = await GoogleSignin.signIn()

      const userDetails = UserInfo.user
      // console.log(UserInfo.user, 'google')

      form.append('request_name', 'socialLogin')
      form.append('firstName', userDetails.givenName)
      form.append('lastName', userDetails.familyName)
      form.append('email', userDetails.email)
      form.append('userphone', '')

      form.append('socialid', userDetails.id)
      form.append('Social_site', 'Gmail')

      const response = await fetch(
        'https://www.worldmcqs.org/Admin/API/postdata.php',
        {
          method: 'post',
          body: form,
        },
      )

      const resData = await response.json()
      // console.log(resData.User_Details, 'googleApi')
      const googleUserDetails = resData.User_Details
      console.log(resData.User_Details)
      setUserId(resData.User_Details.User_id)
      setUserDetails({
        User_id: googleUserDetails.User_id,
        User_type: googleUserDetails.User_type,
        user_name: userDetails.givenName,
        user_phone: googleUserDetails.user_phone,
        profilepic: googleUserDetails.profilepic,
        user_email: googleUserDetails.user_email,
      })

      const userDetailsJson = JSON.stringify({
        User_id: googleUserDetails.User_id,
        User_type: googleUserDetails.User_type,
        user_name: userDetails.givenName,
        user_phone: googleUserDetails.user_phone,
        profilepic: googleUserDetails.profilepic,
        user_email: googleUserDetails.user_email,
      })
      AsyncStorage.setItem('User_Details', userDetailsJson)
      setIsAuthenticated(true)
    } catch (error) {
      console.log(error)
      Alert.alert(error.message)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        // Alert.alert('Play services not available or outdated')
      } else {
        // some other error happened
      }
    } finally {
      setLoading(false)
    }
  }

  const SignOut = async () => {
    try {
      await GoogleSignin.signOut()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isAuthenticated,
        fetchLogin,
        signupApi,
        userId,
        isLoading,
        googleSignIn,
        facebookSignIn,
        userDetails,
        setUserDetails,
      }}>
      {props.children}
    </AuthContext.Provider>
  )
}
