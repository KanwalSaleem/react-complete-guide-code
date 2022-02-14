import React, {useState, useRef, useEffect, useContext} from 'react'
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
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../constants/Colors'
import RatingComp from '../components/RatingComp'

const ServiceDetailsComp = (props) => {
  return (
    <ScrollView contentContainerStyle={styles.mainContainer}>
      <View style={styles.profileContainer}>
        <View style={styles.imageContainer}>
          <Image source={props.image} style={styles.image} />
          <Text style={styles.title}>{props.name}</Text>
          <Text style={styles.status}>{props.status}</Text>
        </View>

        {props.user === 'careGiver' && (
          <View style={styles.costContainer}>
            <View style={styles.costInnerContainer}>
              <Text style={styles.costTitle}>Service Cost</Text>
              <Text style={styles.costSubTitle}>${props.serviceCost}</Text>
            </View>
            <View style={[styles.costInnerContainer, {marginLeft: 5}]}>
              <Text style={styles.costTitle}>Gas Charge</Text>
              <Text style={styles.costSubTitle}>${props.gasCharge}</Text>
            </View>
            <View style={[styles.costInnerContainer, {marginLeft: 5}]}>
              <Text style={styles.costTitle}>Convenience</Text>
              <Text style={styles.costSubTitle}>${props.convenience}</Text>
            </View>
          </View>
        )}
        <View style={styles.symptomsContainer}>
          <Text style={styles.symptomsTitle}>Symptoms</Text>
          <Text style={styles.symptomsText}>{props.symptoms}</Text>
        </View>
        <View style={styles.symptomsContainer}>
          <Text style={styles.symptomsTitle}>Patient Note</Text>
          <Text style={styles.symptomsText}>{props.patientNote}</Text>
        </View>
      </View>
      <View
        style={[
          styles.profileContainer,
          {flexDirection: 'row', marginTop: 10},
        ]}>
        <View style={styles.treatmentContainer}>
          <Text style={[styles.symptomsTitle]}>Treatment Start</Text>
          <Text style={[styles.symptomsText, {marginTop: 10}]}>
            {props.treatmentStart}
          </Text>
        </View>
        <View style={styles.treatmentContainer}>
          <Text style={styles.symptomsTitle}>Treatment End</Text>
          <Text style={[styles.symptomsText, {marginTop: 10}]}>
            {props.treatmentEnd}
          </Text>
        </View>
      </View>
      <View style={[styles.profileContainer, {marginTop: 10}]}>
        <View style={styles.checkListContainer}>
          <Text style={styles.symptomsTitle}>Diagnostic Checklist</Text>
          <Icon name="add" size={25} />
        </View>
        <View style={styles.listContainer}>
          <Text style={styles.symptomsTitle}>1</Text>

          <Text style={[styles.symptomsText, {marginLeft: 10, top: -4}]}>
            {props.diagnosticChecklist}
          </Text>
        </View>
      </View>
      <View style={[styles.profileContainer, {marginTop: 10}]}>
        {props.user === 'careGiver' ? (
          <Text style={styles.symptomsTitle}>Prescription by Physician</Text>
        ) : (
          <Text style={styles.symptomsTitle}>Prescription</Text>
        )}
        <View style={styles.listContainer}>
          <Text style={styles.symptomsTitle}>1</Text>

          <Text style={[styles.symptomsText, {marginLeft: 10, top: -4}]}>
            {props.prescription}
          </Text>
        </View>
      </View>
      <View style={[styles.profileContainer, {marginTop: 10}]}>
        <Text style={styles.symptomsTitle}>Review From Patient</Text>
        <View style={styles.ratingContainer}>
          <RatingComp rating={props.rating} gap={10} size={40} />
        </View>
        <Text style={styles.symptomsText}>{props.patientReview}</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {paddingHorizontal: 10},
  profileContainer: {
    backgroundColor: Colors.backgroundColor,
    borderRadius: 15,
    padding: 20,
  },
  imageContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  image: {
    width: '25%',
    height: 80,
    borderRadius: 50,
  },
  title: {
    marginTop: 10,
    fontFamily: 'Roboto-Bold',
    fontSize: 22,
  },
  status: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#02D409',
  },
  symptomsContainer: {
    marginTop: 20,
  },
  symptomsTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
  symptomsText: {
    marginTop: 5,
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },
  treatmentContainer: {
    width: '50%',
    paddingHorizontal: 5,
  },
  checkListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContainer: {
    marginTop: 20,
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  ratingContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  costContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  costInnerContainer: {
    width: '32%',
    backgroundColor: '#F6F6F6',
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  costTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 13,
  },
  costSubTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 17,
    marginTop: 5,
  },
})
export default ServiceDetailsComp
