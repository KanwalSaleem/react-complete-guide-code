import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'react'
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
import GobackHeader from '../../components/GobackHeader'
import ServiceDetailsComp from '../../components/ServiceDetailsComp'
import {useSelector} from 'react-redux'

const PhysicianServiceDetails = ({route, navigation}) => {
  const token = useSelector((state) => state.auth.token)
  const id = route.params

  const [isLoading, setLoading] = useState(false)
  const [ServiceData, setServiceData] = useState([])

  const getServiceData = useCallback(async () => {
    setLoading(true)
    try {
      let base_url = 'http://fabent.co.in/public/api/physician/service-details'

      const headers = new Headers()

      headers.append('Authorization', `Bearer ${token}`)
      let uploadData = new FormData()

      uploadData.append('request_id', id)

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
        headers,
      })

      const responseData = await response.json()

      console.log(responseData)
      if (responseData.success === true) {
        setServiceData(responseData.data)
      }
    } catch (error) {
      Alert.alert(error.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    getServiceData()
  }, [getServiceData])

  return (
    <View style={styles.mainScreen}>
      <ServiceDetailsComp
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
export default PhysicianServiceDetails
