import React, {useState} from 'react'
import {Alert, BackHandler} from 'react-native'
import MapView from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

import TripModal from '../../components/Caregiver/TripModal'
import CancelTripModal from '../../components/Caregiver/CancelTripModal'
import OneSignal from 'react-native-onesignal'
import {APIURL} from '../../constants/url'
import {useSelector} from 'react-redux'
import {useFocusEffect} from '@react-navigation/native'
import {setItem} from '../../store/actions/careGiver'

const Map = ({route, navigation}) => {
  console.log('map')

  const [tripStarted, setTripStarted] = useState(false)
  const [visible, setVisible] = useState(true)
  const [loading, setLoading] = useState(false)
  const [cancelVisible, setCancelVisible] = useState(false)
  const [enableTrip, setEnableTrip] = useState(false)
  const [trip, setTrip] = useState()
  const token = useSelector((state) => state.auth.token)
  const location = useSelector((state) => state.location)
  const careGiverItem = useSelector((state) => state.careGiver)

  const origin = {latitude: location.latitude, longitude: location.longitude}
  const destination = {
    latitude: route.params.service
      ? parseFloat(route.params.service.latitude)
      : 37.42305396683122,
    longitude: route.params.service
      ? parseFloat(route.params.service.longitude)
      : -122.0875014718816,
  }
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCgSOrjZImgZJzMMbGXvbV8S36Tv4A_2us'

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

      setEnableTrip(true)
      // dispatch(setItem(route.params.service.id, 'enableTrip'))

      // getServiceRequests()
      //Silence notification by calling complete() with no argument
      notificationReceivedEvent.complete(notification)
    },
  )
  OneSignal.setNotificationOpenedHandler((openedEvent) => {
    console.log('OneSignal: notification opened:', openedEvent)
    const {action, notification} = openedEvent
    navigation.navigate('map')
    setEnableTrip(true)
    // dispatch(setItem(route.params.service.id, 'enableTrip'))
  })

  const startTrip = async () => {
    const formData = new FormData()
    formData.append('request_id', route.params.service.id)
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)
    setLoading(true)
    try {
      const response = await fetch(`${APIURL}/api/care-giver/start-trip-otp`, {
        method: 'POST',
        headers,
        body: formData,
        redirect: 'follow',
      })
      const resData = await response.json()
      console.log(resData)
      if (!response.ok) {
        console.log(resData)
        throw new Error(resData)
      }
      if (!resData.success) {
        Alert.alert('Unsuccessful', resData.message, [
          {onPress: () => navigation.navigate('home')},
        ])
      }
      if (resData.success) {
        console.log(resData, 'trip')
        // dispatch(setItem(route.params.service.id, 'tripStarted'))
        setTripStarted(true)
        setTrip(resData.data)
      }
    } catch (e) {
      console.log(e)
      Alert.alert('Error', e.message)
    }
    setLoading(false)
  }

  // console.log(route.params.service.id, 'params')
  const startTreatment = async () => {
    const formData = new FormData()
    formData.append('request_id', route.params.service.id)
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)
    setLoading(true)
    try {
      const response = await fetch(`${APIURL}/api/care-giver/start-treatment`, {
        method: 'POST',
        body: formData,
        headers,
        redirect: 'follow',
      })

      const resData = await response.json()
      console.log(resData)
      if (!response.ok) {
        throw new Error(resData.message)
      }
      if (resData.success) {
        // dispatch(setItem(route.params.service.id, 'treatmentStarted'))
        console.log(resData, 'treatment')
        setVisible(false)
        navigation.navigate('treatment', {data: resData.data})
      }
    } catch (e) {
      Alert.alert('Error', e.message)
    }
    setLoading(false)
  }
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, []),
  )

  useFocusEffect(
    React.useCallback(() => {
      if (careGiverItem.status === 'enableTrip') {
        setEnableTrip(true)
      } else if (careGiverItem.status === 'tripStarted') {
        setTripStarted(true)
      }
    }, [careGiverItem.status]),
  )

  return (
    <>
      <CancelTripModal
        cancelOpen={cancelVisible}
        setCancelVisible={setCancelVisible}
        open={visible}
        setVisible={setVisible}
      />
      <TripModal
        enableTrip={enableTrip}
        setEnableTrip={setEnableTrip}
        open={visible}
        setVisible={setVisible}
        tripStarted={tripStarted}
        setTripStarted={setTripStarted}
        setCancelVisible={setCancelVisible}
        service={route.params.service}
        onStart={startTrip}
        startTreatment={startTreatment}
        trip={trip}
        loading={loading}
      />

      <MapView
        style={{flex: 0.5}}
        initialRegion={{
          latitude: location.latitude ? location.latitude : 37.42305396683122,
          longitude: location.longitude
            ? location.longitude
            : -122.0875014718816,

          latitudeDelta: 0.10922,
          longitudeDelta: 0.421,
        }}>
        <MapView.Marker coordinate={origin} />
        <MapView.Marker coordinate={destination} />
        <MapViewDirections
          strokeColor={'black'}
          strokeWidth={5}
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
        />
      </MapView>
    </>
  )
}

export default Map
