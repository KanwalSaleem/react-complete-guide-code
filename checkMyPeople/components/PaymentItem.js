import React from 'react'
import dayjs from 'dayjs'
import {StyleSheet} from 'react-native'
import Card from './Card'
import FieldInfo from './FieldInfo'

const PaymentItem = ({item, index}) => {
  return (
    <Card
      style={[
        styles.card,
        {marginBottom: 15},
        index === 0 && {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
      ]}>
      <FieldInfo
        style={styles.fieldContainer}
        title="Payment ID"
        text={item.paymentid}
      />
      <FieldInfo
        style={styles.fieldContainer}
        title="Email"
        text={item.Email}
      />
      <FieldInfo
        style={styles.fieldContainer}
        title="First Name"
        text={item.First_Name}
      />
      <FieldInfo
        style={styles.fieldContainer}
        title="Last Name"
        text={item.Last_Name}
      />
      <FieldInfo
        style={styles.fieldContainer}
        title="Order Number"
        text={item.OrderNumber}
      />
      <FieldInfo
        style={styles.fieldContainer}
        title="Amount Paid"
        text={item.AmountPaid}
      />
      <FieldInfo
        style={styles.fieldContainer}
        title="Payment Date"
        text={dayjs(item.PaymentDate).format('DD-MM-YYYY')}
      />
    </Card>
  )
}
const styles = StyleSheet.create({
  card: {
    width: '85%',
    padding: 10,
    paddingTop: 30,
    shadowRadius: 0,
    elevation: 2,
    alignSelf: 'center',
  },

  fieldContainer: {
    marginLeft: 10,
    marginBottom: 15,
  },
})

export default PaymentItem
