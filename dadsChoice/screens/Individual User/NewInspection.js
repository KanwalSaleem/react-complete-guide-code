import React, {useCallback, useEffect, useState} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  TextInput,
  Alert,
  Image,
  ScrollView,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons'
import fetch from 'node-fetch'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import Geolocation from '@react-native-community/geolocation'
import {useDispatch, useSelector} from 'react-redux'
import {Modal, Portal, Button} from 'react-native-paper'

import {getLocation} from '../../store/actions/location'

import AuthButton from '../../components/AuthButton'

import Colors from '../../constants/Colors'
import {APIURL} from '../../constants/url'

let vehiclePhotos = []
const NewInspection = (props) => {
  const {
    placeOfMission,
    informationOnVehicleToBeInspected,
    vehicleAnnouncement,
    vehiclePhoto,
    vehiclePhotoCG,
    tenCharacter,
    sendRequest,
  } = useSelector((state) => state.language)

  const [cgPhoto, setCgPhoto] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const token = useSelector((state) => state.auth.token)
  const location = useSelector((state) => state.location)
  const userId = useSelector((state) => state.auth.userId)

  const dispatch = useDispatch()

  const [showDate, setShowDate] = useState(false)
  const [date, setDate] = useState(new Date())

  const [showTime, setShowTime] = useState(false)
  const [time, setTime] = useState(new Date())
  const [missionPlace, setMissionPlace] = useState('')
  // console.log(location.address, 'address')
  const [placeHelper, setPlaceHelper] = useState('')
  const [vehicelInfo, setVehicleInfo] = useState('')
  const [vehicleHelper, setVehicleHelper] = useState('')

  const [visible, setVisible] = useState(false)
  const [cgVisible, setCgVisible] = useState(false)
  const [valid, setValid] = useState(false)

  const onDateChange = (e, selectedDate) => {
    try {
      setShowDate(Platform.OS === 'ios')
      if (selectedDate) {
        setDate(selectedDate)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onTimeChange = (e, selectedTime) => {
    try {
      setShowTime(Platform.OS === 'ios')
      setTime(selectedTime)
    } catch (e) {
      console.log(e)
    }
  }

  const changeMissionPlace = (text) => {
    setMissionPlace(text)

    if (missionPlace.length <= 0) {
      setPlaceHelper('This field is required')
      setValid(false)
    } else if (missionPlace.length <= 10) {
      setPlaceHelper(tenCharacter)
      setValid(false)
    } else if (missionPlace.length > 10) {
      setPlaceHelper('')
      setValid(true)
    }
  }

  const changeVehicleInfo = (text) => {
    setVehicleInfo(text)
    if (vehicelInfo.length <= 0) {
      setVehicleHelper('This field is required')
      setValid(false)
    } else if (vehicelInfo.length <= 10) {
      setVehicleHelper(tenCharacter)
      setValid(false)
    } else {
      setVehicleHelper('')
      setValid(true)
    }
  }

  const fileCameraHandler = () => {
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
    }

    launchCamera(options, (response) => {
      if (response.cancel) {
        return Alert.alert(
          'Cancelled',
          'Module was cancelled'[{text: 'Cancel', style: 'cancel'}],
        )
      } else if (response.assets) {
        vehiclePhotos = response.assets
      }

      setVisible(false)
    })
  }

  const ImagePickHandler = () => {
    const options = {
      path: 'images',
      mediaType: 'photo',
      selectionLimit: 6,
    }

    launchImageLibrary(options, (response) => {
      if (response.cancel) {
        return Alert.alert(
          'Cancelled',
          'Module was cancelled'[{text: 'Cancel', style: 'cancel'}],
        )
      } else if (response.assets) {
        vehiclePhotos = response.assets
      }

      setVisible(false)
    })
  }
  const getCurrentLocation = useCallback(
    async () => {
      try {
        if (Platform.OS === 'ios') {
          Geolocation.requestAuthorization()
          Geolocation.getCurrentPosition(
            (geo) => {
              dispatch(getLocation(geo.coords.longitude, geo.coords.latitude))
              props.navigation.navigate('map')
            },
            (e) => {
              console.log(e.message)
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

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(
              (geo) => {
                dispatch(getLocation(geo.coords.longitude, geo.coords.latitude))
                props.navigation.navigate('map')
              },
              (e) => {
                console.log(e)
                if (e.code === e.POSITION_UNAVAILABLE) {
                  Alert.alert('Turn on the location')
                } else if (e.code === e.PERMISSION_DENIED) {
                  Alert.alert('Please allow the location permission')
                } else if (e.code === e.TIMEOUT) {
                  Alert.alert('Request again ')
                }
                console.log(e.message)
              },
              {
                enableHighAccuracy: true,
                timeout: 60000,
              },
            )
          }
          return
        }
      } catch (e) {
        console.log(e)
      }
    },
    [dispatch, props.navigation],
  )

  const filePickModal = () => {
    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text style={styles.alertHeading}>Choose an Option</Text>
          <View style={styles.modalButtonsContainer}>
            <Button onPress={fileCameraHandler} color={Colors.primary}>
              Take a Photo
            </Button>
            <Button
              onPress={ImagePickHandler}
              color={Colors.primary}
              style={{
                fontSize: 16,
              }}>
              Choose a Photo
            </Button>
          </View>
        </Modal>
      </Portal>
    )
  }

  const cgCameraHandler = () => {
    const options = {
      path: 'images',
      mediaType: 'photo',
      selectionLimit: 6,
    }

    launchCamera(options, (response) => {
      if (response.cancel) {
        return Alert.alert(
          'Cancelled',
          'Module was cancelled'[{text: 'Cancel', style: 'cancel'}],
        )
      } else if (response.assets) {
        setCgPhoto(response.assets)
      }

      setCgVisible(false)
    })
  }

  const cgImageHandler = () => {
    const options = {
      path: 'images',
      mediaType: 'photo',
      selectionLimit: 6,
    }

    launchImageLibrary(options, (response) => {
      if (response.cancel) {
        return Alert.alert(
          'Cancelled',
          'Module was cancelled'[{text: 'Cancel', style: 'cancel'}],
        )
      } else if (response.assets) {
        setCgPhoto(response.assets)
        console.log(response.assets[0])
      }

      setCgVisible(false)
    })
  }

  const cgModal = () => {
    return (
      <Portal>
        <Modal
          visible={cgVisible}
          onDismiss={() => setCgVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text style={styles.alertHeading}>Choose an Option</Text>
          <View style={styles.modalButtonsContainer}>
            <Button onPress={cgCameraHandler} color={Colors.primary}>
              Take a Photo
            </Button>
            <Button
              onPress={cgImageHandler}
              color={Colors.primary}
              style={{
                fontSize: 16,
              }}>
              Choose a Photo
            </Button>
          </View>
        </Modal>
      </Portal>
    )
  }

  const sendInspection = async () => {
    const formDate = date
      ? `-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
      : `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`

    const formTime = time
      ? `${time.getHours()}:${time.getMinutes()}:00`
      : `${new Date().getHours()}:${new Date().getMinutes()}:00`

    const validPhotos = vehiclePhotos.map((photo) => ({
      uri: photo.uri,
      name: photo.fileName,
      type: photo.type,
    }))
    console.log('photos', validPhotos)
    // console.log({
    //   uri: cgPhoto.uri,
    //   name: cgPhoto.fileName,
    //   type: cgPhoto.type,
    // })

    // eslint-disable-next-line no-undef
    const inspectData = new FormData()

    inspectData.append('user_id', `${userId}`)
    inspectData.append('location', `${location.address}`)
    inspectData.append(
      'coordinates',
      `${location.latitude}, ${location.longitude}`,
    )
    inspectData.append('date_of_mission', formDate)
    inspectData.append('time_slot', formTime)
    inspectData.append('vehicle_announcement', vehicelInfo)
    validPhotos.forEach((currentPhoto) =>
      inspectData.append('vehicle_img[]', currentPhoto),
    )

    cgPhoto.forEach((cg) =>
      inspectData.append('vehicle_cg_img[]', {
        uri: cg.uri,
        name: cg.fileName,
        type: cg.type,
      }),
    )

    // eslint-disable-next-line no-undef
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)
    headers.append('Accept', 'application/json')
    // headers.append(
    //   'Content-Type',
    //   'multipart/form-data; boundary=<calculated when request is sent>',
    // )

    const requestOptions = {
      method: 'POST',
      body: inspectData,
      headers,
    }

    try {
      setLoading(true)
      const response = await fetch(`${APIURL}/api/inspection`, requestOptions)
      console.log(response)
      const resData = await response.json()
      console.log(resData)
      if (!response.ok) {
        console.log(response)
        throw new Error(response)
      }
      Alert.alert('Success', 'Request has been sent succesfully', [
        {onPress: setError(null)},
      ])
      console.log(response)
      console.log(resData)
      setMissionPlace('')
      setCgPhoto([])
      vehiclePhotos = []
      setPlaceHelper('')
      setVehicleHelper('')
      setVehicleInfo('')
      props.navigation.navigate('home')
    } catch (e) {
      console.log(e)
      setError(e.message)
    }

    setLoading(false)
  }

  useEffect(
    () => {
      if (error) {
        Alert.alert('Error', error, [
          {text: 'Okay', onPress: () => setError(null), style: 'cancel'},
        ])
      }
    },
    [error],
  )

  const validDate = date
    ? `${date.getDate()}/${
        Platform.OS == 'ios' ? date.getMonth() + 1 : date.getMonth()
      }/${date.getFullYear()}`
    : `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`

  const validTime = time
    ? `${time.getHours()}:${time.getMinutes()}`
    : `${new Date().getHours()}:${new Date().getMinutes()}`

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView>
          {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        > */}
          <View style={styles.mainContainer}>
            <View style={styles.fieldArea}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  selectionColor={Colors.grey}
                  placeholder={'Date of the mission'}
                  value={validDate}
                  editable={false}
                  dataDetectorTypes={'calendarEvent'}
                  returnKeyType="next"
                  placeholderTextColor={Colors.darkGrey}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowDate(true)
                  }}>
                  <Icon name="event" size={25} color="#888888" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.fieldArea}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, {textAlignVertical: 'top'}]}
                  selectionColor={Colors.grey}
                  placeholder={placeOfMission}
                  value={location?.address ? location.address : missionPlace}
                  onChangeText={changeMissionPlace}
                  // dataDetectorTypes={'address'}

                  // defaultValue={location.address ? location.address : ''}
                  multiline={true}
                  numberOfLines={4}
                  returnKeyType="next"
                  placeholderTextColor={Colors.darkGrey}
                />
                <TouchableOpacity onPress={getCurrentLocation}>
                  <Icon
                    name="public"
                    size={25}
                    color="#888888"
                    style={{alignSelf: 'flex-start'}}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.errorText}>{placeHelper}</Text>
            </View>
            <View style={styles.fieldArea}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  selectionColor={Colors.grey}
                  placeholder={'Time of the mission'}
                  value={validTime}
                  editable={false}
                  dataDetectorTypes={'address'}
                  returnKeyType="next"
                  placeholderTextColor={Colors.darkGrey}
                />
                <TouchableOpacity onPress={() => setShowTime(true)}>
                  <Icon name="schedule" size={25} color="#888888" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.fieldArea}>
              <Text style={styles.pickerText}>
                {informationOnVehicleToBeInspected}
              </Text>
              <Text style={styles.pickerText}>{`${vehicleAnnouncement}`}</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  selectionColor={Colors.grey}
                  value={vehicelInfo}
                  placeholder={''}
                  onChangeText={changeVehicleInfo}
                  // dataDetectorTypes={'cale'}
                  multiline={true}
                  numberOfLines={4}
                  returnKeyType="next"
                  placeholderTextColor={Colors.darkGrey}
                />
              </View>
              <Text style={styles.errorText}>{vehicleHelper}</Text>
            </View>
            <View style={styles.pickerArea}>
              <Text style={styles.pickerText}>{vehiclePhoto}</Text>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  setVisible(true)
                }}>
                <View style={styles.filePickerContainer}>
                  {vehiclePhotos[0] ? (
                    <Image
                      source={{uri: vehiclePhotos[0].uri}}
                      style={styles.fileImage}
                    />
                  ) : (
                    <Icon
                      style={styles.inputIcon}
                      name="photo-camera"
                      color="#4F8EF7"
                      size={30}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <View style={{marginLeft: 10, marginVertical: 5}}>
                <Text style={{fontSize: 14, color: Colors.darkGrey}}>{`${
                  vehiclePhotos.length
                } Photos Selected`}</Text>
              </View>
            </View>
            <View style={styles.pickerArea}>
              <Text style={styles.pickerText}>{vehiclePhotoCG}</Text>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  setCgVisible(true)
                }}>
                <View style={styles.filePickerContainer}>
                  {cgPhoto[0] ? (
                    <Image
                      source={{uri: cgPhoto[0].uri}}
                      style={styles.fileImage}
                    />
                  ) : (
                    <Icon
                      style={styles.inputIcon}
                      name="photo-camera"
                      color="#4F8EF7"
                      size={30}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <View style={{marginLeft: 10, marginVertical: 5}}>
                <Text style={{fontSize: 14, color: Colors.darkGrey}}>{`${
                  cgPhoto.length
                } Photos Selected`}</Text>
              </View>
            </View>

            {loading ? (
              <ActivityIndicator
                color={Colors.primary}
                size={'large'}
                style={{marginTop: 5}}
              />
            ) : (
              <AuthButton
                style={styles.button}
                disabled={!valid}
                onPress={sendInspection}>
                {sendRequest}
              </AuthButton>
            )}
            {showDate && (
              <Modal
                animationType="slide"
                transparent={true}
                visible={showDate}
                onDismiss={() => setShowDate(false)}>
                <SafeAreaView
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date ? date : new Date()}
                    mode={'date'}
                    is24Hour={true}
                    display="default"
                    onChange={onDateChange}
                    shouldRasterizeIOS={true}
                    style={{width: 80, backgroundColor: 'white'}}
                  />
                </SafeAreaView>
              </Modal>
            )}
            {showTime && (
              <Modal
                transparent={false}
                visible={showTime}
                onDismiss={() => setShowTime(false)}>
                <SafeAreaView
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={time ? time : new Date()}
                    mode={'time'}
                    is24Hour={false}
                    display="default"
                    onChange={onTimeChange}
                    style={{
                      width: 80,
                      backfaceVisibility: 0,
                      backgroundColor: 'white',
                    }}
                    // style={{width:320, backgroundColor:'white'}}
                  />
                </SafeAreaView>
              </Modal>
            )}
          </View>
          {filePickModal()}
          {cgModal()}
          {/* </KeyboardAvoidingView> */}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    flex: 1,

    paddingVertical: 10,
    paddingBottom: 20,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  fieldArea: {
    // alignItems: 'center',
    marginVertical: 10,
  },
  typePicker: {
    width: '80%',
    backgroundColor: Colors.backgroundColor,
    marginVertical: 10,
    borderRadius: 10,
    padding: 5,
  },

  imagePickerContainer: {
    width: 130,
    height: 130,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputContainer: {
    backgroundColor: Colors.backgroundColor,
    borderRadius: 15,
    padding: 10,
    minWidth: '80%',
    maxWidth: '80%',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    color: 'grey',
    flexBasis: '66%',
  },
  errorText: {
    color: 'red',
  },
  filePickerContainer: {
    width: 130,
    height: 130,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerArea: {
    alignItems: 'flex-start',
    marginBottom: 10,
    width: '85%',
  },
  pickerText: {
    color: Colors.grey,
    fontWeight: '700',
    fontSize: 15,

    marginLeft: 10,
    width: '100%',
    marginBottom: 5,
  },

  button: {
    marginTop: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 5,
  },
  alertHeading: {
    fontSize: 20,
  },
  modalButtonsContainer: {
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: Colors.backgroundColor,
    marginTop: 20,
  },
  fileImage: {
    width: 130,
    height: 130,
    resizeMode: 'cover',
    borderRadius: 10,
  },
})

export default NewInspection
