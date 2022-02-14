import React, {useLayoutEffect, useCallback, useState} from 'react'
import {TouchableOpacity, ActivityIndicator, Alert} from 'react-native'
import MapView, {Marker} from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useDispatch, useSelector} from 'react-redux'
import Colors from '../../constants/Colors'

import {getLocation, setAddress} from '../../store/actions/location'

const Map = ({navigation}) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const location = useSelector((state) => state.location)

  const mapRegion = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421,
  }

  const saveCoords = useCallback(
    async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://us1.locationiq.com/v1/reverse.php?key=pk.bd733b0aaf436f3ad0ef530a41ab5ee3&lat=${
            location.latitude
          }&lon=${location.longitude}&format=json`,
        )

        const resData = await response.json()
        if (!response.ok) {
          throw new Error(resData.message)
        }
        await dispatch(setAddress(resData.display_name))
        navigation.navigate('newInspection', {
          address: resData.display_name,
        })
      } catch (e) {
        Alert.alert('Error', e)
        navigation.navigate('newInspection')
      }
      setLoading(false)
    },
    [
      dispatch,
      location.latitude,
      location.longitude,
      navigation,
      // location.address,
    ],
  )

  const selectLocationHandler = (event) => {
    const latitude = event.nativeEvent.coordinate.latitude
    const longitude = event.nativeEvent.coordinate.longitude

    dispatch(getLocation(longitude, latitude))
  }
  useLayoutEffect(
    () => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            disabled={loading}
            style={{marginHorizontal: 10, marginRight: 15}}
            onPress={saveCoords}>
            {/* <Text style={{color: 'white', fontSize: 14}}>Save</Text> */}
            {loading ? (
              <ActivityIndicator color={Colors.primary} />
            ) : (
              <Icon size={25} color="white" name="save" />
            )}
          </TouchableOpacity>
        ),
      })
    },
    [loading, navigation, saveCoords],
  )

  return (
    <MapView
      initialRegion={mapRegion}
      onPress={selectLocationHandler}
      style={{flex: 1}}>
      {location && <Marker title="Picked Location" coordinate={location} />}
    </MapView>
  )
}

export default Map
