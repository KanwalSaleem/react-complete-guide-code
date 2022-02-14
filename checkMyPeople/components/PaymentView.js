import React from 'react'
import {Paystack} from 'react-native-paystack-webview'
import {View} from 'react-native'

function PaymentView(props) {
  return (
    <View style={{flex: 1}}>
      <Paystack
        paystackKey="pk_test_d9b608110f40b3befeb2fa1ff65b2a9b92cd2716"
        amount={String(props.amount)}
        billingEmail={props.email}
        activityIndicatorColor="green"
        onCancel={props.onCancel}
        onSuccess={props.onSuccess}
        autoStart={true}
      />
    </View>
  )
}

export default PaymentView
