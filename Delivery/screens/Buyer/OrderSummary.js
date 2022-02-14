import React, {useEffect, useState, useContext} from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  Image,
} from 'react-native'
import {CommonActions} from '@react-navigation/native'
import Header from '../../components/Header'
import BottomBar from '../../components/BottomBar'
import {useHttpClient} from '../../hooks/http-hook'
import {AppContext} from '../../context/auth'
import {ActivityIndicator} from 'react-native-paper'
import moment from 'moment'
import colors from '../../constants/colors'

const OrderSummary = ({navigation, route}) => {
  console.log(route.params)
  const {userType} = useContext(AppContext)
  const [order, setOrder] = useState()
  const {sendRequest, error, clearError, isLoading} = useHttpClient()

  // useEffect(() => {
  //   if (userType === 'seller') {
  //     navigation.dispatch(
  //       CommonActions.reset({
  //         index: 0,
  //         routes: [{name: 'home/chooseCategory'}],
  //       }),
  //     )
  //   }
  // }, [navigation, userType])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const response = await sendRequest(
          `https://deliverypay.in/api/singleOrder/?_id=${route.params.id}`,
        )
        console.log(response)
        setOrder(response.order)
        if (error) {
          Alert.alert('Error', error, [{onPress: () => clearError}])
        }
      } catch (e) {
        e
      }
    })
    return () => unsubscribe
  }, [clearError, navigation, route.params.id, sendRequest])

  const cancelOrder = async () => {
    try {
      const response = await fetch('https://deliverypay.in/api/cancelOrder', {
        method: 'PATCH',
        body: JSON.stringify({
          _id: route.params.id,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      const responseData = await response.json()
      console.log(responseData)
      if (!response.ok) {
        throw new Error(responseData.message)
      }
      Alert.alert('Success', responseData.message)
      navigation.setParams({
        cancellable: false,
      })
      navigation.navigate('orders/orderHistory')
    } catch (e) {
      Alert.alert('Error', e.message)
    }
  }
  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.screen}>
        {isLoading ? (
          <ActivityIndicator
            color={colors.primary}
            style={{flexGrow: 1, backgroundColor: 'white'}}
          />
        ) : (
          <>
            {route.params.cancellable == true && (
              <View style={{alignItems: 'flex-end', paddingRight: 10}}>
                <TouchableOpacity
                  onPress={cancelOrder}
                  activeOpacity={0.6}
                  style={{
                    backgroundColor: colors.purple,
                    height: 40,
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                    }}>
                    Cancel Order
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View>
              <Text style={styles.heading}>Order Summary</Text>
            </View>
            <View
            // style={{borderColor: '#ccc', borderWidth: 0.5, borderRadius: 10}}
            >
              <View style={styles.orderItem}>
                <Text style={styles.itemText}>Seller</Text>
                <View>
                  <Text style={styles.itemText}>
                    {order &&
                      `${order?.seller.firstName} ${order?.seller.lastName}`}
                  </Text>
                  <Text>{order && `${order?.seller.phone}`}</Text>
                </View>
              </View>
              <View style={styles.orderItem}>
                <Text style={styles.itemText}>Order ID</Text>

                <Text style={styles.itemText}>{order && order._id}</Text>
              </View>

              <View style={styles.orderItem}>
                <Text style={styles.itemText}>Status</Text>

                <Text style={styles.itemText}>{order && order.status}</Text>
              </View>
              <View style={styles.orderItem}>
                <Text style={styles.itemText}>Order Placed</Text>

                <Text style={styles.itemText}>
                  {order &&
                    moment(order.createdAt).format('DD MMM YYYY h:mm a')}
                </Text>
              </View>
              <View style={styles.orderItem}>
                <Text style={styles.itemText}>Note</Text>

                <Text style={styles.itemText}>{order && order.note}</Text>
              </View>
              <View style={styles.orderItem}>
                <Text style={styles.itemText}>Delivery Address</Text>

                <Text style={styles.itemText}>
                  {order && order.deliveryAddress}
                </Text>
              </View>
              <View style={styles.orderItem}>
                <Text style={styles.itemText}>Name</Text>

                <Text style={styles.itemText}>
                  {order && order.deliveryDetail.name}
                </Text>
              </View>
              <View style={styles.orderItem}>
                <Text style={styles.itemText}>Phone</Text>

                <Text style={styles.itemText}>
                  {order && order.deliveryDetail.phone}
                </Text>
              </View>
              <View style={styles.orderItem}>
                <Text style={styles.itemText}>Delivey Within</Text>

                <Text style={styles.itemText}>
                  {order && order.deliveryDetail.deliveryWithin}
                </Text>
              </View>
              <View>
                <Text style={styles.heading}>Products</Text>
              </View>
              {order &&
                order.products.map((product) => (
                  <View key={product.product._id}>
                    <View
                      style={[
                        styles.orderItem,
                        {marginTop: 0, alignItems: 'center'},
                      ]}>
                      <Text style={styles.itemText}>Name</Text>
                      <View
                        style={
                          {
                            // flexDirection: 'row',
                            // alignItems: 'flex-start',
                          }
                        }>
                        <Text style={styles.itemText}>
                          <Image
                            source={{
                              uri: 'https://cdn.deliverypay.in/file_1630826207688.jpg',
                              width: 60,
                              height: 60,
                            }}
                          />
                          {product.product.name}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.orderItem}>
                      <Text style={styles.itemText}>Quantiy</Text>

                      <Text style={styles.itemText}>{product.qty}</Text>
                    </View>
                    <View style={styles.orderItem}>
                      <Text style={styles.itemText}>Price</Text>
                      <View>
                        <Text>{`${product.product.price} x ${product.qty}`}</Text>
                        <Text style={styles.itemText}>
                          ₹{product.product.price * product.qty}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              <View style={styles.orderItem}>
                <Text style={styles.itemText}>Total</Text>

                <Text style={styles.itemText}>₹{order && order?.total}</Text>
              </View>
              <View style={styles.orderItem}>
                <Text style={styles.itemText}>Shipping</Text>

                <Text style={styles.itemText}>
                  ₹{order && order.shippingCost}
                </Text>
              </View>
              <View style={styles.orderItem}>
                <Text style={styles.itemText}>Delivery Pay fee 10%</Text>

                <Text style={styles.itemText}>₹{order && order.fee}</Text>
              </View>
              <View style={styles.orderItem}>
                <Text style={styles.itemText}>Grand Total</Text>

                <Text style={styles.itemText}>₹{order && order.total}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.heading}>Milestones</Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <Text style={styles.milestoneHeading}>Date</Text>
              <Text style={styles.milestoneHeading}>Description</Text>
              <Text style={styles.milestoneHeading}>Amount</Text>
              <Text style={styles.milestoneHeading}>Status</Text>
            </View>
            {order &&
              order.milestones.map((milestone) => (
                <View
                  key={milestone._id}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    borderWidth: 0.5,
                  }}>
                  <Text>
                    {moment(milestone.createdAt).format('DD MMM YYYY ')}
                  </Text>
                  <Text>{milestone.dscr}</Text>
                  <Text>₹{milestone.amount}</Text>
                  <Text>{milestone.status}</Text>
                </View>
              ))}
            <View>
              <Text style={styles.heading}>Return Policy Terms</Text>
            </View>
            <View style={{marginTop: 10}}>
              {order &&
                order.terms.map((term) => (
                  <View
                    key={term}
                    style={{
                      paddingHorizontal: 10,
                      marginTop: 10,
                    }}>
                    <Text style={{fontSize: 14, fontFamily: 'Poppins-Regular'}}>
                      {term}
                    </Text>
                  </View>
                ))}
            </View>
          </>
        )}
      </ScrollView>
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  heading: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  orderItem: {
    borderBottomColor: '#ccc',

    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  itemText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 17,
  },
  milestoneHeading: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
})

export default OrderSummary
