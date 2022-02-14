import React, {useState, useEffect, useCallback, useRef} from 'react'
import {
  View,
  Alert,
  Platform,
  StyleSheet,
  Image,
  SafeAreaView,
  Text,
} from 'react-native'
// import {Button, Modal, Portal} from 'react-native-paper'
import {CommonActions, StackActions} from '@react-navigation/native'
// import DateTimePicker from '@react-native-community/datetimepicker'
import {useForm} from 'react-hook-form'
import PaymentView from '../../components/PaymentView'
import Title from '../../components/Title'
import Colors from '../../constants/Colors'
import AuthButton from '../../components/AuthButton'
import dayjs from 'dayjs'
import generateArrayOfYears from '../../constants/getYears'
import days from '../../constants/days'
import months from '../../constants/months'
import Input from '../../components/Input'
const years = generateArrayOfYears()

const DateOfBirth = ({navigation, route}) => {
  const {params} = route
  const [attempt, setAttempt] = useState(3)
  const [date, setDate] = useState('')
  // const [showDate, setShowDate] = useState(false)
  const [selectedItem, setSelectedItem] = useState()
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm()
  const [initiatePayment, setInitiatePayment] = useState(false)
  useEffect(() => {}, [])

  // const onDateChange = (e, selectedDate) => {
  //   console.log(dayjs(selectedDate).format('DD-MM-YYYY'))
  //   if (Platform.OS === 'ios') {
  //     try {
  //       // setShowDate(false)
  //       if (selectedDate) {
  //         setDate(selectedDate)
  //       }
  //     } catch (e) {
  //       console.log(e)
  //       setShowDate(false)
  //     }
  //   } else {
  //     try {
  //       setShowDate(false)
  //       if (selectedDate) {
  //         console.log(selectedDate)
  //         setDate(selectedDate)
  //         const itemToSelect = params.data.find(
  //           (item) =>
  //             item.birthdate === dayjs(selectedDate).format('DD-MM-YYYY'),
  //         )
  //         setAttempt((prev) => {
  //           return prev - 1
  //         })
  //         if (itemToSelect) {
  //           // console.log(itemToSelect)
  //           setSelectedItem(itemToSelect)

  //           setInitiatePayment(true)
  //         } else {
  //           if (attempt === 1) {
  //             Alert.alert('', 'Sorry we cannot authenticate your search')
  //             navigation.goBack()
  //           }
  //           // setShowDate(false)
  //           else if (attempt > 0) {
  //             Alert.alert(
  //               '',
  //               `Mismatch - You have ${attempt - 1} more tries left`,
  //             )
  //           }
  //         }
  //       }
  //     } catch (e) {
  //       console.log(e)
  //       setShowDate(false)
  //     }
  //   }
  // }

  // Method for IOS
  // const dateSelected = () => {
  //   setShowDate(false)
  //   if (date) {
  //     console.log(date)

  //     const itemToSelect = params.data.find(
  //       (item) => item.birthdate === dayjs(date).format('DD-MM-YYYY'),
  //     )
  //     setAttempt((prev) => {
  //       return prev - 1
  //     })
  //     if (itemToSelect) {
  //       // console.log(itemToSelect)
  //       setSelectedItem(itemToSelect)

  //       setInitiatePayment(true)
  //     } else {
  //       if (attempt === 1) {
  //         Alert.alert('', 'Sorry we cannot authenticate your search')
  //         navigation.goBack()
  //       }
  //       // setShowDate(false)
  //       else if (attempt > 0) {
  //         Alert.alert('', `Mismatch - You have ${attempt - 1} more tries left`)
  //       }
  //     }
  //   }
  // }
  const paymentSuccess = (e) => {
    console.log(e)
    if (e.data.event === 'successful') {
      setInitiatePayment(false)
      navigation.dispatch(
        CommonActions.reset({
          index: 2,
          routes: [
            {name: 'profile'},
            {
              name: 'verifynin',
              params: {replacedFromLicense: true},
            },
            {
              name: 'licenseVerification',
              params: {
                item: selectedItem,
                searchByPhone: true,
              },
            },
          ],
        }),
      )
      navigation.navigate('licenseVerification', {
        item: selectedItem,
        searchByPhone: true,
      })
    }
  }

  const onSubmit = ({day, month, year}) => {
    const itemToSelect = params.data.find(
      (item) => item.birthdate === `${day}-${month}-${year}`,
    )
    setAttempt((prev) => {
      return prev - 1
    })
    if (itemToSelect) {
      setSelectedItem(itemToSelect)

      setInitiatePayment(true)
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

    console.log(day, month, year)
  }

  if (initiatePayment) {
    return (
      <PaymentView
        amount={800}
        email={params.email}
        onCancel={() => setInitiatePayment(false)}
        onSuccess={paymentSuccess}
      />
    )
  }
  return (
    <View style={styles.screen}>
      <Title
        style={{
          alignSelf: 'center',
          marginTop: 20,
          fontFamily: 'Inter-Bold.ttf',
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

      <AuthButton style={{marginTop: 20}} onPress={handleSubmit(onSubmit)}>
        Confirm
      </AuthButton>

      <View style={styles.logo}>
        <Image
          source={require('../../assets/logo.png')}
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
    alignItems: 'center',
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
      backgroundColor: 'white',
      // flexDirection: 'row',
      width: '100%',
      // flexGrow:1,

      alignItems: 'center',
      justifyContent: 'center',
    }}>
    {showDate && (
      <DateTimePicker
        testID="dateTimePicker"
        value={date ? date : new Date()}
        mode={'date'}
        themeVariant="light"
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
