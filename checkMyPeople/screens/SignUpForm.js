import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useContext,
} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from 'react-native'
import {Modal, Portal} from 'react-native-paper'
import Video from 'react-native-video'
import AsyncStorage from '@react-native-async-storage/async-storage'
import YoutubePlayer from 'react-native-youtube-iframe'

import AuthButton from '../components/AuthButton'

import Input from '../components/Input'
import {useForm} from 'react-hook-form'
import CustomProgressDialog from '../components/ProgressDialog'

import Title from '../components/Title'
import Colors from '../constants/Colors'

import Icon from 'react-native-vector-icons/MaterialIcons'
import TermsConditions from '../components/TermsConditions'

import {useCallback} from 'react'
import {AuthContext} from '../context/Auth'
import CaspioUrl from '../constants/CaspioUrl'
import tables from '../constants/CaspioTableNames'

const SignUpForm = (props) => {
  const titleName = [
    'Arch',
    'Alhaji',
    'Barrister',
    'Bishop',
    'Chief',
    'Dr',
    'Engr',
    'Hajia',
    'Honourable',
    'Imam',
    'Malam',
    'Malama',
    'Mr',
    'Mrs',
    'Ms',
    'Otumba',
    'Pastor',
    'Sheikh',
    'Ustaz',
  ]
  const {authToken, setUser} = useContext(AuthContext)
  const window = useWindowDimensions()
  const [loading, setLoading] = useState(false)
  const [states, SetStates] = useState([])
  const [localGovernment, setLocalGovernemt] = useState([])
  const [termAccepted, setTermsAccepted] = useState(false)
  const [regLoading, setRegLoading] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [playing, setPlaying] = useState(true)

  const player = useRef()
  const cityRef = useRef()
  const occupationRef = useRef()
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const confirmPasswordRef = useRef()
  const codeRef = useRef()

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    setError,
    watch,
    setValue,
  } = useForm()

  const city = register('city')
  const occupation = register('occupation')
  const firstName = register('firstName')
  const lastName = register('lastName')
  const email = register('email')
  const password = register('password')
  const confirmPassword = register('confirmPassword')
  // eslint-disable-next-line no-unused-vars
  const terms = register('terms', {
    required: 'Terms and Conditions are required to be Accepted',
  })

  const toggleSwitch = () =>
    setTermsAccepted((previousState) => {
      setValue('terms', !previousState)
      return !previousState
    })
  console.log(authToken)
  const onSubmit = (data) => {
    console.log('data', data)
    const guid = Math.random(Math.random() * Math.random())
    // props.navigation.navigate('submissionsuccess')
    setRegLoading(true)
    try {
      fetch(
        `${CaspioUrl}/rest/v2/tables/${tables.customerTable}/records?response=rows`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },

          body: JSON.stringify({
            Title: data.title,
            First_Name: data.firstName,
            Last_Name: data.lastName,
            Email: data.email,
            AccountStatus: 'Yes',
            Email_Verified: 'Yes',

            State: data.state,
            LocalGovernment: data.localGovernment,

            Password: data.password,
            City: data.city,
            GUID: guid,
            Occupation: data.occupation,
            role: 'Member',
          }),
        },
      )
        .then((res) => {
          setRegLoading(false)
          // console.log(res)

          return res.json()
        })
        .then(async (resData) => {
          console.log(resData)
          if (
            resData.Message ==
            "Cannot perform operation because duplicate or blank values are not allowed in field 'Email'."
          ) {
            setError(
              'email',
              {
                message: 'This Email Already exists',
              },
              {shouldFocus: true},
            )

            return
          } else if (resData.Message) {
            Alert.alert('', resData.Message)
            return
          }

          const parsedUser = JSON.stringify(resData.Result[0])
          await AsyncStorage.setItem('user', parsedUser)
          setUser(resData.Result[0])
        })
        .catch((e) => {
          console.log('er', e)
          Alert.alert('', e.Message)
        })

      // const formData = new FormData()
      // formData.append('email', data.email)
      // formData.append('firstname', data.firstName)
      // formData.append('lastname', data.lastName)
      // formData.append('guid', guid)
      // formData.append('title', data.title)
      // fetch('https://api.checkmypeople.com/app/welcome/', {
      //   method: 'POST',
      //   body: formData,
      //   'Content-Type': 'application/json',
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      //     console.log('welcome', data)

      //     // const parsedUser = JSON.stringify(resData.Result[0])
      //     // await AsyncStorage.setItem('user', parsedUser)
      //     // setUser(resData.Result[0])
      //   })
      //   .catch((e) => {
      //     // setLoading(false)
      //     Alert.alert('', e.message)
      //   })
    } catch (e) {
      Alert.alert('', e.message)
      console.log(e.message)
    }
  }

  const onStateChange = useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false)
      Alert.alert('video has finished playing!')
    }
  }, [])
  console.log(errors)

  const video = () => {
    return (
      <Portal>
        <Modal
          style={{alignItems: 'center'}}
          contentContainerStyle={{
            backgroundColor: 'black',
            width: '100%',
            // justifyContent: 'center',
            // alignItems: 'center',
            height: window.height > 600 ? 220 : '100%',
          }}
          visible={showVideo}
          onDismiss={() => setShowVideo(false)}>
          {loading && (
            // <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator color={Colors.primary} size={'large'} />
            // </View>
          )}

          {/* <Video
            source={{
              uri: 'https://r2---sn-npoe7nl6.googlevideo.com/videoplayback?expire=1639607967&ei=Pxq6YbCWAZKd1waWo6vICA&ip=2400%3Aadc1%3A414%3Ae800%3A6001%3Ac6b4%3A9c6d%3Ac762&id=o-AHnpFjssBjtDOoGe0f6AkRxQbbn6CoXh1H_cZGJcJ3p-&itag=22&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&ns=cfIaNnZTe2X7qIaoyjgrOnEG&cnr=14&ratebypass=yes&dur=105.952&lmt=1592916130421669&fexp=24001373,24007246&c=WEB&txp=6211222&n=UeLcR3EoT7_3ZZ9rV&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRgIhAOoWUg6_qMW4uJVmFGyI8CuDiRqKEi7FuEJY5_7Fp7M2AiEA77BIi6RJwL1kzhZLkwXLCGSJ6cgLbgJEj4Zt0b9F90Y%3D&cm2rm=sn-jtcxg-3ipk7l,sn-ug5onfvgaq-3ips7l,sn-hjuz7l&req_id=a5e3b3b0bcfea3ee&ipbypass=yes&redirect_counter=3&cms_redirect=yes&mh=NH&mm=34&mn=sn-npoe7nl6&ms=ltu&mt=1639586466&mv=m&mvi=2&pl=49&lsparams=ipbypass,mh,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRgIhAKZQddtgnH6Cd7SNTjYDug_FLfNQkbwYrDYc8jmKjWEnAiEAtP3Le_kN79PSsSVTSSy6KiZYshcgNPlfC1yVtAdoyEo%3D',
            }}
            ref={(ref) => {
              player.current = ref
            }}
            style={[
              styles.backgroundVideo,
              {display: loading ? 'none' : 'flex'},
            ]}
            controls={true}
            resizeMode={'cover'}
            bufferConfig={{
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000,
            }}
            onBuffer={(e) => console.log(e, 'heelo')}
            onVideoBuffer={(e) => console.log(e, 'video')}
            onLoad={() => setLoading(false)}
            onLoadStart={() => {
              setLoading(true)
            }}
            poster={`https://www.meditatecenter.com/howtomeditate/wp-content/uploads/2015/02/video-placeholder.jpg`}
            posterResizeMode="cover"
            // fullscreen={true}
            fullscreenOrientation="landscape"
          /> */}
          <YoutubePlayer
            height={'100%'}
            play={playing}
            contentScale="1.0"
            videoId={'d8YzdX7-2bs'}
            onChangeState={onStateChange}
            width={'100%'}
            onReady={() => setLoading(false)}
          />
        </Modal>
      </Portal>
    )
  }
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => props.navigation.goBack()}>
            <Icon name="close" size={25} />
          </TouchableOpacity>
        </>
      ),
      headerRight: () => (
        <>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => props.navigation.navigate('loginForm')}>
            <Text style={styles.login} allowFontScaling={false}>
              Login
            </Text>
          </TouchableOpacity>
        </>
      ),
    })
  }, [props.navigation])
  // console.log(
  //   resData.Result.map((item) => item.States).filter(
  //     (item, index, arr) => arr.indexOf(item) !== index,
  //   ),
  // ),

  useEffect(() => {
    fetch(
      `${CaspioUrl}/rest/v2/tables/${tables.state}/records?q.select=STATES&q.pageSize=1000`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )
      .then((res) => res.json())
      .then((resData) => {
        const responseStates = resData.Result.map((item) => item.STATES).filter(
          (item, pos, self) => self.indexOf(item) == pos,
        )
        SetStates(responseStates)
      })
      .catch((e) => console.log(e))
  }, [authToken])

  const getLocalGovernments = useCallback(() => {
    fetch(
      `${CaspioUrl}/rest/v2/tables/${
        tables.state
      }/records?q.select=LOCAL_GOVERNMENT_AREAS&q.where=STATES='${watch(
        'state',
      )}'&q.pageSize=1000`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )
      .then((res) => res.json())
      .then((resData) => {
        // console.log(resData)
        const governmentAreas = resData.Result.map(
          (item) => item.LOCAL_GOVERNMENT_AREAS,
        )
        // console.log(resData.Result.map((item) => item.LOCAL_GOVERNMENT_AREAS))
        // const responseStates = resData.Result.map((item) => item.STATES).filter(
        //   (item, pos, self) => self.indexOf(item) == pos,
        // )
        setLocalGovernemt(governmentAreas)
      })
      .catch((e) => console.log(e))
    console.log(watch('state'))
    console.log(watch('localGovernment'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('state'), authToken])

  useEffect(() => getLocalGovernments(), [getLocalGovernments])

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.screen}>
        {video()}
        <ScrollView contentContainerStyle={styles.mainScreen}>
          <CustomProgressDialog loading={regLoading} />
          <Title
            style={{marginBottom: 5}}
            text="Register to join a vibrant community of users seeking to ensure the identity of the people they interact with either in business, accommodation, services or employment."
          />
          <Title
            style={{marginTop: 0}}
            text="Also use the IVS to verify your National Identification Number for ease of integration with other Government applications like passport processing JAMB registration, SIM Card integration, driver’s license processing etc."
          />
          <View style={styles.clickContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowVideo(true)}
              style={styles.videoIcon}>
              <Icon name="play-arrow" size={40} color={Colors.primary} />
            </TouchableOpacity>
            <View style={{marginLeft: 20}}>
              <TouchableOpacity
                onPress={() => setShowVideo(true)}
                activeOpacity={0.8}>
                <Text style={styles.clickTitle} allowFontScaling={false}>
                  Click Here
                </Text>

                <Text style={styles.clickText} allowFontScaling={false}>
                  to view a registration video.
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Input
            control={control}
            name="title"
            picker={true}
            label="Title"
            pickerValue={titleName}
            rules={{required: 'Title is Required'}}
          />
          {errors.title && (
            <Text style={styles.errorText} allowFontScaling={false}>
              {errors.title.message}
            </Text>
          )}
          <Input
            style={styles.input}
            control={control}
            rules={{
              required: 'First Name is Required',
            }}
            errors={errors.firstName}
            name="firstName"
            placeholder="First Name"
            ref={(e) => {
              firstName.ref(e)
              firstNameRef.current = e
            }}
            onSubmitEditing={() => {
              lastNameRef.current.focus()
            }}
            blurOnSubmit={false}
            returnKeyType="next"
          />
          {errors.firstName && (
            <Text style={styles.errorText} allowFontScaling={false}>
              {errors.firstName.message}
            </Text>
          )}
          <Input
            style={styles.input}
            control={control}
            rules={{
              required: 'Last Name is Required',
            }}
            errors={errors.lastName}
            name="lastName"
            placeholder="Last Name"
            ref={(e) => {
              lastName.ref(e)
              lastNameRef.current = e
            }}
            onSubmitEditing={() => {
              emailRef.current.focus()
            }}
            blurOnSubmit={false}
            returnKeyType="next"
          />
          {errors.lastName && (
            <Text style={styles.errorText} allowFontScaling={false}>
              {errors.lastName.message}
            </Text>
          )}
          <Input
            style={styles.input}
            control={control}
            rules={{
              required: 'Email is Required',
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: 'Must be a valid Email',
              },
            }}
            errors={errors.email}
            name="email"
            placeholder="Email"
            ref={(e) => {
              email.ref(e)
              emailRef.current = e
            }}
            onSubmitEditing={() => {
              cityRef.current.focus()
            }}
            blurOnSubmit={false}
            returnKeyType="next"
            keyboardType="email-address"
          />
          {errors.email && (
            <Text style={styles.errorText} allowFontScaling={false}>
              {errors.email.message}
            </Text>
          )}
          <Input
            control={control}
            name="state"
            label="State of Residence"
            picker={true}
            pickerValue={states}
            rules={{required: 'State is Required'}}
          />
          {/* <View style={styles.fieldContainer}>
            <View style={styles.pickerContainer}>
              <Controller
                control={control}
                name="State Of Residence"
                // defaultValue={}

                render={({field: {value, onChange}}) => (
                  <Picker
                    style={fonts.title}
                    dropdownIconColor={Colors.primary}
                    selectedValue={value}
                    onValueChange={(e) => {
                      getLocalGovernments(value)
                      return onChange(e)
                    }}
                    mode="dropdown">
                    <Picker.Item
                      style={{color: Colors.grey}}
                      label="State of Residence"
                    />
                    {states.map((item, index) => {
                      return (
                        <Picker.Item
                          style={{color: Colors.grey}}
                          label={item}
                          value={item}
                          key={item}
                        />
                      )
                    })}
                  </Picker>
                )}
              />
            </View>
          </View> */}
          {errors.state && (
            <Text style={styles.errorText} allowFontScaling={false}>
              {errors.state.message}
            </Text>
          )}
          <Input
            rules={{required: 'Locat Government is Required'}}
            control={control}
            name="localGovernment"
            picker={true}
            label="Local Government"
            pickerValue={localGovernment}
          />
          {/* <View style={styles.fieldContainer}>
            <View style={styles.pickerContainer}>
              <Controller
                control={control}
                name={props.name}
                // defaultValue={}

                render={({field: {value, onChange}}) => (
                  <Picker
                    style={fonts.title}
                    dropdownIconColor={Colors.primary}
                    selectedValue={value}
                    onValueChange={onChange}
                    mode="dropdown">
                    <Picker.Item
                      style={{color: Colors.grey}}
                      label="Local Government"
                    />
                    {localGovernment.map((item, index) => {
                      return (
                        <Picker.Item
                          style={{color: Colors.grey}}
                          label={item}
                          value={item}
                          key={item}
                        />
                      )
                    })}
                  </Picker>
                )}
              />
            </View>
          </View> */}
          {errors.localGovernment && (
            <Text style={styles.errorText} allowFontScaling={false}>
              {errors.localGovernment.message}
            </Text>
          )}
          <Input
            style={styles.input}
            control={control}
            rules={{
              required: 'Residence is Required',
              minLength: 3,
            }}
            errors={errors.city}
            name="city"
            placeholder="City of Residence"
            ref={(e) => {
              city.ref(e)
              cityRef.current = e
            }}
            onSubmitEditing={() => {
              occupationRef.current.focus()
            }}
            blurOnSubmit={false}
            returnKeyType="next"
          />
          {errors.city && (
            <Text style={styles.errorText} allowFontScaling={false}>
              {errors.city.message}
            </Text>
          )}
          <Input
            style={styles.input}
            control={control}
            rules={{
              required: 'Occupation is Required',
              minLength: 3,
            }}
            errors={errors.occupation}
            name="occupation"
            placeholder="Present Occupation"
            ref={(e) => {
              occupation.ref(e)
              occupationRef.current = e
            }}
            onSubmitEditing={() => {
              passwordRef.current.focus()
            }}
            blurOnSubmit={false}
            returnKeyType="next"
          />
          {errors.occupation && (
            <Text style={styles.errorText} allowFontScaling={false}>
              {errors.occupation.message}
            </Text>
          )}
          <Input
            style={styles.input}
            control={control}
            name="password"
            placeholder="Password"
            rules={{
              required: 'Password is Required',
              minLength: {value: 6, message: 'Minimum 6 characters Requires'},
            }}
            errors={errors.password}
            ref={(e) => {
              password.ref(e)
              passwordRef.current = e
            }}
            onSubmitEditing={() => {
              confirmPasswordRef.current.focus()
            }}
            blurOnSubmit={false}
            showPassword={true}
            returnKeyType="next"
          />
          {errors.password && (
            <Text style={styles.errorText} allowFontScaling={false}>
              {errors.password.message}
            </Text>
          )}
          <Input
            style={styles.input}
            control={control}
            name="confirmPassword"
            placeholder="Confirm password"
            rules={{
              required: 'Confirm Password is Required',
              validate: {
                positive: (value) =>
                  value === watch('password') || 'The passwords do not match',
              },
            }}
            errors={errors.confirmPassword}
            ref={(e) => {
              confirmPassword.ref(e)
              confirmPasswordRef.current = e
            }}
            onSubmitEditing={() => {
              codeRef.current.focus()
            }}
            blurOnSubmit={false}
            showPassword={true}
            returnKeyType="next"
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText} allowFontScaling={false}>
              {errors.confirmPassword.message}
            </Text>
          )}

          {/* <Input
            style={styles.input}
            control={control}
            rules={{
              required: true,
              minLength: 3,
            }}
            errors={errors.code}
            name="code"
            placeholder="Enter code"
            ref={(e) => {
              code.ref(e)
              codeRef.current = e
            }}
            onSubmitEditing={() => {
              codeRef.current.focus()
            }}
            blurOnSubmit={false}
            returnKeyType="next"
            keyboardType="number-pad"
          /> */}

          <TermsConditions
            termsAccepted={termAccepted}
            toggleSwitch={toggleSwitch}>
            {errors.terms && (
              <Text style={styles.errorText} allowFontScaling={false}>
                {errors.terms.message}
              </Text>
            )}
          </TermsConditions>

          <AuthButton
            style={styles.buttonContainer}
            onPress={handleSubmit(onSubmit)}>
            Sign Up
          </AuthButton>

          <View style={styles.conditionContainer}>
            <Text style={styles.text} allowFontScaling={false}>
              Already a member ?
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => props.navigation.navigate('loginForm')}>
              <Text
                style={[styles.text, {color: Colors.primary}]}
                allowFontScaling={false}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    // alignItems: 'center',
  },
  mainScreen: {
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  conditionContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    marginHorizontal: 2,
  },

  logoImage: {
    width: '100%',
    height: 30,
  },
  clickContainer: {
    backgroundColor: 'rgba(76, 150, 214, 0.12)',
    width: '90%',
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  clickTitle: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'Inter-Bold',
    textDecorationLine: 'underline',
  },
  clickText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'Inter-Regular',
  },
  videoIcon: {
    backgroundColor: 'rgba(76, 150, 214, 0.5)',
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 30,
  },
  login: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'Inter-Regular',
  },
  errorText: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    color: Colors.common.errorColor,
  },
  backgroundVideo: {
    // position: 'absolute',

    zIndex: 1,
    // marginTop: 10,
    // borderRadius: 10,
    // left: 0,
    // bottom: 0,
    // right: 0,
    width: '100%',
    height: '100%',
    // borderWidth: 0.5,
  },
  pickerContainer: {
    width: '100%',
  },
  fieldContainer: {
    width: '90%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#F6F6F6',
    borderColor: '#E8E8E8',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default SignUpForm
