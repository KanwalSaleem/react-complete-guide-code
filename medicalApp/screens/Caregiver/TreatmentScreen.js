import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native'
import Colors from '../../constants/Colors'

import Icon from 'react-native-vector-icons/MaterialIcons'
import ServiceItem from '../../components/Caregiver/ServiceItems'
import AuthButton from '../../components/AuthButton'
import {APIURL} from '../../constants/url'
import {useSelector} from 'react-redux'
import {ActivityIndicator} from 'react-native-paper'

const TreatmentScreen = (props) => {
  const {data} = props.route.params
  // console.log(props.route.params)
  const [loading, setLoading] = useState(false)
  const [checklistOpen, setChecklistOpen] = useState(false)
  const [prescriptionOpen, setPrescriptionOpen] = useState(false)
  const token = useSelector((state) => state.auth.token)
  console.log(data.id)
  const doneTreatment = async () => {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)
    const formData = new FormData()
    formData.append('request_id', data.id)
    setLoading(true)
    try {
      const response = await fetch(`${APIURL}/api/care-giver/treatment-done`, {
        body: formData,
        headers,
        method: 'POST',
        redirect: 'follow',
      })
      const resData = await response.json()
      console.log(resData)

      if (!response.ok) {
        throw new Error(resData.message)
      }
      if (resData.success) {
        Alert.alert('Success', resData.message, [
          {
            onPress: () =>
              props.navigation.navigate('afterTreatment', {
                data,
              }),
          },
        ])
      }
      if (!resData.success) {
        Alert.alert('Unsuccesful', resData.message)
      }
    } catch (e) {
      Alert.alert(e.message)
    }
    setLoading(true)
  }

  return (
    <View style={styles.mainScreen}>
      {/* <GobackHeader title="Service Request" /> */}
      <ScrollView>
        <View style={styles.whiteContainer}>
          <View style={styles.infoContainer}>
            {data.patient.image ? (
              <Image
                source={{
                  uri: `${APIURL}/storage/uploads/${data.patient.image}`,
                }}
                style={{width: 70, height: 70, alignSelf: 'center'}}
              />
            ) : (
              <Image
                source={require('../../assets/broken.jpg')}
                style={{width: 70, height: 70, alignSelf: 'center'}}
              />
            )}

            <Text
              style={
                styles.name
              }>{`${data.patient.first_name} ${data.patient.last_name}`}</Text>
            <Text style={styles.address}>{data.address_line_1}</Text>
            <Text style={styles.address}>{data.postal_code}</Text>
            <Text style={styles.address}>{data.city}</Text>
          </View>
          <View style={styles.diseaseContainer}>
            <Image
              source={{uri: `${APIURL}/storage/uploads/${data.service.icon}`}}
              style={{width: 60, height: 60, borderRadius: 10}}
            />
            <Text style={[styles.name, {marginLeft: 20, fontSize: 21}]}>
              {data.service.title}
            </Text>
          </View>

          <Text style={styles.symptomsHeading}>Symptoms</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontFamily: 'Roboto-Regular', fontSize: 14}}>
              {data.symptomps}
            </Text>
          </View>
          <View style={styles.costsContainer}>
            <View style={styles.cost}>
              <Text style={styles.costHeading}>Service Cost</Text>
              <Text style={styles.costAmount}>${data.service.cost}</Text>
            </View>
            <View style={styles.cost}>
              <Text style={styles.costHeading}>Gas Charge</Text>
              <Text style={styles.costAmount}>${data.service.charge}</Text>
            </View>
            <View style={styles.cost}>
              <Text style={styles.costHeading}>Convenience</Text>
              <Text style={styles.costAmount}>${data.service.convenience}</Text>
            </View>
          </View>
          <View style={styles.noteContainer}>
            <Text style={styles.noteHeading}>Patient Note</Text>
            <Text style={styles.note}>{data.patient_note}</Text>
          </View>
        </View>
        <View style={[styles.whiteContainer, styles.whiteSecond]}>
          <View style={styles.doctorDetails}>
            <Image
              source={require('../../assets/broken.jpg')}
              style={{width: 55, height: 55}}
            />
            <View style={{marginLeft: 20}}>
              <Text
                style={
                  styles.name
                }>{`${data.physicain.first_name} ${data.physicain.last_name}`}</Text>
              <Text style={styles.address}>{`${data.physicain.email}`}</Text>
            </View>
          </View>
          <View style={styles.expansionHeader}>
            <Text style={styles.expansionHeading}>
              Physician diagnostic check list
            </Text>
            <TouchableOpacity onPress={() => setChecklistOpen((prev) => !prev)}>
              <Icon
                name={checklistOpen ? 'remove' : 'add'}
                size={30}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              display: checklistOpen ? 'flex' : 'none',
              borderBottomWidth: 0.5,
            }}>
            {data.checklist.diagnosis.map((item, index) => (
              <ServiceItem
                key={item.id}
                number={index + 1}
                message={item.message}
              />
            ))}
          </View>
          <View style={styles.expansionHeader}>
            <Text style={styles.expansionHeading}>
              Physician Prescription Notes
            </Text>
            <TouchableOpacity
              onPress={() => setPrescriptionOpen((prev) => !prev)}>
              <Icon
                name={prescriptionOpen ? 'remove' : 'add'}
                size={30}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <View style={{display: prescriptionOpen ? 'flex' : 'none'}}>
            {data.checklist.prescriptions.map((item, index) => (
              <ServiceItem
                key={Math.random(Math.random() * Math.random)}
                number={index + 1}
                message={item.message}
              />
            ))}
          </View>
        </View>
        {loading ? (
          <ActivityIndicator
            color={Colors.primary}
            style={{marginVertical: 15}}
          />
        ) : (
          <AuthButton style={styles.button} onPress={() => doneTreatment()}>
            Treatment Done
          </AuthButton>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: Colors.black,
    // paddingVertical: 20,
    paddingHorizontal: 10,
    // paddingBottom: 80,
  },
  whiteContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    paddingBottom: 30,
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
  },
  address: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
  },
  diseaseContainer: {flexDirection: 'row', marginTop: 20, alignItems: 'center'},
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
  noteContainer: {
    marginTop: 10,
  },
  noteHeading: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
  note: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },
  whiteSecond: {padding: 0, paddingTop: 20},
  doctorDetails: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
  },
  expansionHeader: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expansionHeading: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
  },
})

export default TreatmentScreen
