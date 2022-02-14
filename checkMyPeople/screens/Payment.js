import React, {useContext, useEffect, useState} from 'react'
import {Paystack} from 'react-native-paystack-webview'
import {View, TouchableOpacity, Text} from 'react-native'
import {AuthContext} from '../context/Auth'
import {CommonActions} from '@react-navigation/native'
import uuid from 'react-native-uuid'
import CaspioUrl from '../constants/CaspioUrl'
import tables from '../constants/CaspioTableNames'

function Pay({route, navigation}) {
  const {user, authToken, setUser, setCart, updateUserProfile} =
    useContext(AuthContext)
  const [cancel, setCancel] = useState(true)

  const saveTransaction = () =>
    fetch(
      `${CaspioUrl}/rest/v2/tables/${tables.payments}/records?response=rows`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          Email: user.Email,
          AmountPaid: route.params.amount,
          OrderNumber: uuid.v4(),
          First_Name: user.First_Name,
          Last_Name: user.Last_Name,
        }),
      },
    )
      .then((res) => {
        return res.json()
      })
      .then((res) => res)
      .catch((e) => console.log(e))

  const paymenHandler = (e) => {
    setTimeout(() => {
      navigation.goBack()
    }, 3000)
  }

  return (
    <View style={{flex: 1}}>
      <Paystack
        paystackKey="pk_test_d9b608110f40b3befeb2fa1ff65b2a9b92cd2716"
        amount={String(route.params.amount)}
        billingEmail={user.Email}
        activityIndicatorColor="green"
        // onCancel={(e) => {
        //   // handle response here
        //   navigation.goBack()
        // }}
        onCancel={paymenHandler}
        onSuccess={(res) => {
          // saveTransaction()
          updateUserProfile({
            Account_Bal: user.Account_Bal + route.params.amount,
          })
            .then((res) => {
              console.log(res, 'akjjf9i432urijhn97u')
              setUser(res.Result[0])
              setCart(1000)
            })
            .catch((e) => console.log(e))
            .then(() =>
              saveTransaction().then(() =>
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      // {
                      //   name: user ? 'dashboard' : 'profile',
                      // },
                      {
                        name: 'dashboard',
                        params: {
                          replacedFromLicense: true,
                        },
                      },
                    ],
                  }),
                ),
              ),
            )

          // handle response here
        }}
        autoStart={true}
      />
    </View>
  )
}

export default Pay
