import React, {useCallback, useEffect, useState} from 'react'
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native'
import {useSelector} from 'react-redux'
import fetch from 'node-fetch'
import Item from './OurTeamItems'

import {APIURL} from '../constants/url'
import Colors from '../constants/Colors'

const OurTeamIndividual = () => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [teamList, setTeamList] = useState([])
  const token = useSelector((state) => state.auth.token)

  const fetchTeamMembers = useCallback(
    async () => {
      // eslint-disable-next-line no-undef
      const headers = new Headers()

      headers.append('Accept', 'application/json')
      headers.append('Authorization', `Bearer ${token}`)
      var requestOptions = {
        method: 'GET',
        headers,
        redirect: 'follow',
      }

      try {
        setLoading(true)
        const response = await fetch(
          `${APIURL}/api/team-members`,
          requestOptions,
        )

        const resData = await response.json()

        if (!response.ok) {
          throw new Error(resData.message)
        }

        const teamMembers = resData.data.map((item) => ({
          id: item.id,
          name: item.name,
          designation: item.designation,
          image: item.img,
        }))

        setTeamList(teamMembers)
      } catch (e) {
        setError(e.message)
      }
      setLoading(false)
    },
    [token],
  )

  useEffect(
    () => {
      fetchTeamMembers()
    },
    [fetchTeamMembers],
  )

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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Lorem Ipsum is simply</Text>
      {loading ? (
        <ActivityIndicator color={Colors.primary} size="large" />
      ) : (
        <FlatList
          data={teamList}
          renderItem={(itemData) => (
            <Item
              title={itemData.item.name}
              subtitle={itemData.item.designation}
              image={itemData.item.image}
            />
          )}
          numColumns={2}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 60,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
})

export default OurTeamIndividual
