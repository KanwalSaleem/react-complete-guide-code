import React, {useState} from 'react'
import {View, TouchableOpacity, Text, StyleSheet, Alert} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DiagnosticChecklist from '../../components/DiagnosticChecklist'
import TreatmentPlan from '../../components/Physician/TreatmentPlan'
import {useSelector} from 'react-redux'

import Colors from '../../constants/Colors'
import {APIURL} from '../../constants/url'

const DiagnosticTreatmentPlan = (props) => {
  const token = useSelector((state) => state.auth.token)
  const [diagnosticList, setDiagnosticList] = useState([])
  const [step, setStep] = useState('diagnostic')
  const [prescriptionsList, setPrescriptionList] = useState([])
  const [loading, setLoading] = useState(false)

  const addDiagnosis = (diagnosis) => {
    setDiagnosticList((prev) => prev.concat(diagnosis))
  }
  const removeDiagnosis = (id) =>
    setDiagnosticList((prev) => prev.filter((diagnosis) => diagnosis.id !== id))

  const editDiagnosis = (id, updateDiagnosis) => {
    const updatedDiagnosticList = diagnosticList.map((diagnosis) => {
      if (diagnosis.id === id) {
        return {
          ...diagnosis,
          status: updateDiagnosis.status,
          message: updateDiagnosis.message,
        }
      }
      return diagnosis
    })

    setDiagnosticList(updatedDiagnosticList)
  }

  const addPrescription = (prescription) => {
    setPrescriptionList((prev) => prev.concat(prescription))
  }
  const removePrescription = (id) =>
    setPrescriptionList((prev) =>
      prev.filter((diagnosis) => diagnosis.id !== id),
    )

  const editPrescription = (id, updatePrescription) => {
    const updatedPrescriptionList = prescriptionsList.map((prescription) => {
      if (prescription.id === id) {
        return {
          ...prescription,

          message: updatePrescription.message,
        }
      }
      return prescription
    })

    setPrescriptionList(updatedPrescriptionList)
  }

  const sendChecklist = async () => {
    // console.log(props.route.params.id)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${token}`)

    const formData = new FormData()
    formData.append('request_id', props.route.params.id)
    const validDiagnosis = diagnosticList.map((diagnosis) => ({
      visit_status: diagnosis.status,
      message: diagnosis.message,
    }))
    const validPrescriptions = prescriptionsList.map((prescription) => ({
      message: prescription.message,
      visit_status: true,
    }))
    console.log(validDiagnosis)
    console.log(validPrescriptions)

    formData.append('diagnosis', JSON.stringify(validDiagnosis))
    formData.append('prescriptions', JSON.stringify(validPrescriptions))
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formData,
      redirect: 'follow',
    }
    setLoading(true)
    try {
      const response = await fetch(
        `${APIURL}/api/physician/request-checklist`,
        requestOptions,
      )
      const resData = await response.json()

      if (!response.ok) {
        console.log(resData)
        throw new Error(resData.message)
      }
      console.log(resData)
      if (!resData.success) {
        Alert.alert('Unsuccesful', resData.message)
        return
      }

      Alert.alert('Success', resData.message, [
        {
          onPress: () => props.navigation.navigate('home'),
        },
      ])

      console.log(resData)
    } catch (e) {
      Alert.alert('Error', e)
      console.log(e)
    }
    setLoading(false)
  }

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      title:
        step === 'diagnostic'
          ? 'Create Diagnostic Checklist'
          : 'Create treatment plan',
    })
  }, [props.navigation, step])
  return (
    <View style={styles.mainScreen}>
      {/* <View style={styles.topBarContainer}>
        <TouchableOpacity
          onPress={() => {
            step === 'diagnostic'
              ? props.navigation.goBack()
              : setStep('diagnostic')
          }}
          style={styles.iconView}>
          <Icon
            name="arrow-back-ios"
            color={Colors.backgroundColor}
            size={20}
          />
        </TouchableOpacity>
        <Text style={styles.title}>
          {step === 'diagnostic'
            ? 'Create Diagnostic Checklist'
            : 'Create treatment plan'}
        </Text>
        <Icon name="notifications" color={Colors.backgroundColor} size={30} />
      </View> */}
      {step === 'diagnostic' ? (
        <DiagnosticChecklist
          diagnosticList={diagnosticList}
          addDiagnosis={addDiagnosis}
          removeDiagnosis={removeDiagnosis}
          editDiagnosis={editDiagnosis}
          setStep={setStep}
        />
      ) : (
        <TreatmentPlan
          prescriptionsList={prescriptionsList}
          addPrescription={addPrescription}
          removePrescription={removePrescription}
          editPrescription={editPrescription}
          setStep={setStep}
          sendChecklist={sendChecklist}
          loading={loading}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingTop: 20,
  },
  topBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  iconView: {
    borderRadius: 100,
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 5,
    textAlign: 'center',
  },
  title: {
    color: Colors.backgroundColor,
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
  },
})

export default DiagnosticTreatmentPlan
