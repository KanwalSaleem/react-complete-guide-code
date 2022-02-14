import React, {useCallback, useEffect, useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native'
import Geolocation from '@react-native-community/geolocation'
import {useDispatch, useSelector} from 'react-redux'
import MapView, {Callout, Marker} from 'react-native-maps'
import {getLocation} from '../../store/actions/location'
import Icon from 'react-native-vector-icons/MaterialIcons'
import fetch from 'node-fetch'
import {APIURL} from '../../constants/url'

const homeIcon = require('../../assets/homeicon.png')
const carIcon = require('../../assets/caricon.png')

const Map = ({navigation}) => {
  const dispatch = useDispatch()
  const {latitude, longitude} = useSelector((state) => state.location)
  const token = useSelector((state) => state.auth.token)
  const [reports, setReports] = useState([
    {
      id: 1,
      coordinates: '37.42220190984646, -122.08407897306436',
      image: homeIcon,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const getInspections = useCallback(
    async () => {
      // eslint-disable-next-line no-undef
      const headers = new Headers()
      headers.append('Accept', 'application/json')
      headers.append('Authorization', `Bearer ${token}`)

      // eslint-disable-next-line no-undef
      const locationData = new FormData()
      locationData.append('latituteFrom', parseFloat(latitude))
      locationData.append('longituteFrom', parseFloat(longitude))
      const requestOptions = {
        method: 'POST',
        body: locationData,
        headers,
      }
      setIsLoading(true)
      if (latitude && longitude) {
        try {
          const response = await fetch(
            `${APIURL}/api/near-by-inspecitons`,
            requestOptions,
          )
          const resData = await response.json()
          console.log(response)
          console.log(resData)

          // const coords = resData.data[0].coordinates.split(', ')
          // console.log(parseFloat(coords[0]))
          //  const result = resData.data.map((item) => ({
          //    dateOfMission : item.date_of_mission,
          //    timeOfMission : item.time_slot,
          //    vehicleAnnouncement: item.vehicle_announcement,

          //  }))

          if (!response.ok) {
            throw new Error(resData.message)
          }
          setReports(resData.data)
        } catch (e) {
          // console.log(e.message)
          console.log(e)
          // Alert.alert('Error', e.message)
        }
      }
      setIsLoading(false)
    },
    [latitude, longitude, token],
  )

  const getCurrentLocation = useCallback(
    async () => {
      try {
        if (Platform.OS === 'ios') {
          Geolocation.requestAuthorization()
          Geolocation.getCurrentPosition(
            (geo) => {
              dispatch(getLocation(geo.coords.longitude, geo.coords.latitude))
            },
            (e) => {
              if (e.code == 2) {
                Alert.alert(
                  'Location not provided',
                  'Please Turn on your Location',
                )
              } else if (e.code == 1) {
                Alert.alert(
                  'Location not enabled',
                  'Please enable permission for this App.',
                )
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 60000,
            },
          )
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Dads Choice App Location Permission',
              message: 'Dads Choice needs to access your current location',

              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          )

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Permissions are required to access Location')
            return
          }
          Geolocation.getCurrentPosition(
            (geo) => {
              dispatch(getLocation(geo.coords.longitude, geo.coords.latitude))
              setTimeout(() => {
                if (geo.coords.longitude != null) {
                  getInspections()
                }
              }, 1000)
            },
            (e) => {
              if (e.code == e.POSITION_UNAVAILABLE) {
                Alert.alert(
                  'Location not provided',
                  'Please Turn on your Location',
                )
              } else if (e.code == e.PERMISSION_DENIED) {
                Alert.alert(
                  'Location not provided',
                  'Please enable permission for this App.',
                )
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 30000,
            },
          )
        }
      } catch (e) {
        console.log(e)
      }
    },
    [dispatch, getInspections],
  )

  const assignInspection = async (inspectionId) => {
    // eslint-disable-next-line no-undef
    const headers = new Headers()
    headers.append('Accept', 'application/json')
    headers.append('Authorization', `Bearer ${token}`)

    // eslint-disable-next-line no-undef
    const locationData = new FormData()
    locationData.append('inspection_id', inspectionId)
    const requestOptions = {
      method: 'POST',
      body: locationData,
      headers,
    }

    try {
      const response = await fetch(
        `${APIURL}/api/assign-inspection`,
        requestOptions,
      )
      const resData = await response.json()
      console.log(response)
      if (!response.ok) {
        console.log(resData)
        throw new Error(resData.message)
      }
      Alert.alert('Success', 'Inspection Accepted Successfully')
      getInspections()
      console.log(resData)
    } catch (e) {
      Alert.alert('Error', e.message)
    }
  }

  useEffect(
    () => {
      const unsubscribe = navigation.addListener('focus', () => {
        // Screen was focused
        // Do something
        getCurrentLocation()
      })

      return unsubscribe
    },
    [getCurrentLocation, navigation],
  )
  useEffect(
    () => {
      getCurrentLocation()
    },
    [getCurrentLocation],
  )

  const showMarkers = () => {
    return reports.map((report) => {
      const coords = report.coordinates.split(', ')
      // console.log(parseFloat(coords[0]))
      return (
        <Marker
          key={report.id}
          coordinate={{
            latitude: parseFloat(coords[0]),
            longitude: parseFloat(coords[1]),
          }}
          // centerOffset={{x: -3.7, y: 0.6}}
          // calloutOffset={{x: -3.7, y: 0.6}}
          // calloutAnchor={{x: -3.7, y: 0.6}}
          // image={latitude == parseFloat(coords[0]) ? homeIcon : carIcon}
          image={carIcon}
          // image={latitude == parseFloat(coords[0]) ? homeIcon : carIcon}
          style={{width: 30, height: 30}}
          stopPropagation={true}>
          <Callout tooltip onPress={assignInspection.bind(this, report.id)}>
            <View>
              <View style={styles.calloutView}>
                <Text style={styles.calloutText}>
                  {report.vehicle_announcement}
                </Text>
                <View style={styles.timeDateView}>
                  <View style={styles.dateContainer}>
                    <Icon name="event" color="grey" size={18} />
                    <Text style={styles.timeDateText}>
                      {report.date_of_mission}
                    </Text>
                  </View>
                  <View style={styles.dateContainer}>
                    <Icon name="schedule" color="grey" size={18} />
                    <Text style={styles.timeDateText}>{report.time_slot}</Text>
                  </View>
                </View>
                {/* <TouchableOpacity
                  touchSoundDisabled={false}
                  activeOpacity={0.1}
                  style={{marginTop: 10}}
                  onPress={() => {
                    console.log('hello')
                  }}> */}
                <Text style={{color: '#35dad8', marginTop: 10}}>
                  Tap to Accept
                </Text>
                {/* </TouchableOpacity> */}
              </View>
              <View style={styles.arrowBorder} />
              <View style={styles.arrow} />
            </View>
          </Callout>
        </Marker>
      )
    })
  }

  return (
    <>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <MapView
          region={{
            latitude: latitude ? latitude : 37.42305396683122,
            longitude: longitude ? longitude : -122.0875014718816,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.0421,
          }}
          // initialRegion={{
          //   latitude: latitude ? latitude : 37.42305396683122,
          //   longitude: longitude ? longitude : -122.0875014718816,
          //   latitudeDelta: 0.00922,
          //   longitudeDelta: 0.0421,
          // }}
          style={{flex: 1}}>
          {showMarkers()}
          <Marker
            coordinate={{
              latitude: latitude ? latitude : 37.42305396683122,
              longitude: longitude ? longitude : -122.0875014718816,
            }}
            // centerOffset={{x: -3.7, y: 0.6}}
            // calloutOffset={{x: -3.7, y: 0.6}}
            // calloutAnchor={{x: -3.7, y: 0.6}}
            // image={latitude == parseFloat(coords[0]) ? homeIcon : carIcon}
            image={homeIcon}
            // image={latitude == parseFloat(coords[0]) ? homeIcon : carIcon}
            style={{width: 30, height: 30}}
            stopPropagation={true}
          />
        </MapView>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  calloutView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 10,
    width: 300,
    color: '#9d9d9d',
  },
  calloutText: {
    fontSize: 16,
    color: '#9d9d9d',
    marginBottom: 5,
  },
  timeDateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    width: '50%',
  },
  timeDateText: {
    fontSize: 16,
    color: '#9d9d9d',
    marginLeft: 5,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'flex-end',
    marginTop: -32,

    // marginLeft: 20,
    marginRight: 20,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'flex-end',
    marginTop: -0.5,
    // marginLeft: 20,
    marginRight: 20,

    // marginBottom: -15
  },
})

export default Map
