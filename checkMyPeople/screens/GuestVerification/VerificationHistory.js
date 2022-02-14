import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react'

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native'
import dayjs from 'dayjs'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {Modal, Portal, Button, Menu} from 'react-native-paper'
import ProgressDialog from '../../components/ProgressDialog'

import Colors from '../../constants/Colors'

import Icon from 'react-native-vector-icons/MaterialIcons'
import DateTimePicker from '@react-native-community/datetimepicker'
import VerificaionItemGuest from '../../components/VerificationItemGuest'
import {AuthContext} from '../../context/Auth'
import CaspioUrl from '../../constants/CaspioUrl'
import tables from '../../constants/CaspioTableNames'

const VerificationHistory = () => {
  const {authToken} = useContext(AuthContext)
  const [menuVisible, setMenuVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(new Date())

  const [showDate, setShowDate] = useState(false)
  const [results, setResults] = useState([])
  const [email, setEmail] = useState('')

  const closeMenu = () => setMenuVisible(false)
  const openMenu = () => setMenuVisible(true)

  const onDateChange = async (e, selectedDate) => {
    if (Platform.OS === 'ios') {
      try {
        setShowDate(Platform.OS === 'ios')
        if (selectedDate) {
          setDate(selectedDate)
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      if (selectedDate) {
        setShowDate(false)
        // console.log(dayjs(selectedDate).format('MM/DD/YYYY 00:00:00'))
        setDate(selectedDate)
        console.log(selectedDate)

        getDatabyDate(dayjs(selectedDate).format('MM/DD/YYYY 00:00:00'))
      } else {
        setShowDate(false)
      }
    }
  }

  const renderItem = ({item, index}) => (
    <VerificaionItemGuest item={item} index={index} />
  )

  const dateSelected = () => {
    setShowDate(false)
    // console.log(dayjs(selectedDate).format('MM/DD/YYYY 00:00:00'))

    // dayjs.max(dayjs(selectedDate), dayjs(selectedDate).add(1, 'days'))

    getDatabyDate(dayjs(date).format('MM/DD/YYYY 00:00:00'))
  }

  const sortByDescending = () => {
    const sortedArray = results.sort((a, b) => {
      return dayjs(b.DateVerified).unix() - dayjs(a.DateVerified).unix()
    })
    console.warn(sortedArray)
    setResults(sortedArray)
    setMenuVisible(false)
  }

  const sortByAscending = () => {
    const sortedArray = results.sort((a, b) => {
      return dayjs(a.DateVerified).unix() - dayjs(b.DateVerified).unix()
    })
    // console.warn(sortedArray)
    // console.log(dayjs(new Date()).unix())
    setResults(sortedArray)
    setMenuVisible(false)
  }

  // const sortByDescending = () => {

  //   const sortedArray = results.sort((a, b) => {
  //     console.log(a.DateVerified)
  //     if (dayjs(a.DateVerified).unix() > dayjs(b.DateVerified).unix()) {
  //       return 1
  //     } else {
  //       return 0
  //     }
  //   })
  //   // console.log(sortedArray)
  //   setResults(sortedArray)
  //   setMenuVisible(false)
  // }

  // const sortByAscending = () => {
  //   const sortedArray = results.sort((a, b) => {
  //     if (dayjs(a.DateVerified).unix() < dayjs(b.DateVerified).unix()) {
  //       return -1
  //     } else {
  //       return 0
  //     }
  //   })
  //   console.log(sortedArray)
  //   setResults(sortedArray)
  //   setMenuVisible(false)
  // }

  useEffect(() => {
    const getData = async () => {
      const guestEmail = await AsyncStorage.getItem('guestEmail')
      // await setEmail(guestEmail)
      setEmail(guestEmail)
      getVerigicationData(guestEmail)

      // if (guestEmail) {
      //   setLoading(true)
      //   fetch(
      //     `${CaspioUrl}/rest/v2/tables/${tables.ninVerify}/records?response=rows&q.where=Email='${email}'&q.pageSize=20`,
      //     {
      //       headers: {
      //         Authorization: `Bearer ${authToken}`,
      //       },
      //     },
      //   )
      //     .then((res) => res.json())
      //     .then((data) => {
      //       setLoading(false)
      //       setResults(data.Result)
      //       console.log('re', data)
      //     })
      //     .catch((e) => console.log(e))
      // } else {
      //   Alert.alert('', 'Please Verify to view Verification History.')
      // }
    }
    getData()
  }, [authToken, email, getVerigicationData])

  const getVerigicationData = useCallback(
    (guestEmail) => {
      if (guestEmail) {
        setLoading(true)
        fetch(
          `${CaspioUrl}/rest/v2/tables/${tables.ninVerify}/records?response=rows&q.where=Email='${guestEmail}'&q.pageSize=20`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        )
          .then((res) => res.json())
          .then((data) => {
            setLoading(false)
            setResults(data.Result)
            console.log('re', data)
          })
          .catch((e) => console.log(e))
      } else {
        Alert.alert('', 'Please Verify to view Verification History.')
      }
    },
    [authToken],
  )

  const getDatabyDate = useCallback(
    (date) => {
      setLoading(true)
      fetch(
        // `${CaspioUrl}/rest/v2/tables/${tables.ninVerify}/records?response=rows&q.where=DateVerified>='${date}'&q.where=Email='${email}'&q.pageSize=20`,
        `${CaspioUrl}/rest/v2/tables/${tables.ninVerify}/records?response=rows&q.where=Email='${email}'&q.where=DateVerified>='${date}'&q.pageSize=20`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )
        .then((res) => res.json())
        .then((data) => {
          setLoading(false)
          if (data.Result.length > 0) {
            const filteredResults = data.Result.filter(
              (item) =>
                dayjs(item.DateVerified).format('MM/DD/YYYY') ==
                dayjs(date).format('MM/DD/YYYY'),
            )
            if (filteredResults.length > 0) {
              console.log(data)
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
    },
    [authToken, email],
  )
  return (
    <View style={styles.screen}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          disabled={!email}
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
                disabled={!email}
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
                Verification History
              </Text>
            </View>
          )}
          <FlatList
            extraData={results}
            initialNumToRender={20}
            maxToRenderPerBatch={5}
            keyExtractor={(item) => item.PK_ID}
            style={{width: '100%'}}
            data={results}
            renderItem={renderItem}
          />
        </>
      )}

      {/* <TouchableOpacity
          activeOpacity={0.8}
          style={styles.expandButton}
          onPress={() => setDetailOpen((prev) => !prev)}>
          <Icon
            name={detailOpen ? 'expand-less' : 'more-horiz'}
            color="white"
            size={20}
          />
        </TouchableOpacity> */}

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
                display: showDate ? 'flex' : 'none',

                width: '100%',

                backgroundColor: 'white',
              }}>
              {showDate && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={'date'}
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

export default VerificationHistory
