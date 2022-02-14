import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'react'
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  Alert,
} from 'react-native'

import {useForm} from 'react-hook-form'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AuthButton from '../components/AuthButton'
import Input from '../components/Input'
import TermsConditions from '../components/TermsConditions'
import ProgressDialog from '../components/ProgressDialog'
import {AuthContext} from '../context/Auth'

import Colors from '../constants/Colors'
import dayjs from 'dayjs'
import CaspioUrl from '../constants/CaspioUrl'
import tables from '../constants/CaspioTableNames'

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

const MyProfile = () => {
  const {user, authToken, setUser} = useContext(AuthContext)

  const abrtController = useRef(new AbortController())
  const governmentAbrtController = useRef(new AbortController())
  const [loading, setLoading] = useState(false)
  const [termAccepted, setTermsAccepted] = useState(false)
  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    reset,
    watch,

    setValue,
  } = useForm({
    defaultValues: {
      state: user.State,
      localGovernment: user.LocalGovernment,
      title: user.Title,
      firstName: user.First_Name,
      lastName: user.Last_Name,

      city: user.City,

      occupation: user.Occupation,
      email: user.Email,
    },
  })

  const cityRef = useRef()
  const occupationRef = useRef()
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const emailRef = useRef()

  const city = register('city')
  const occupation = register('occupation')
  const firstName = register('firstName')
  const lastName = register('lastName')
  const email = register('email')
  const terms = register('terms', {
    required: 'Terms and Conditions are required to be Accepted',
  })

  const [states, SetStates] = useState([])
  const [localGovernment, setLocalGovernemt] = useState([])

  const toggleSwitch = () =>
    setTermsAccepted((previousState) => {
      setValue('terms', !previousState)
      return !previousState
    })

  const onSubmit = (data) => {
    // console.log('data', data)
    setLoading(true)
    fetch(
      `${CaspioUrl}/rest/v2/tables/${tables.customerTable}/records?q.where=Email='${user.Email}'&response=rows`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          Title: data.title,
          First_Name: data.firstName,
          Last_Name: data.lastName,

          State: data.state,
          LocalGovernment: data.localGovernment,

          City: data.city,

          Occupation: data.occupation,
        }),
      },
    )
      .then((res) => res.json())
      .then(async (resData) => {
        setLoading(false)
        console.log(resData)
        const parsedUser = JSON.stringify(resData.Result[0])
        await AsyncStorage.setItem('user', parsedUser)

        setUser(resData.Result[0])
        Alert.alert('', 'Profile Successfully Updated')
      })
      .catch((e) => {
        setLoading(false)
        console.log(e)
      })
  }

  useEffect(() => {
    fetch(
      `${CaspioUrl}/rest/v2/tables/${tables.state}/records?q.select=STATES&q.pageSize=1000`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        signal: abrtController.current.signal,
      },
    )
      .then((res) => res.json())
      .then((resData) => {
        const responseStates = resData.Result.map((item) => item.STATES).filter(
          (item, pos, self) => self.indexOf(item) == pos,
        )

        SetStates(responseStates)
        setValue('state', user.State)
      })
      .catch((e) => console.log(e))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => abrtController.current.abort()
  }, [])

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
        signal: governmentAbrtController.current.signal,
      },
    )
      .then((res) => res.json())
      .then((resData) => {
        const governmentAreas = resData.Result.map(
          (item) => item.LOCAL_GOVERNMENT_AREAS,
        )

        setLocalGovernemt(governmentAreas)
        setValue('localGovernment', user.LocalGovernment)
      })
      .catch((e) => console.log(e))
    console.log(watch('state'))
    console.log(watch('localGovernment'))
  }, [watch('state'), authToken])

  useEffect(() => getLocalGovernments(), [getLocalGovernments])
  useEffect(() => {
    reset(
      {
        title: user.Title,
        firstName: user.First_Name,
        lastName: user.Last_Name,

        city: user.City,

        occupation: user.Occupation,
        email: user.Email,
        state: user.State,
        localGovernment: user.LocalGovernment,
      },
      {keepDefaultValues: true, keepValues: true},
    )
    console.log(user.Email)
  }, [reset, user])

  return (
    <KeyboardAvoidingView style={styles.screen}>
      <ScrollView
        contentContainerStyle={{alignItems: 'center', paddingTop: 10}}>
        <ProgressDialog loading={loading} />
        <View
          style={{
            backgroundColor: 'white',
            width: '90%',
            elevation: 5,
            borderRadius: 10,
            padding: 5,
          }}>
          <View style={styles.cardItem}>
            <Text style={styles.topFieldText} allowFontScaling={false}>
              Membership Number:
            </Text>
            <Text style={styles.topFieldText} allowFontScaling={false}>
              {user.CustomerID}
            </Text>
          </View>
          <View style={styles.cardItem}>
            <Text style={styles.topFieldText} allowFontScaling={false}>
              Date Joined:{' '}
            </Text>
            <Text style={styles.topFieldText} allowFontScaling={false}>
              {dayjs(user.Date_Added).format('DD-MM-YYYY')}
            </Text>
          </View>
          <View style={[styles.cardItem, {borderBottomWidth: 0}]}>
            <Text style={[styles.topFieldText]} allowFontScaling={false}>
              Account Balance:
            </Text>
            <Text style={[styles.topFieldText]} allowFontScaling={false}>
              {user.Account_Bal || 0}
            </Text>
          </View>
        </View>
        <Input
          control={control}
          name="title"
          picker={true}
          label="Title"
          pickerValue={titleName}
          rules={{required: 'Title is Required'}}
          defaultPickerValue={user.Title}
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
          control={control}
          name="state"
          label="State of Residence"
          picker={true}
          pickerValue={states}
          rules={{required: 'State is Required'}}
          defaultPickerValue={user.state}
        />
        {errors.state && (
          <Text style={styles.errorText} allowFontScaling={false}>
            {errors.state.message}
          </Text>
        )}
        <Input
          rules={{required: 'Local Government is Required'}}
          control={control}
          label="Local Government"
          name="localGovernment"
          picker={true}
          pickerValue={localGovernment}
        />
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
            emailRef.current.focus()
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
        {/* <Input
          style={styles.input}
          control={control}
          name="password"
          placeholder="Password"
          rules={{required: 'Password is Required', minLength: 6}}
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
        )} */}
        {/* <Input
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
            confirmPasswordRef.current.blur()
          }}
          blurOnSubmit={false}
          showPassword={true}
          returnKeyType="next"
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText} allowFontScaling={false}>
            {errors.confirmPassword.message}
          </Text>
        )} */}

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
        {/* </View> */}

        <AuthButton
          style={styles.buttonContainer}
          onPress={handleSubmit(onSubmit)}>
          Update
        </AuthButton>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: '#E5E5E5',

    // alignItems: 'center',
  },
  topFieldText: {
    alignSelf: 'flex-start',
    // marginLeft: 25,
    // marginVertical: 10,
    paddingVertical: 10,
    color: 'black',
    // width: '100%',
    fontSize: 16,

    fontWeight: 'bold',
  },

  buttonContainer: {
    marginVertical: 30,
    alignSelf: 'center',
  },
  profileContainer: {
    marginHorizontal: 20,
    // marginVertical: 50,
  },
  fieldContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    paddingVertical: 10,
    marginVertical: 5,
  },
  title: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Bold',
  },
  text: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    marginTop: 10,
  },
  errorText: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    color: Colors.common.errorColor,
  },
  cardItem: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5,
  },
})

export default MyProfile
