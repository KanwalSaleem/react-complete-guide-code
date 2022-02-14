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

const DisputeResolution = ({navigation}) => {
  const {sendRequest, error, isLoading, clearError} = useHttpClient()
  const [disputes, setDisputes] = useState([])
  const goToDispute = (id) => navigation.navigate('orders/disputeSummary', {id})

  useEffect(() => {
    const getDisputes = async () => {
      try {
        const response = await sendRequest(
          'https://deliverypay.in/api/getDisputes?page=1&perPage=20&sort=createdAt&order=dsc',
        )

        const validDisputes = response.disputes.map((dispute) => ({
          id: dispute._id,
          issue: dispute.issue,
          raisedAt: moment(dispute.createdAt).format('DD MMM YYYY'),
          status: dispute.status,
          amount: dispute.amount,
        }))
        setDisputes(validDisputes)

        console.log(response)
        console.log(error)
      } catch (e) {
        e
      }
    }
    getDisputes()
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
          style={{backgroundColor: 'white'}}
          data={disputes}
          ListEmptyComponent={
            <View style={styles.emptyListView}>
              <Text style={styles.emptyListText}>There are no disputes</Text>
            </View>
          }
          keyExtractor={(item) => item.id}
          renderItem={(itemData) => (
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.orderItemContainer}
              onPress={goToDispute.bind(this, itemData.item.id)}>
              <Text style={styles.order}>
                {itemData.item?.id.substring(0, 10)}
              </Text>
              <Text style={styles.order}>{itemData.item.raisedAt}</Text>
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

export default DisputeResolution
