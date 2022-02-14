import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Linking,
  ScrollView,
} from 'react-native'
import {Modal, Portal, ActivityIndicator} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../../constants/Colors'
import {APIURL} from '../../constants/url'
import {useNavigation} from '@react-navigation/core'

const TripModal = (props) => {
  const navigation = useNavigation()
  const {patient, service, symptoms} = props.service
  console.log(props.service)

  const {height} = useWindowDimensions()
  return (
    <Portal>
      <Modal
        style={{
          // top: height < 700 ? '20%' : '30%',
          // alignSelf: 'center',
          backgroundColor: 'transparent',
          justifyContent: 'flex-end',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        contentContainerStyle={{
          alignSelf: 'flex-end',
          backgroundColor: 'white',
          height: '60%',
          width: '100%',
        }}
        visible={props.open}
        dismissable={props.tripStarted}
        onDismiss={() => props.setVisible(false)}>
        {patient.image ? (
          <Image
            style={{
              alignSelf: 'center',
              width: 100,
              height: 100,
              borderRadius: 10,
              marginTop: -20,
            }}
            source={{uri: `${APIURL}/storage/public/${patient.image}`}}
          />
        ) : (
          <Image
            style={{
              alignSelf: 'center',
              width: 100,
              height: 100,
              borderRadius: 10,
              marginTop: -20,
            }}
            source={require('../../assets/broken.jpg')}
          />
        )}
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            // minHeight: '40%',
            // maxHeight: '50%',
            paddingBottom: 10,
          }}>
          <View style={styles.infoContainer}>
            <View
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                // marginLeft: props.tripStarted ? 70 : 0,
              }}>
              <Text
                style={
                  styles.name
                }>{`${patient.first_name} ${patient.last_name}`}</Text>
              {props.tripStarted && (
                <>
                  <Text style={styles.address}>
                    {props.service.addressLine1}
                  </Text>

                  <Text style={styles.address}>{props.service.postalCode}</Text>
                  <Text style={styles.address}>{props.service.city}</Text>
                  {props.trip && (
                    <Text style={styles.address}>OTP: {props.trip.otp}</Text>
                  )}
                </>
              )}
            </View>
            {props.tripStarted && props.trip && (
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(`tel:${props.trip.patient.phone}`)
                }
                style={{
                  backgroundColor: '#189700',
                  borderRadius: 100,
                  padding: 10,
                  position: 'absolute',
                  right: 30,
                  top: 60,
                  // marginRight: -30,
                }}>
                <Icon name="call" size={25} color="white" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.diseaseContainer}>
            <Image
              source={{uri: `${APIURL}/storage/uploads/${service.icon}`}}
              style={{width: 60, height: 60, borderRadius: 10}}
            />
            <Text style={[styles.name, {marginLeft: 20, fontSize: 21}]}>
              {service.title}
            </Text>
          </View>

          <Text style={styles.symptomsHeading}>Symptoms</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontFamily: 'Roboto-Regular', fontSize: 14}}>
              {symptoms}
            </Text>
          </View>
          <View style={styles.costsContainer}>
            <View style={styles.cost}>
              <Text style={styles.costHeading}>Service Cost</Text>
              <Text style={styles.costAmount}>{`$${service.cost}`}</Text>
            </View>
            <View style={styles.cost}>
              <Text style={styles.costHeading}>Gas Charge</Text>
              <Text style={styles.costAmount}>{`$${service.charge}`}</Text>
            </View>
            <View style={styles.cost}>
              <Text style={styles.costHeading}>Convenience</Text>
              <Text style={styles.costAmount}>{`$${service.convenience}`}</Text>
            </View>
          </View>
          <View style={styles.distanceContainer}>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.primary,
                borderRadius: 100,
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 30,
              }}>
              <Icon name="navigation" size={25} color="white" />
            </TouchableOpacity>
            <Text style={styles.name}>5 Miles, 1h 30mins</Text>
          </View>
          <View
            style={[
              styles.callToAction,
              props.tripStarted && {
                flexDirection: 'column',
                marginTop: 10,
              },
            ]}>
            {!props.tripStarted && (
              <>
                {props.loading ? (
                  <ActivityIndicator
                    color={Colors.primary}
                    style={{marginVertical: 15, flex: 0.5, marginLeft: 20}}
                  />
                ) : (
                  <TouchableOpacity
                    disabled={!props.enableTrip}
                    onPress={props.onStart}
                    style={{
                      backgroundColor: props.enableTrip
                        ? Colors.primary
                        : '#cccc',
                      borderRadius: 10,
                      marginRight: 5,
                      // flex: 0.5,
                      width: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={styles.buttonText}>Start Trip</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            {props.tripStarted && (
              <>
                {props.loading ? (
                  <ActivityIndicator
                    color={Colors.primary}
                    style={{marginVertical: 13}}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={props.startTreatment}
                    style={{
                      backgroundColor: Colors.primary,
                      borderRadius: 10,
                      marginRight: 5,

                      padding: 10,
                      marginBottom: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={styles.buttonText}>Start Treatment</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            <TouchableOpacity
              onPress={() => {
                props.setVisible(false)
                props.setCancelVisible(true)
                navigation.navigate('home')
              }}
              style={{
                backgroundColor: '#000',
                borderRadius: 10,
                padding: 10,
                width: props.tripStarted ? '100%' : '50%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  )
}
const styles = StyleSheet.create({
  name: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },
  address: {
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  diseaseContainer: {flexDirection: 'row', alignItems: 'center'},
  symptomsHeading: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginTop: 10,
  },
  costsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  cost: {
    backgroundColor: '#F6F6F6',
    padding: 10,
    borderRadius: 10,
  },
  costHeading: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
  },
  costAmount: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  callToAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    color: '#fff',
  },
})

export default TripModal
