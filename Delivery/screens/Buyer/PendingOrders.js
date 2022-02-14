import React, {useEffect, useState} from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
} from 'react-native'
import {useFocusEffect} from '@react-navigation/native'
import BottomBar from '../../components/BottomBar'
import Header from '../../components/Header'
import {useHttpClient} from '../../hooks/http-hook'
import moment from 'moment'
import {ActivityIndicator} from 'react-native-paper'
import colors from '../../constants/colors'

const PendingOrders = ({navigation}) => {
  const {sendRequest, error, isLoading, clearError} = useHttpClient()
  const [orders, setOrders] = useState([])
  const goToOrder = (id) =>
    navigation.navigate('orders/summary', {
      id,
      cancellable: true,
    })

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await sendRequest(
          'https://deliverypay.in/api/getOrders?user=buyer&status=pending',
        )

        const validOrders = response.orders.map((order) => ({
          id: order._id,
          total: order.total,
          purchaseDate: moment(order.createdAt).format('DD MMM YYYY'),
          status: order.status,
        }))
        setOrders(validOrders)

        console.log(response)
        console.log(error)
      } catch (e) {
        e
      }
    }
    getOrders()
  }, [error, sendRequest])

  return (
    <>
      <Header />
      <View style={styles.orderItemContainer}>
        <Text style={styles.order}>Order</Text>
        <Text style={styles.order}>Purchase Date</Text>
        <Text style={styles.order}>Total</Text>
        <Text style={styles.order}>Status</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator
          color={colors.primary}
          style={{flexGrow: 1, backgroundColor: 'white'}}
        />
      ) : (
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={
            <View style={styles.emptyListView}>
              <Text style={styles.emptyListText}>
                There are no orders. How about starting adding some?
              </Text>
            </View>
          }
          style={{backgroundColor: 'white'}}
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={(itemData) => (
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.orderItemContainer}
              onPress={goToOrder.bind(this, itemData.item.id)}>
              <Text style={styles.order}>
                {itemData.item?.id.substring(0, 10)}
              </Text>
              <Text style={styles.order}>{itemData.item.purchaseDate}</Text>
              <Text style={styles.order}>₹{itemData.item.total}</Text>
              <Text style={styles.order}>{itemData.item.status}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  orderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',

    paddingVertical: 15,
  },
  order: {
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
})

export default PendingOrders
