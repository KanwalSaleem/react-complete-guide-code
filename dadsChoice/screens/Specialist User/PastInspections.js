import React, {useCallback, useEffect, useState} from 'react'
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  StatusBar,
  RefreshControl,
  View,
  ActivityIndicator,
  Alert,
  Text,
} from 'react-native'
import {useSelector} from 'react-redux'
import fetch from 'node-fetch'

import Item from '../Individual User/HomeItems'
import Colors from '../../constants/Colors'
import {APIURL} from '../../constants/url'

const PastInpections = (props) => {
  const token = useSelector((state) => state.auth.token)
  const {vehicleInformation} = useSelector((state) => state.language)

  const [refreshing, setRefreshing] = useState(false)

  const [loading, setLoading] = useState(false)
  const [inspections, setInspections] = useState([])

  const getInspections = useCallback(
    async () => {
      // eslint-disable-next-line no-undef
      const headers = new Headers()

      headers.append('Accept', 'application/json')

      headers.append('Authorization', `Bearer ${token}`)

      const requestOptions = {
        method: 'GET',
        headers,
      }
      try {
        setLoading(true)
        const response = await fetch(
          `${APIURL}/api/inspections`,
          requestOptions,
        )
        setRefreshing(false)

        const resData = await response.json()

        if (!response.ok) {
          throw new Error(resData.message)
        }
        const validData = resData.data.map((item) => ({
          title: vehicleInformation,
          subtitle: item.vehicle_announcement,
          date: item.date_of_mission,
          time: item.time_slot,
          status: item.status,
          id: item.id,
        }))
        setInspections(validData)

        // eslint-disable-next-line no-undef
      } catch (e) {
        Alert.alert('Error', e.message)
        throw new Error(e.message)
      }
      setLoading(false)
    },
    [vehicleInformation, token],
  )

  useEffect(
    () => {
      const unsubscribe = props.navigation.addListener('focus', () => {
        // Screen was focused
        // Do something
        getInspections()
      })

      return unsubscribe
    },
    [getInspections, props.navigation],
  )
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator color={Colors.primary} size={'large'} />
        </View>
      ) : (
        <>
          {inspections.length === 0 ? (
            <Text
              style={{
                fontSize: 22,
                textAlignVertical: 'center',
                // textAlign: 'center',
                padding: 10,
              }}>
              There are no Inpections. How about start adding some ?
            </Text>
          ) : (
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={getInspections}
                />
              }
              data={inspections}
              renderItem={(itemData) => (
                <Item
                  onPress={() => {}}
                  title={'Vehicle Information'}
                  subtitle={itemData.item.subtitle}
                  date={itemData.item.date}
                  time={itemData.item.time}
                  status={itemData.item.status}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
})
export default PastInpections
