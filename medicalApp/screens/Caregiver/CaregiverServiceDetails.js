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
import Colors from '../../constants/Colors'
import {useNavigation} from '@react-navigation/native'
import GobackHeader from '../../components/GobackHeader'
import ServiceDetailsComp from '../../components/ServiceDetailsComp'

const CareGiverServiceDetails = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.mainScreen}>
      <ServiceDetailsComp
        user="careGiver"
        image={require('../../assets/review.jpg')}
        name="Nathan Richmond"
        status="completed"
        symptoms="Chills, Chills,Chills,Fever, Fever"
        patientNote="Lorem Ipsum is simply dummy text of the printing and typesetting
                 industry. Lorem Ipsum has been the industrys standard dummy text
                eversince the 1500s, when an unknown printer took a galley of type
                andscrambled it to make a type specimen book."
        treatmentStart="10 Jult 2021 at 10:30 AM"
        treatmentEnd="10 Jult 2021 at 12:30 AM"
        diagnosticChecklist="Lorem Ipsum is simply dummy text of the printing and typesetting
                 industry. Lorem Ipsum has been the industrys standard dummy text
                 eversince the 1500s, when an unknown printer took a galley of type
                andscrambled it to make a type specimen book."
        prescription="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industrys standard dummy text
                 eversince the 1500s, when an unknown printer took a galley of type
                 andscrambled it to make a type specimen book."
        rating={4}
        patientReview="Lorem Ipsum is simply dummy text of the printing and typesetting
               industry. Lorem Ipsum has been the industrys standard dummy text
              eversince the 1500s, when an unknown printer took a galley of type
              andscrambled it to make a type specimen book."
        serviceCost="125"
        gasCharge="20"
        convenience="20"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingVertical: 20,
  },
})
export default CareGiverServiceDetails
