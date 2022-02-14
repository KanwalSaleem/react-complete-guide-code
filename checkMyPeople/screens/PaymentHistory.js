import React, {useContext, useEffect, useState, useCallback} from 'react'

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList,
  Alert,
} from 'react-native'
import {Portal, Modal, Button, Menu} from 'react-native-paper'
import dayjs from 'dayjs'
import ProgressDialog from '../components/ProgressDialog'
import Card from '../components/Card'

import Colors from '../constants/Colors'

import Icon from 'react-native-vector-icons/MaterialIcons'
import DateTimePicker from '@react-native-community/datetimepicker'
import PaymentItem from '../components/PaymentItem'
import {AuthContext} from '../context/Auth'
import CaspioUrl from '../constants/CaspioUrl'
import tables from '../constants/CaspioTableNames'

const PaymentHistory = () => {
  const [date, setDate] = useState(new Date())
  const [formatedDate, setFormatedDate] = useState()
  const [menuVisible, setMenuVisible] = useState(false)
  const [showDate, setShowDate] = useState(false)
  const [results, setResults] = useState([])

  const [loading, setLoading] = useState(false)
  const {authToken, user} = useContext(AuthContext)

  const renderItem = ({item, index}) => (
    <PaymentItem item={item} index={index} />
  )

  const closeMenu = () => setMenuVisible(false)
  const openMenu = () => setMenuVisible(true)

  const onDateChange = (e, selectedDate) => {
    if (Platform.OS === 'ios') {
      try {
        setShowDate(true)
        if (selectedDate) {
          setDate(selectedDate)
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      if (selectedDate) {
        setShowDate(false)
        setDate(selectedDate)
        setFormatedDate(dayjs(selectedDate).format('MM/DD/YYYY 00:00:00'))
        getDatabyDate(dayjs(selectedDate).format('MM/DD/YYYY 00:00:00'))
      } else {
        setShowDate(false)
      }
    }
  }
  const dateSelected = () => {
    setShowDate(false)

    setFormatedDate(dayjs(date).format('MM/DD/YYYY'))
    getDatabyDate(dayjs(date).format('MM/DD/YYYY 00:00:00'))
  }

  const getDatabyDate = useCallback((date) => {
    setLoading(true)
    fetch(
      // `${CaspioUrl}/rest/v2/tables/${tables.payments}/records?response=rows&q.where=PaymentDate>='${date}'&q.where=Email='${user.Email}'&q.pageSize=20`,
      `${CaspioUrl}/rest/v2/tables/${tables.payments}/records?response=rows&q.where=Email='${user.Email}'&q.where=PaymentDate>='${date}'&q.pageSize=20`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => {
        setLoading(false)
        console.log('d', data)
        if (data.Result.length > 0) {
          const filteredResults = data.Result.filter(
            (item) =>
              dayjs(item.PaymentDate).format('MM/DD/YYYY') ==
              dayjs(date).format('MM/DD/YYYY'),
          )
          console.log(filteredResults, 'filtered')
          if (filteredResults.length > 0) {
            // console.log(data)

            setResults(filteredResults)
          } else {
            Alert.alert('No Results found')
            setResults([])
          }
        } else {
          Alert.alert('No Results found')
          setResults([])
        }
      })
      .catch((e) => console.log(e))
  }, [])
  const sortByDescending = () => {
    const sortedArray = results.sort((a, b) => {
      return dayjs(b.PaymentDate).unix() - dayjs(a.PaymentDate).unix()
    })
    console.warn(sortedArray)
    setResults(sortedArray)
    setMenuVisible(false)
  }

  const sortByAscending = () => {
    const sortedArray = results.sort((a, b) => {
      return dayjs(a.PaymentDate).unix() - dayjs(b.PaymentDate).unix()
    })
    // console.warn(sortedArray)
    // console.log(dayjs(new Date()).unix())
    setResults(sortedArray)
    setMenuVisible(false)
  }

  // const sortByDescending = () => {
  //   const sortedArray = results.sort((a, b) => b.AmountPaid - a.AmountPaid)
  //   console.log(sortedArray)
  //   setResults(sortedArray)
  //   setMenuVisible(false)
  // }

  // const sortByAscending = () => {
  //   const sortedArray = results.sort((a, b) => a.AmountPaid - b.AmountPaid)
  //   console.log(sortedArray)
  //   setResults(sortedArray)
  //   setMenuVisible(false)
  // }

  useEffect(() => {
    setLoading(true)
    fetch(
      `${CaspioUrl}/rest/v2/tables/${tables.payments}/records?response=rows&q.where=Email='${user.Email}'&q.pageSize=20`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => {
        // setLoading(false)
        setResults(data.Result)
        console.log(data)
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false))
  }, [])
  return (
    <View style={styles.screen}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.sortButton, {flexGrow: 0.5}]}
          onPress={() => setShowDate(true)}>
          <Text style={styles.sortText} allowFontScaling={false}>
            Date
          </Text>
          <Icon name="expand-more" color="white" size={20} />
        </TouchableOpacity>
        <View>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            contentStyle={{marginTop: 40}}
            anchor={
              <TouchableOpacity
                style={[styles.sortButton]}
                onPress={openMenu}
                activeOpacity={0.6}>
                <Text
                  style={[styles.sortText, {marginHorizontal: 30}]}
                  allowFontScaling={false}>
                  Sort by
                </Text>
                <Icon name="expand-more" color="white" size={20} />
              </TouchableOpacity>
            }>
            <Menu.Item onPress={sortByAscending} title="Ascending" />
            <Menu.Item onPress={sortByDescending} title="Descending" />
          </Menu>
        </View>
      </View>
      {loading ? (
        <ProgressDialog loading={loading} />
      ) : (
        <>
          {results.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.blueHeading} allowFontScaling={false}>
                Payment
              </Text>
            </View>
          )}
          <FlatList
            initialNumToRender={20}
            maxToRenderPerBatch={5}
            keyExtractor={(item) => item.PK_ID}
            style={{width: '100%'}}
            data={results}
            renderItem={renderItem}
          />
        </>
      )}

      {showDate && (
        <Portal>
          <Modal
            // transparent={true}
            visible={showDate}
            dismissable={true}
            onDismiss={() => setShowDate(false)}
            contentContainerStyle={{width: '100%'}}>
            <SafeAreaView
              style={{
                // flex: 1,
                display: showDate ? 'flex' : 'none',
                // flexDirection: 'row',
                width: '100%',
                // flexGrow:1,
                backgroundColor: 'white',
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}>
              {showDate && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={'date'}
                  textColor="black"
                  is24Hour={true}
                  display={Platform.OS === 'android' ? 'default' : 'spinner'}
                  onChange={onDateChange}
                  shouldRasterizeIOS={true}
                  style={{backgroundColor: 'white', width: '100%'}}
                />
              )}
              {Platform.OS === 'ios' && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignSelf: 'flex-end',
                    marginBottom: 10,
                  }}>
                  <Button mode="text" onPress={() => setShowDate(false)}>
                    Cancel
                  </Button>
                  <Button mode="text" onPress={dateSelected}>
                    OK
                  </Button>
                </View>
              )}
            </SafeAreaView>
          </Modal>
        </Portal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: '32%',
  },
  card: {
    width: '85%',
    padding: 10,
    paddingTop: 30,
    backgroundColor: 'white',
    borderRadius: 10,

    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  blueHeading: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
    marginBottom: 10,
    marginLeft: 10,
  },
  button: {
    marginTop: 20,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
  },
  expandButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    alignSelf: 'center',
    position: 'absolute',
    bottom: -20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  sortButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortText: {
    color: 'white',
    fontFamily: 'Inter-Regular',
    alignSelf: 'center',
    marginLeft: 20,
  },
})

export default PaymentHistory
