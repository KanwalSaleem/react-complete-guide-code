import React, {useState, useCallback} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native'

import Colors from '../../constants/Colors'

import {useFocusEffect} from '@react-navigation/native'

import {useSelector} from 'react-redux'

import {APIURL} from '../../constants/url'
import OneSignal from 'react-native-onesignal'

const ServiceRequest = ({navigation}) => {
  const token = useSelector((state) => state.auth.token)

  const [services, setServices] = useState([])

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
        `${APIURL}/api/care-giver/service-request`,
        requestOptions,
      )
      const resData = await response.json()

      console.log(resData)
      if (!response.ok) {
        throw new Error(resData.message)
      }
      // if (!resData.success) {
      //   throw new Error(resData.message)
      // }
      if (resData.success) {
        console.log(resData.data[0])
        setServices(resData.data)
      }
    } catch (e) {
      alert('Error', e)
      console.log(e)
    }
  }, [token])
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
      notificationReceivedEvent.complete()
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

  return (
    <FlatList
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: Colors.black,
      }}
      data={services}
      ListEmptyComponent={
        <View style={styles.noServiceContainer}>
          <Text style={styles.noServiceTiltle}>No Service Request</Text>
        </View>
      }
      keyExtractor={(item, index) => item.id}
      renderItem={({item}) => {
        return (
          <TouchableOpacity
            style={styles.serviceContainer}
            onPress={() => {
              navigation.navigate('serviceDetail', {
                id: item.id,
              })
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
            </View>
          </TouchableOpacity>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: Colors.black,
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
    width: 50,
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
export default ServiceRequest
