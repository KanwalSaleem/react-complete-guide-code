import React, {useCallback, useEffect, useState} from 'react'
import {Alert, BackHandler} from 'react-native'
import MapView from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import {useFocusEffect} from '@react-navigation/native'
import {useSelector, useDispatch} from 'react-redux'

import ServiceDetailModal from '../../components/Caregiver/ServiceDetailModal'
import FeedBack from '../../components/feedBack'
import Reject from '../../components/RejectModal'

import {APIURL} from '../../constants/url'
import {setItem} from '../../store/actions/careGiver'

const ServiceRequestDetail = ({route, navigation}) => {
  // console.log(route.params)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const token = useSelector((state) => state.auth.token)
  const location = useSelector((state) => state.location)
  const [service, setService] = useState()

  const [visible, setVisible] = useState(false)
  const [accept, setAccept] = useState(false)
  const [serviceId, setServiceId] = useState('')

  const [goingBack, setGoingBack] = useState(false)
  const [reject, setReject] = useState(false)

  // const selectLocationHandler = (event) => {
  //   const latitude = event.nativeEvent.coordinate.latitude
  //   const longitude = event.nativeEvent.coordinate.longitude
  // }
  const origin = {latitude: location.latitude, longitude: location.longitude}
  const destination = {
    latitude: service ? parseFloat(service.latitude) : 37.42305396683122,
    longitude: service ? parseFloat(service.longitude) : -122.0875014718816,
  }
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCgSOrjZImgZJzMMbGXvbV8S36Tv4A_2us'
  // console.log(origin)
  // console.log(destination)
  const acceptService = async () => {
    const formData = new FormData()
    formData.append('request_id', route.params.id)
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)
    setLoading(true)
    try {
      const response = await fetch(`${APIURL}/api/care-giver/request-accept`, {
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
        return Alert.alert('unsuccessful', resData.message)
      }
      setVisible(false)

      setServiceId(resData.data.id)
      setAccept(true)
      console.log(resData)
    } catch (e) {
      alert('Error', e.message)
    }
    setLoading(false)
  }

  const rejectService = async () => {
    const formData = new FormData()
    formData.append('request_id', route.params.id)
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)
    setLoading(true)
    try {
      const response = await fetch(`${APIURL}/api/care-giver/request-reject`, {
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
      setLoading(false)
      setReject(false)
      Alert.alert('Successful', resData.message, [
        {
          onPress: () => navigation.navigate('home'),
        },
      ])

      // console.log(resData)
    } catch (e) {
      alert('Error', e.message)
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      const getSingleService = async () => {
        const formData = new FormData()
        formData.append('request_id', route.params.id)
        const headers = new Headers()
        headers.append('Authorization', `Bearer ${token}`)
        try {
          const response = await fetch(
            `${APIURL}/api/care-giver/single-service`,
            {
              method: 'POST',
              headers,
              body: formData,
              redirect: 'follow',
            },
          )
          const resData = await response.json()
          // console.log(resData)

          if (!response.ok) {
            console.log('hello')
            throw new Error(resData.message)
          }
          console.log(resData.data.service, 'asasd')

          setService({
            ...resData.data,
            service: resData.data.service,
            symptoms: resData.data.symptomps,
            patientNote: resData.data.patient_note,
            // image: resData.dataservice.image,
            patient: resData.data.patient,
            addressLine1: resData.data.address_line_1,
            addressLine2: resData.data.address_line_2,
            postalCode: resData.data.postal_code,
            city: resData.data.city,
          })
          setVisible(true)
        } catch (e) {
          console.log(e)
          alert('Error', e.message)
        }
      }
      getSingleService()
    }, [route.params.id]),
  )
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (goingBack === false) {
          setGoingBack(true)
          setVisible(false)
          return true
        } else {
          return false
        }
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [goingBack]),
  )

  return (
    <>
      <Reject
        visible={reject}
        dismiss={() => setReject(true)}
        onPress={rejectService}>
        Are you sure you want to Reject the service ?
      </Reject>
      <FeedBack
        visible={accept}
        text="your request has been accepted "
        setVisible={setAccept}
        onPress={() => {
          // dispatch(setItem(serviceId, 'tripNotStarted'))
          setAccept(false)
          navigation.navigate('map', {
            service,
          })
        }}
      />
      {service && (
        <ServiceDetailModal
          open={visible && !reject}
          // onDismiss={() => setGoingBack(Back)}
          onAccept={acceptService}
          onReject={() => setReject(true)}
          service={service}
          loading={loading}
          goingBack={goingBack}
        />
      )}

      {service ? (
        <MapView
          style={{flex: 1}}
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
      ) : (
        <></>
      )}
    </>
  )
}

export default ServiceRequestDetail
