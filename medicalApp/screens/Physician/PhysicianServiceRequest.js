import React, {useState, useCallback} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  FlatList,
} from 'react-native'

import Colors from '../../constants/Colors'

import {useFocusEffect} from '@react-navigation/native'
import FeedBack from '../../components/feedBack'
import AuthButton from '../../components/AuthButton'
import {useSelector} from 'react-redux'
import OneSignal from 'react-native-onesignal'

import {ActivityIndicator, Modal, Portal} from 'react-native-paper'
import {APIURL} from '../../constants/url'
import BottomBar from '../../components/BottomBar'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import GobackHeader from '../../components/Physician/GobackHeader';

const PhysicianServiceRequest = ({navigation, route}) => {
  console.log(route.params, 'route')
  // const navigation = useNavigation()
  const [acceptLoading, setAcceptLoading] = useState(false)
  const token = useSelector((state) => state.auth.token)
  const [reject, setReject] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [patientId, setPatientId] = useState('')
  const [accept, setAccept] = useState(false)
  const [itemId, setItemId] = useState()
  const [services, setServices] = useState([])
  const [callLoading, setCallLoading] = useState(false)
  const [rejectLoading, setRejectLoading] = useState(false)

  const getServiceRequests = useCallback(async () => {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)

    var requestOptions = {
      method: 'POST',
      headers,

      redirect: 'follow',
    }

    try {
      const response = await fetch(
        `${APIURL}/api/physician/service-request`,
        requestOptions,
      )
      // Alert.alert('Service Requests')
      const resData = await response.json()

      if (!response.ok) {
        console.log(response)
      }
      console.log(resData)
      // console.log(resData.data[0])
      if (resData.success) {
        setServices(resData.data)
      }
      if (!resData.success) {
        Alert.alert('Unsuccessful', resData.message)
        return
      }
    } catch (e) {
      console.log(e)
    }
  }, [token])

  const acceptService = async (id) => {
    const formData = new FormData()
    formData.append('request_id', id)
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)
    setAcceptLoading(true)
    try {
      const response = await fetch(`${APIURL}/api/physician/request-accept`, {
        method: 'POST',
        body: formData,
        headers,
        redirect: 'follow',
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message)
      }
      // console.log(resData)
      if (!resData.success) {
        // throw new Error(resData.message)
        console.log(resData)
        Alert.alert('unsuccessful', resData.message)
        return
      }
      setPatientId(resData.data.patient_id)

      setAccept(true)
      console.log(resData)
    } catch (e) {
      alert('Error', e.message)
    }
    setAcceptLoading(false)
  }

  const rejectService = async () => {
    console.clear()
    const formData = new FormData()
    formData.append('request_id', itemId)
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)
    setRejectLoading(true)
    try {
      const response = await fetch(`${APIURL}/api/physician/request-reject`, {
        method: 'POST',
        headers,
        body: formData,
        redirect: 'follow',
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message)
      }
      if (!resData.success) {
        // throw new Error(resData.message)
        console.log(resData)
        return Alert.alert('unsuccessful', resData.message)
      }
      console.log(resData)

      setReject(false)
      setServices((prev) => prev.filter((item) => item.id !== resData.data.id))
      setItemId('')

      // console.log(resData)
    } catch (e) {
      alert('Error', e.message)
    }
    setRejectLoading(false)
  }

  const connectCall = async () => {
    const formData = new FormData()
    formData.append('request_id', itemId)
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)
    setCallLoading(true)
    try {
      const response = await fetch(`${APIURL}/api/physician/request-call`, {
        method: 'POST',
        headers,
        body: formData,
        redirect: 'follow',
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message)
      }
      if (resData.success) {
        const form = new FormData()
        form.append('userId', patientId)
        const response = await fetch(
          `https://fabent.co.in/public/api/agora/token`,
          {
            method: 'POST',
            headers,
            body: form,
          },
        )
        console.log(response)
        const tokenData = await response.json()
        console.log(tokenData)
        if (!response.ok || !tokenData.success) {
          console.log(tokenData)
          // throw new Error(tokenData.message)
        }

        console.log(tokenData, 'sasa')
        setCallLoading(false)
        setAccept(false)
        const stringId = JSON.stringify(itemId)
        await AsyncStorage.setItem('itemId', stringId)
        // navigation.navigate('call', {
        //   id: itemId,
        //   patientId: resData.data.patient_id,
        // })
        navigation.navigate('call', {
          channel: tokenData.data.channel_name,
          token: tokenData.data.token,
          patientId: patientId,
          id: itemId,
        })
      }
    } catch (e) {
      Alert.alert('Error', e.message)
    }
    setCallLoading(false)
  }

  OneSignal.setNotificationWillShowInForegroundHandler(
    (notificationReceivedEvent) => {
      console.log(
        'OneSignal: notification will show in foreground:',
        notificationReceivedEvent,
      )

      let notification = notificationReceivedEvent.getNotification()
      console.log('notification: ', notification)
      const data = notification.additionalData
      console.log('additionalData: ', data)
      getServiceRequests()
      //Silence notification by calling complete() with no argument
      notificationReceivedEvent.complete(notification)
    },
  )
  OneSignal.setNotificationOpenedHandler((openedEvent) => {
    console.log('OneSignal: notification opened:', openedEvent)
    const {action, notification} = openedEvent
  })

  useFocusEffect(
    useCallback(() => {
      getServiceRequests()
    }, [getServiceRequests]),
  )

  const updateRejectReason = (text) => {
    setRejectReason(text)
  }

  const Reject = () => {
    return (
      <Portal>
        <Modal
          visible={reject}
          onDismiss={() => setReject(false)}
          contentContainerStyle={styles.modalContainer}>
          <View style={styles.textView}>
            <Text style={styles.modalText}>
              Are you sure you want to reject service request
            </Text>
          </View>
          {/* <View style={styles.fieldContainer}>
            <TextInput
              name="rejectionReason"
              placeholder="Rejection Reason"
              value={rejectReason}
              onChangeText={updateRejectReason}
            />
          </View> */}

          <View style={{width: '80%', marginBottom: 40}}>
            {rejectLoading ? (
              <ActivityIndicator
                color={Colors.primary}
                style={{marginTop: 30}}
              />
            ) : (
              <AuthButton onPress={() => rejectService()}>Submit</AuthButton>
            )}
          </View>
        </Modal>
      </Portal>
    )
  }

  return (
    <>
      {Reject()}
      <FeedBack
        onPress={connectCall}
        visible={accept}
        text="We will connect you with the patient in 20 Sec"
        setVisible={setAccept}
        callLoading={callLoading}
      />
      <FlatList
        contentContainerStyle={{flexGrow: 1, backgroundColor: 'black'}}
        ListEmptyComponent={
          <View
            style={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'black',
              // flexDirection: 'row',
            }}>
            <Text
              style={{color: '#fff', fontFamily: 'Roboto-Bold', fontSize: 28}}>
              No Service Request
            </Text>
          </View>
        }
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={styles.serviceContainer}
              onPress={() => {
                setItemId(item.id)
              }}
              activeOpacity={0.6}>
              <View>
                <View style={styles.titleContainer}>
                  <Image
                    source={{
                      uri: `${APIURL}/storage/uploads/${item.service.icon}`,
                    }}
                    style={styles.image}
                  />
                  <Text style={styles.serviceTitle}>{item.service.title}</Text>
                </View>

                <View style={{display: item.id === itemId ? 'flex' : 'none'}}>
                  <View style={styles.symptomsContainer}>
                    <Text style={styles.symptomsTitle}>Symptoms</Text>
                    <Text style={styles.symptomsText}>{item.symptomps}</Text>
                  </View>
                  <View style={styles.symptomsContainer}>
                    <Text style={styles.symptomsTitle}>Patient Note</Text>
                    <Text style={styles.symptomsText}>{item.patient_note}</Text>
                  </View>

                  <View style={styles.buttonConatiner}>
                    <View style={[styles.buttonView, {left: -10}]}>
                      {acceptLoading ? (
                        <ActivityIndicator color={Colors.primary} />
                      ) : (
                        <AuthButton onPress={acceptService.bind(this, item.id)}>
                          Accept
                        </AuthButton>
                      )}
                    </View>
                    <View style={[styles.buttonView, {left: -40}]}>
                      <AuthButton
                        style={{backgroundColor: '#444444'}}
                        onPress={() => setReject(true)}>
                        Reject
                      </AuthButton>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    // flex: 1,
    // paddingVertical: 20,
  },

  noServiceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  noServiceTiltle: {
    color: Colors.backgroundColor,
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 26,
  },
  serviceMainContainer: {
    paddingBottom: 40,
  },
  serviceContainer: {
    backgroundColor: '#232b2b',
    padding: 10,
    margin: 8,
    borderRadius: 10,
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: '20%',
    height: 50,
  },
  serviceTitle: {
    marginLeft: 20,
    color: Colors.backgroundColor,
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
  },
  symptomsContainer: {
    marginTop: 20,
  },
  symptomsTitle: {
    color: Colors.backgroundColor,
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
  },
  symptomsText: {
    marginTop: 5,
    color: Colors.backgroundColor,
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
  },
  buttonConatiner: {
    marginTop: 10,
    flexDirection: 'row',
  },
  buttonView: {
    width: '57%',
  },
  modalContainer: {
    marginHorizontal: 10,
    // paddingBottom: 20,
    // height: 100,
    alignItems: 'center',
    paddingVertical: 40,
    paddingBottom: 30,
    borderRadius: 20,
    marginTop: 30,
    backgroundColor: 'white',
    // marginVertical: 10,
    // paddingHorizontal: 30,
  },

  textView: {
    width: '80%',
    marginVertical: 10,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
  },
  fieldContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: 'grey',
    marginBottom: 20,
  },
})
export default PhysicianServiceRequest
