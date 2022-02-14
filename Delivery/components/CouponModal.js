import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {ActivityIndicator, Modal, Portal} from 'react-native-paper'
import colors from '../constants/colors'

const CouponModal = ({coupon, open, setCoupon, acceptCoupon, isLoading}) => {
  return (
    <Portal>
      <Modal
        contentContainerStyle={styles.modalContainer}
        visible={open}
        dismissable={true}
        onDismiss={() => setCoupon(null)}>
        <View style={styles.modalHeadingContainer}>
          <Text style={styles.modalHeading}>Coupon Details</Text>
        </View>
        <Text style={styles.subHeading}>Campaign Title</Text>
        <Text style={styles.value}>{coupon.title}</Text>
        <Text style={styles.subHeading}>Campaign Description</Text>
        <Text style={styles.value}>{coupon.description}</Text>
        <Text style={styles.subHeading}>Coupon Code</Text>
        <Text style={styles.value}>{coupon.code}</Text>
        <Text style={styles.subHeading}>Coupons Code Status</Text>
        <Text style={styles.value}>{coupon.status}</Text>
        <Text style={styles.subHeading}>Discount</Text>
        <Text style={styles.value}>{coupon.discount}</Text>
        <Text style={styles.subHeading}>Validity</Text>
        <Text style={styles.value}>{coupon.validity}</Text>
        <Text style={styles.subHeading}>Accept</Text>
        <Text style={styles.value}>
          {coupon.accept === true ? 'Yes' : 'No'}
        </Text>
        {isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <TouchableOpacity
            style={{marginTop: 10}}
            onPress={() => acceptCoupon()}>
            <Text style={{color: colors.blue, fontSize: 16}}>
              {coupon.accept === false
                ? `Accept this campaign`
                : 'Decline this campaign'}
            </Text>
          </TouchableOpacity>
        )}
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '80%',
    paddingVertical: 10,
    alignSelf: 'center',
    borderRadius: 10,
  },
  modalHeadingContainer: {
    borderBottomColor: '#aaa',
    borderBottomWidth: 2,
    width: '100%',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: colors.blue,
  },
  subHeading: {
    color: 'grey',
    fontFamily: 'Poppins-Regular',
  },
  value: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
  },
})
export default CouponModal
