import React, {useEffect, useCallback, useState} from 'react'
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Calendar} from 'react-native-calendars'

import Colors from '../../constants/Colors'
import fetch from 'node-fetch'
import {useSelector} from 'react-redux'
import {APIURL} from '../../constants/url'

const colors = [
  '#ff69b4',
  '#a5bb68',
  '#7f0707',
  '#787a7d',
  '#898b89',
  '#ff1493',
  '#505e5a',
  '#45615e',
  '#ffd728',
  '#ff5ab3',
  '#7cbcff',
  '#ffc0cb',
  '#3cb371',
  '#233287',
  '#9983e9',
  '#dd93f5',
  '#a8e3f1',
  '#bb8bf4',
  '#2c2ba9',
  '#b3346c',
  '#ffe9f2',
  '#fef2f2',
  '#4169e1',
  '#8fbc8f',
  '#bc8f8f',
  '#ff8055',
  '#0dbadc',
  '#ffc0cb',
  '#c08000',
  '#804000',
  '#c08040',
  '#d5e8d1',
  '#ff69b4',
  '#c71585',
  '#ff1493',
  '#cc6633',
  '#0000cd',
  '#99e6ff',
  '#b3e6ff',
]

const Item = ({title, date, time, onPress, color}) => (
  <View style={styles.item}>
    <View style={styles.row1}>
      <Text
        style={{
          fontSize: 50,
          color,
          paddingLeft: 10,
          marginBottom: 10,
          top: -20,
        }}>
        .
      </Text>

      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.row2}>
        <TouchableOpacity
          disabled
          style={[styles.timered, {backgroundColor: color}]}
          activeOpacity={0.4}>
          <Text style={styles.time}>{time}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.status}
          activeOpacity={0.4}
          onPress={onPress}>
          <Icon
            style={styles.icon}
            name={'arrow-forward'}
            color="white"
            size={15}
          />
        </TouchableOpacity>
      </View>
    </View>
  </View>
)

const SheduleCalender = props => {
  const token = useSelector(state => state.auth.token)
  const [selected, setSelected] = useState('2021-08-4')
  const [vehicleList, setVehicleList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [dates, setDates] = useState()

  const fetchInspection = useCallback(
    async () => {
      // eslint-disable-next-line no-undef
      const headers = new Headers()

      headers.append('Accept', 'application/json')

      headers.append('Authorization', `Bearer ${token}`)

      const requestOptions = {
        method: 'GET',
        headers,
      }

      if (token) {
        try {
          const response = await fetch(
            `${APIURL}/api/inspection-by-calendar`,
            requestOptions,
          )
          const resData = await response.json()

          if (!response.ok) {
            throw new Error(resData.message)
          }

          const convertArrayToObject = () => {
            const initialValue = {}
            return resData.data.reduce((obj, item, index) => {
              return {
                ...obj,
                [item.date_of_mission]: {
                  marked: true,
                  dotColor: colors[index],
                },
              }
            }, initialValue)
          }

          const validDates = convertArrayToObject()
          console.log(validDates)
          setDates(validDates)
          const items = resData.data.map((item, index) => ({
            color: colors[index],
            time: item.time_slot,
            date: item.date_of_mission,
            id: item.id,
            status: item.status,
          }))
          setVehicleList(items)
        } catch (e) {
          Alert.alert('Error', e.message)
        }
        setIsLoading(false)
      }
    },
    [token],
  )

  useEffect(
    () => {
      const unsubscribe = props.navigation.addListener('focus', () => {
        // Screen was focused
        // Do something
        fetchInspection()
      })

      return unsubscribe
    },
    [fetchInspection, props.navigation],
  )
  return (
    <View style={{flex: 1}}>
      <Calendar
        onDayPress={day => setSelected(day.dateString)}
        markingType="custom"
        markedDates={{
          ...dates,
          [selected]: {
            selected: true,
            activeOpacity: 1,
            customStyles: {
              container: {
                borderRadius: 5,
                elevation: 5,
                height: 50,
                width: 50,
              },
              text: {
                fontSize: 20,
              },
            },
          },
        }}
        theme={{
          selectedDayBackgroundColor: Colors.secondGreen,
        }}
        monthFormat={'MMMM yyyy'}
        hideExtraDays={true}
        disableMonthChange={true}
        firstDay={1}
      />

      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Upcoming</Text>

        {isLoading ? (
          <View style={{flex: 1}}>
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            data={vehicleList}
            renderItem={({item}) => {
              return (
                <Item
                  title={'Vehicle Information'}
                  date={item.date}
                  time={item.time}
                  status={item.status}
                  color={item.color}
                  onPress={() =>
                    props.navigation.navigate('inspectionDetails', {
                      id: item.id,
                    })
                  }
                />
              )
            }}
            keyExtractor={item => item.id}
          />
        )}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    marginVertical: 5,
    marginTop: 30,
    marginLeft: 15,
    color: 'grey',
    marginBottom: 15,
    fontSize: 14,
    fontWeight: '400',
  },
  item: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 8,
    backgroundColor: 'white',
    marginHorizontal: 4,
    borderRadius: 5,
  },
  dotpink: {
    fontSize: 50,
    color: '#eb75e1',
    paddingLeft: 10,
    marginBottom: 10,
    top: -20,
  },
  dotred: {
    fontSize: 50,
    color: 'red',
    paddingLeft: 10,
    marginBottom: 10,
    top: -20,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 16,
    paddingRight: 45,
    fontWeight: '700',
  },
  date: {
    padding: 5,
    color: 'grey',
    fontWeight: '400',
    fontSize: 13,
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    paddingTop: 10,
    borderRadius: 2,
  },
  timepink: {
    backgroundColor: '#eb75e1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    paddingHorizontal: 5,
    marginVertical: 12,
  },
  timered: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    paddingHorizontal: 5,
    marginVertical: 12,
  },
  time: {
    color: 'white',
    fontSize: 13,
  },
  status: {
    marginLeft: 4,
    padding: 5,
    backgroundColor: 'black',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
})

export default SheduleCalender
