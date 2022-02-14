import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native'
import {ActivityIndicator, Modal, Portal} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../../constants/Colors'
import {APIURL} from '../../constants/url'
import AuthButton from '../AuthButton'

const ServiceDetailModal = (props) => {
  const {height} = useWindowDimensions()
  const {service} = props
  return (
    <Portal>
      <Modal
        contentContainerStyle={{
          // paddingHorizontal: 10,
          // minHeight: '40%',
          // maxHeight: '50%',
          // alignSelf: 'center',
          paddingBottom: 10,
          width: '96%',
          alignSelf: 'center',
          // paddingTop: 10,
          bottom: 0,
          backgroundColor: '#0000',
        }}
        style={{
          justifyContent: 'flex-end',
          // alignItems: 'flex-end',
          // flexDirection: 'row',
          top: height < 700 ? '15%' : '35%',
          // height: '100%',

          // alignSelf: 'center',
          backgroundColor: '#000000',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        dismissable={props.goingBack === true}
        visible={props.open}
        onDismiss={props.onDismiss}>
        <View style={[styles.greyContainer, {marginBottom: 10}]}>
          <View style={styles.diseaseContainer}>
            <Image
              source={{
                uri: `${APIURL}/storage/uploads/${service?.service?.icon}`,
              }}
              style={{width: 100, height: 100, borderRadius: 10}}
            />

            <Text style={styles.diseaseHeading}>{service?.service?.title}</Text>
          </View>
          <View style={styles.costsContainer}>
            <View style={styles.cost}>
              <Text style={styles.costHeading}>Service Cost</Text>
              <Text
                style={styles.costAmount}>{`$${service?.service?.cost}`}</Text>
            </View>
            <View style={styles.cost}>
              <Text style={styles.costHeading}>Gas Charge</Text>
              <Text
                style={
                  styles.costAmount
                }>{`$${service?.service?.charge}`}</Text>
            </View>
            <View style={styles.cost}>
              <Text style={styles.costHeading}>Convenience</Text>
              <Text
                style={
                  styles.costAmount
                }>{`$${service?.service?.convenience}`}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.greyContainer]}>
          <Text style={styles.symptomsHeading}>Symptoms</Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'Roboto-Regular',
                fontSize: 14,
                color: '#fff',
              }}>
              {service?.symptoms}
            </Text>
          </View>
          <Text style={styles.symptomsHeading}>Patient Note</Text>
          <Text style={styles.note}>{service?.patientNote}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {props.loading ? (
            <ActivityIndicator
              color={Colors.primary}
              style={{alignSelf: 'center'}}
            />
          ) : (
            <>
              <AuthButton
                style={{width: '49%', height: 50}}
                onPress={props.onAccept}>
                Accept
              </AuthButton>

              <AuthButton
                onPress={props.onReject}
                style={{width: '49%', backgroundColor: '#757575', height: 50}}>
                Reject
              </AuthButton>
            </>
          )}
        </View>
      </Modal>
    </Portal>
  )
}
const styles = StyleSheet.create({
  greyContainer: {
    backgroundColor: '#2B2B2B',
    padding: 20,
    borderRadius: 10,
  },
  diseaseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diseaseHeading: {
    fontFamily: 'Roboto-Bold',
    fontSize: 21,
    color: '#fff',
    alignSelf: 'center',
    marginLeft: 20,
  },
  costsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  cost: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  costHeading: {
    marginBottom: 10,
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#fff',
  },
  costAmount: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#fff',
  },
  symptomsHeading: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginTop: 10,
    color: '#fff',
  },
  note: {
    color: '#fff',
  },
})

export default ServiceDetailModal
