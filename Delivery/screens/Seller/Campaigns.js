import React, {useCallback, useEffect, useState} from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native'
import {Picker} from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/MaterialIcons'

import BottomBar from '../../components/BottomBar'
import Header from '../../components/Header'
import {useHttpClient} from '../../hooks/http-hook'
import moment from 'moment'
import {DatePickerModal} from 'react-native-paper-dates'
import {ActivityIndicator} from 'react-native-paper'
import colors from '../../constants/colors'
import CouponModal from '../../components/CouponModal'
import CommonSearch from '../../components/CommonSearch'

const Campaigns = ({navigation}) => {
  const window = useWindowDimensions()
  const {sendRequest, error, isLoading, clearError} = useHttpClient()
  const [loading, setLoading] = useState(false)
  const [coupon, setCoupon] = useState()
  const [campaigns, setCampaigns] = useState([])
  const goToOrder = (id) => navigation.navigate('orders/summary', {id})
  const [date, setDate] = useState()
  const [displayedDate] = useState(moment())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [range, setRange] = useState()

  const getCoupons = useCallback(async () => {
    const startDate = moment(range?.startDate).format('YYYY-MM-DD')
    const endDate = moment(range?.endDate).format('YYYY-MM-DD')
    setLoading(true)

    try {
      const response = await fetch(
        `https://deliverypay.in/api/getCoupons?${new URLSearchParams({
          user: 'seller',
          ...(search && {q: search}),

          ...(range && {
            dateFrom: startDate,
            dateTo: endDate,
          }),
          ...(status && {status}),
        })}`,
      )
      const resData = await response.json()
      if (!response.ok) {
        throw new Error(resData.message)
      }

      console.log(resData.coupons, 'coupons')
      const validOrders = resData.coupons.map((coupon) => ({
        id: coupon._id,
        title: coupon.title,
        date: moment(coupon.createdAt).format('DD MMM YYYY'),
        code: coupon.code,
        discount: coupon.amount,
        maxDiscount: coupon.maxDiscount,
        threshold: coupon.threshold,
        accept: coupon.accept,
        status: coupon.status,
        validity: `${moment(coupon.date.to).format('DD MMM YYYY')}-${moment(
          coupon.date.from,
        ).format('DD MMM YYYY')}`,
      }))
      console.log(validOrders)
      setCampaigns(validOrders)
    } catch (e) {
      alert('Error', e.message)
    }
    setLoading(false)
  }, [range, search, status])

  useEffect(() => {
    getCoupons()
  }, [getCoupons])

  const acceptCoupon = async () => {
    try {
      console.log(coupon)

      const response = await sendRequest(
        `https://deliverypay.in/api/declineCoupon`,
        'POST',
        JSON.stringify({
          _id: coupon.id,
        }),
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      )
      if (error) {
        return Alert.alert('Error', error, [{onPress: () => clearError()}])
      }
      Alert.alert('Success', 'Coupon Activated')
      setCoupon((prev) => ({...prev, accept: true}))
      getCoupons()

      console.log(response)
    } catch (e) {
      e
    }
  }
  const declineCoupon = async () => {
    try {
      console.log(coupon)

      const response = await sendRequest(
        `https://deliverypay.in/api/declineCoupon`,
        'POST',
        JSON.stringify({
          _id: coupon.id,
        }),
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      )
      if (error) {
        return Alert.alert('Error', error, [{onPress: () => clearError()}])
      }
      Alert.alert('Success', 'Coupon Disabled')

      setCoupon((prev) => ({...prev, accept: false}))
      getCoupons()

      console.log(response)
    } catch (e) {
      e
    }
  }
  const onDismiss = React.useCallback(() => {
    setCalendarOpen(false)
  }, [setCalendarOpen])

  const onConfirm = React.useCallback(({startDate, endDate}) => {
    setCalendarOpen(false)
    setRange({startDate, endDate})

    // params.append('dateFrom', moment(startDate).format('YYYY-DD-MM'))
    // params.append('dateTo', moment(endDate).format('YYYY-DD-MM'))
    // dateFrom=2021-09-02&dateTo=2021-09-26
  }, [])

  return (
    <>
      {coupon && (
        <CouponModal
          open={!!coupon}
          coupon={coupon}
          setCoupon={setCoupon}
          acceptCoupon={coupon?.accept === false ? acceptCoupon : declineCoupon}
          isLoading={isLoading}
        />
      )}
      <DatePickerModal
        disablecategoryBar
        animationType="slide"
        locale={'en'}
        mode="range"
        visible={calendarOpen}
        onDismiss={onDismiss}
        startDate={range?.startDate}
        endDate={range?.endDate}
        onConfirm={onConfirm}
      />
      <KeyboardAvoidingView style={{flexGrow: 1}}>
        <Header />
        <View
          style={{
            flexDirection: 'row',
            // alignItems: 'center',
            justifyContent: 'space-around',
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}>
          <CommonSearch
            style={{borderRadius: 10, width: '80%', marginTop: 0}}
          />
          <TouchableOpacity onPress={() => setCalendarOpen(true)}>
            <Icon name="calendar-today" color={colors.blue} size={30} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '80%',
            alignSelf: 'center',
            marginBottom: 10,
          }}>
          <Picker
            style={{
              backgroundColor: '#fff',
              borderRadius: 30,
            }}
            mode="dropdown"
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}>
            {['pending', 'active', 'inactive'].map((status) => (
              <Picker.Item key={status} value={status} label={status} />
            ))}
          </Picker>
        </View>

        {isLoading ? (
          <ActivityIndicator
            color={colors.primary}
            style={{flexGrow: 1, backgroundColor: 'white'}}
          />
        ) : (
          <FlatList
            contentContainerStyle={{
              flexGrow: 1,
              height:
                window.height < 700 ? window.height - 500 : window.height - 500,
            }}
            ListEmptyComponent={
              <View style={styles.emptyListView}>
                <Text style={styles.emptyListText}>
                  There are no campaigns available.
                </Text>
              </View>
            }
            data={campaigns}
            keyExtractor={(item) => item.id}
            renderItem={(itemData) => (
              <TouchableOpacity
                style={styles.itemContainer}
                activeOpacity={0.6}
                onPress={() => setCoupon(itemData.item)}>
                <View style={styles.orderItemContainer}>
                  <View>
                    <Text style={styles.order}>Date</Text>
                    <Text style={styles.order}>{itemData.item.date}</Text>
                  </View>
                  <View>
                    <Text style={styles.order}>Title</Text>
                    <Text style={styles.order}>{itemData.item.title}</Text>
                  </View>
                  <View>
                    <Text style={styles.order}>Status</Text>
                    <Text style={styles.order}>{itemData.item.status}</Text>
                  </View>

                  <View>
                    <Text style={styles.order}>Code</Text>
                    <Text style={styles.order}>{itemData.item.code}</Text>
                  </View>
                </View>
                <View style={styles.orderItemContainer}>
                  <View>
                    <Text style={styles.order}>Discount</Text>

                    <Text style={styles.order}>
                      {`${itemData.item.discount}%`}
                    </Text>
                    <Text style={{fontSize: 12, textAlign: 'center'}}>
                      {`Up To ₹${itemData.item.maxDiscount}`}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.order}>Threshold</Text>
                    <Text style={styles.order}>{itemData.item.threshold}</Text>
                  </View>
                  <View>
                    <Text style={styles.order}>Validity</Text>
                    <Text style={[styles.order, {fontSize: 14}]}>
                      {itemData.item.validity}
                    </Text>
                  </View>

                  <View>
                    <Text style={styles.order}>Accept</Text>
                    <Text style={styles.order}>
                      {itemData.item.accept === true ? 'Yes' : 'No'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        {/* </ScrollView> */}
        <BottomBar />
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  orderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',

    paddingVertical: 15,
  },
  order: {
    marginHorizontal: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyListView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: '#BCE0FD',
    width: '100%',
    elevation: 5,
    marginTop: 10,
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    borderRadius: 10,
  },
})

export default Campaigns
