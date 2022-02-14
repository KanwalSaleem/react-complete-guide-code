import React, {useState, useEffect, useContext} from 'react'
import {
  View,
  Alert,
  Platform,
  StyleSheet,
  Image,
  SafeAreaView,
  Text,
} from 'react-native'

import {Modal, Portal, Button} from 'react-native-paper'
import {useForm} from 'react-hook-form'
import DateTimePicker from '@react-native-community/datetimepicker'
import Icon from 'react-native-vector-icons/MaterialIcons'
import CustomProgressDialog from '../components/ProgressDialog'
import Input from '../components/Input'

import Title from '../components/Title'
import Colors from '../constants/Colors'
import AuthButton from '../components/AuthButton'
import dayjs from 'dayjs'
import {AuthContext} from '../context/Auth'
import generateArrayOfYears from '../constants/getYears'
import days from '../constants/days'
import months from '../constants/months'
const years = generateArrayOfYears()

const DateOfBirth = ({navigation, route}) => {
  const {setUser, updateUserProfile, user} = useContext(AuthContext)
  const {params} = route

  const [attempt, setAttempt] = useState(3)
  const [date, setDate] = useState(new Date())
  const [showDate, setShowDate] = useState(false)

  const [selectedItem, setSelectedItem] = useState()
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm()

  // const [result, setResult] = useState([])
  // const [loading, setLoading] = useState(true)
  // const [initiatePayment, setInitiatePayment] = useState(false)

  //   const onDateChange = (value) => {
  //     // setSelectedDate(value)
  //     if (value) {
  //       const itemToSelect = result.find((item) => item.birthdate === value)
  //       setSelectedItem(itemToSelect)
  //       console.log('aslkdhkjashj')

  //       setInitiatePayment(true)
  //     }
  //   }

  const onDateChange = async (e, selectedDate) => {
    if (Platform.OS === 'ios') {
      try {
        // setShowDate(false)
        if (selectedDate) {
          setDate(selectedDate)
        }
      } catch (e) {
        console.log(e)
        setShowDate(false)
      }
    } else {
      try {
        setShowDate(false)
        if (selectedDate) {
          console.log(selectedDate)
          setDate(selectedDate)
          const itemToSelect = params.data.find(
            (item) =>
              item.birthdate === dayjs(selectedDate).format('DD-MM-YYYY'),
          )
          setAttempt((prev) => {
            return prev - 1
          })
          if (itemToSelect) {
            // console.log(itemToSelect)
            setSelectedItem(itemToSelect)
            setShowDate(false)
            await updateUserProfile({Account_Bal: user.Account_Bal - 800})
            await setUser((prev) => ({
              ...prev,
              Account_Bal: prev.Account_Bal - 800,
            }))
            // setInitiatePayment(true)

            navigation.replace('licenseVerification', {
              item: itemToSelect,
              phone: params.phone,
              searchByPhone: params.phone ? true : false,
            })
          } else {
            if (attempt === 1) {
              Alert.alert('', 'Sorry we cannot authenticate your search')
              navigation.goBack()
            }
            // setShowDate(false)
            else if (attempt > 0) {
              Alert.alert(
                '',
                `Mismatch - You have ${attempt - 1} more tries left`,
              )
            }
          }
        }
      } catch (e) {
        console.log(e)
        setShowDate(false)
      }
    }
  }

  const dateSelected = async () => {
    try {
      setShowDate(false)

      const itemToSelect = params.data.find(
        (item) => item.birthdate === dayjs(date).format('DD-MM-YYYY'),
      )
      setAttempt((prev) => {
        return prev - 1
      })
      if (itemToSelect) {
        // console.log(itemToSelect)
        setSelectedItem(itemToSelect)
        setShowDate(false)
        await updateUserProfile({Account_Bal: user.Account_Bal - 800})
        await setUser((prev) => ({
          ...prev,
          Account_Bal: prev.Account_Bal - 800,
        }))
        // setInitiatePayment(true)
        navigation.replace('licenseVerification', {
          item: itemToSelect,
          searchByPhone: true,
          phone: params.phone,
        })
      } else {
        if (attempt === 1) {
          Alert.alert('', 'Sorry we cannot authenticate your search')
          navigation.goBack()
        }
        // setShowDate(false)
        else if (attempt > 0) {
          Alert.alert('', `Mismatch - You have ${attempt - 1} more tries left`)
        }
      }
    } catch (e) {
      console.log(e)
      setShowDate(false)
    }
  }

  const onSubmit = async (data) => {
    console.log(params.data)
    console.log(data)
    const itemToSelect = params.data.find(
      (item) => item.birthdate === `${data.day}-${data.month}-${data.year}`,
    )

    setAttempt((prev) => {
      return prev - 1
    })

    console.log(itemToSelect)

    if (itemToSelect) {
      // console.log(itemToSelect)

      await updateUserProfile({Account_Bal: user.Account_Bal - 800})
      await setUser((prev) => ({
        ...prev,
        Account_Bal: prev.Account_Bal - 800,
      }))
      // setInitiatePayment(true)
      navigation.replace('licenseVerification', {
        item: itemToSelect,
        searchByPhone: true,
        phone: params.phone,
      })
    } else {
      if (attempt === 1) {
        Alert.alert('', 'Sorry we cannot authenticate your search')
        navigation.goBack()
      }
      // setShowDate(false)
      else if (attempt > 0) {
        Alert.alert('', `Mismatch - You have ${attempt - 1} more tries left`)
      }
    }
  }

  return (
    <View style={styles.screen}>
      {/* <CustomProgressDialog loading={loading} /> */}
      <Title
        style={{
          alignSelf: 'center',
          marginTop: 20,
        }}
        text={`Confirm Date of Birth`}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.fieldContainer}>
          <Input
            picker
            pickerValue={days}
            label="Day"
            control={control}
            name="day"
            rules={{required: 'Select Day'}}
          />
          <Text style={styles.errorText}>
            {errors.day ? errors.day.message : ''}
          </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Input
            picker
            pickerValue={months}
            label="Month"
            control={control}
            name="month"
            rules={{required: 'Select Month'}}
          />

          <Text style={styles.errorText}>
            {errors.month ? errors.month.message : ''}
          </Text>
        </View>
        <View style={styles.fieldContainer}>
          <Input
            picker
            pickerValue={years}
            label="Year"
            control={control}
            name="year"
            rules={{required: 'Select Year'}}
          />
          <Text style={styles.errorText}>
            {errors.year ? errors.year.message : ''}
          </Text>
        </View>
      </View>
      <AuthButton
        style={{marginTop: 20, alignSelf: 'center'}}
        onPress={handleSubmit(onSubmit)}>
        Confirm
      </AuthButton>

      <View style={styles.logo}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logoImage}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: 10,
  },
  logo: {
    alignSelf: 'center',

    width: '75%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 50,
    marginHorizontal: 20,
  },
  logoImage: {
    width: '100%',
    height: 30,
    marginTop: 30,
  },
  errorText: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    color: Colors.common.errorColor,
  },
  fieldContainer: {
    width: '33%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

export default DateOfBirth

{
  /* <Portal>
<Modal
  animationType="slide"
  // transparent={true}
  visible={showDate}
  dismissable={true}
  onDismiss={() => setShowDate(false)}
  contentContainerStyle={{width: '100%'}}>
  <SafeAreaView
    style={{
      // flex: 1,
      display: showDate ? 'flex' : 'none',
      // flexDirection: 'row',
      width: '100%',
      // flexGrow:1,
      backgroundColor: 'white',
      alignItems: 'flex-start',
      justifyContent: 'center',
    }}>
    {showDate && (
      <DateTimePicker
        testID="dateTimePicker"
        value={date ? date : new Date()}
        mode={'date'}
        textColor="white"
        is24Hour={true}
        display={Platform.OS === 'android' ? 'default' : 'inline'}
        onChange={onDateChange}
        shouldRasterizeIOS={true}
        style={{backgroundColor: 'white', width: '100%'}}
      />
    )}
    {Platform.OS === 'ios' && (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignSelf: 'flex-end',
          marginBottom: 10,
        }}>
        <Button mode="text" onPress={() => setShowDate(false)}>
          Cancel
        </Button>
        <Button mode="text" onPress={dateSelected}>
          OK
        </Button>
      </View>
    )}
  </SafeAreaView>
</Modal>
</Portal> */
}
