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
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../../constants/Colors'
import {useNavigation} from '@react-navigation/native'
import SwipeableRating from 'react-native-swipeable-rating'
import BottomBar from '../../components/BottomBar'
import ServiceHistory from '../../components/ServiceHistory'
import {useSelector} from 'react-redux'

const PhysicianServiceHistory = () => {
  const token = useSelector((state) => state.auth.token)
  const navigation = useNavigation()
  const [isLoading, setLoading] = useState(false)
  const [HistoryData, setHistoryData] = useState([])

  const getServiceHistory = useCallback(async () => {
    setLoading(true)
    try {
      let base_url = 'http://fabent.co.in/public/api/physician/services-history'

      const headers = new Headers()
      // headers.append('Authorization', `Bearer ${token}`)
      headers.append(
        'Authorization',
        `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNGU1OGYyY2MxNDU0ZGEzNmQ3Y2M1YjNjYTNkZDNhYjljNDI3MmEwNjlhODI3NGQ4Mzc2Y2Q4NzdlYTdmOTNlZjlhYjJhZmRmYjFmZjJkZDAiLCJpYXQiOjE2MzUxNTMxMjQuMjgzOTE1MDQyODc3MTk3MjY1NjI1LCJuYmYiOjE2MzUxNTMxMjQuMjgzOTIyOTEwNjkwMzA3NjE3MTg3NSwiZXhwIjoxNjY2Njg5MTI0LjA3NzY2Mzg5ODQ2ODAxNzU3ODEyNSwic3ViIjoiOTIiLCJzY29wZXMiOltdfQ.ZJf5KyyjfGKjalDKFHzCX0RcZIbHd-myXZFyCAg7xdr1WcncHFcznRs_Q7ldL03swkggaenlhYhDG8Qo1xw1sjvt8P_Wjn8c1oVQCgSZ2oUFN7EMGMF74hriWBE8ZNkVEUEHvRZrDsoVXxsRDCOLbuGaL2i7DE7JM3oVtz22G1hNPdMzs6xFMbHe6y_BBAaXq9vtys0123-iic9vdstxhtPZDaYxXXOHHklef5n9IKp4D-3GtCr0Y1VSwLIEeZeeURet3SNJQ20pVeeVRolUGhtwiYVIj8Q8nn9xbEd4XEwbPG8bz7vI_d9kJAyKCGfd2SaFydR2OoJtyTECU6ZSAkU9eX9VwXPK80iQPvUXpurIqwVQnjnzgdNZFyHHvePYNPh7x5LTlX8UGgG4QJM-Pd69eco2bHeoWa-Ug_Ac1EY_RvUFuXoZiVLJMH9jYXyXuP0o2dmMjlI2XgfvxPcGv1ddObEJd4Qfz9-OPzQqyiWjBAE_XcMybFvh3miwwJLpSqg9IyQo97C5sQH9ATBlT9NKjoo57JgFWeT21YrIgVXJjUNBuJ6aw-o_1VWfG49J9OZzqSI_w74LeCccte_crclPtEgZ5fbqmcLhB9gjAgM_ISbpKofFz4gXrzeq1Z2yaO6eRGq0u5dTvnG9bfzC1x9_6Qq-i9eu-SUI-tDS6dY`,
      )

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        headers,
      })

      const responseData = await response.json()

      if (responseData.success === true) {
        setHistoryData(responseData.data)
      }
    } catch (error) {
      Alert.alert(error.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    getServiceHistory()
  }, [getServiceHistory])

  return (
    <>
      <View style={styles.mainScreen}>
        <View style={styles.whiteContainer}>
          <ServiceHistory data={HistoryData} />
        </View>
      </View>
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flexGrow: 1,
    backgroundColor: Colors.black,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  whiteContainer: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 20,
    marginTop: 20,
    height: '89%',
  },
})
export default PhysicianServiceHistory
