import React, {useState, useEffect, useContext, useCallback} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  useWindowDimensions,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native'
import {BarChart} from 'react-native-chart-kit'
import RazorpayCheckout from 'react-native-razorpay'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useFocusEffect} from '@react-navigation/native'

import CreditCard from '../components/CreditCard'
import BottomBar from '../components/BottomBar'

import {useHttpClient} from '../hooks/http-hook'

import Colors from '../constants/colors'
import {AppContext} from '../context/auth'
import Svg, {G, Path} from 'react-native-svg'

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    {
      data: [
        75 * 10,
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        95 * 100,
      ],
      // color: '#ACC4FF',
    },
  ],
}

const Wallet = ({navigation: {navigate, addListener}}) => {
  const {user} = useContext(AppContext)

  const [money, setMoney] = useState()
  const [currentMethod, setCurrentMethod] = useState(0)
  const [withdraw, setWithdraw] = useState()
  const {sendRequest} = useHttpClient()
  const {sendRequest: withdrawRequest} = useHttpClient()
  const [chartData, setChartData] = useState()
  const {
    sendRequest: dashboardRequest,
    loading: dashboardLoading,
    error: dashboardError,
    clearError: clearDashboardError,
  } = useHttpClient()
  const [dashboardData, setDashboardData] = useState()
  const window = useWindowDimensions()

  const addMoney = async () => {
    const response = await sendRequest(
      'https://deliverypay.in/api/createAddMoneyOrder',
      'POST',
      JSON.stringify({
        amount: money,
      }),
      {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    )

    console.log(response.order.id)

    var options = {
      description: 'Never Pay Without Using Delivery pay',
      image: 'https://deliverypay.in/logo_sqr.jpg',
      currency: 'INR',
      key: 'rzp_live_99P71FzULLEPB7',
      amount: money,
      name: 'Delivery Pay',
      order_id: response.order.id, //Replace this with an order_id created using Orders API.
      prefill: {
        email: user.email,
        contact: user.userPhone,
        name: `${user.firstName} ${user.lastName}`,
      },
      theme: {color: '#2699FB'},
    }
    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        alert(`Success: ${data.razorpay_payment_id}`)
      })
      .catch((error) => {
        // handle failure
        // alert(`Error: ${error.code} | ${error.description}`)
        console.log(error)
      })
  }
  const handleWithdraw = async () => {
    const response = await withdrawRequest(
      'https://deliverypay.in/api/createAddMoneyOrder',
      'POST',
      JSON.stringify({
        amount: money,
      }),
      {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    )

    console.log(response.order.id)

    var options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_live_99P71FzULLEPB7',
      amount: withdraw,
      name: 'Acme Corp',
      order_id: response.order.id, //Replace this with an order_id created using Orders API.
      prefill: {
        email: 'gaurav.kumar@example.com',
        contact: '9191919191',
        name: 'Gaurav Kumar',
      },
      theme: {color: '#2699FB'},
    }
    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        alert(`Success: ${data.razorpay_payment_id}`)
      })
      .catch((error) => {
        // handle failure
        alert(`Error: ${error.code} | ${error.description}`)
      })
  }

  useFocusEffect(
    useCallback(() => {
      const unsubsribe = addListener('focus', async () => {
        try {
          const response = await dashboardRequest(
            'https://deliverypay.in/api/dashboardData',
          )

          setDashboardData(response)
          const barData = {labels: [], datasets: [{data: []}]}
          response.monthlyBalance.forEach((month) => {
            barData.labels.push(month._id)
            barData.datasets[0].data.push(month.balance)
          })
          console.log(barData)
          setChartData(barData)
        } catch (e) {
          console.log(e)
        }
      })

      return unsubsribe
    }, [addListener, dashboardRequest]),
  )

  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={10}
        style={{flex: 1}}>
        <ScrollView
          style={[
            styles.screen,
            {
              height:
                window.height < 700 ? window.height - 104 : window.height - 124,
            },
          ]}>
          <View style={styles.bluebackground}>
            <View style={styles.topRow}>
              <View style={styles.userInfoView}>
                <TouchableOpacity
                  style={styles.personButton}
                  activeOpacity={0.6}>
                  <Icon name="person" color="#2699FB" size={30} />
                </TouchableOpacity>
                <View style={styles.userTextContainer}>
                  <Text
                    style={[styles.userText, {fontFamily: 'Poppins-Light'}]}>
                    Hello
                  </Text>
                  <Text
                    style={
                      styles.userText
                    }>{`${user.firstName} ${user.lastName}`}</Text>
                </View>
              </View>
              <Icon name="person" color="#2699FB" size={30} />
            </View>
            <Text style={styles.heading}>Wallet Balance</Text>
            <Text style={styles.balance}>₹{user.balance.toFixed(0)}</Text>
          </View>
          <View style={styles.whiteBackground}>
            <View style={styles.paymentMethodContainer}>
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity onPress={() => navigate('paymentMethod')}>
                  <Image
                    source={require('../assets/addpayment.png')}
                    style={{width: 21, height: 21}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={currentMethod === 0}
                  onPress={() => setCurrentMethod((prev) => (prev -= 1))}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="31.818"
                    height="44.147"
                    viewBox="0 0 31.818 44.147">
                    <G
                      transform="matrix(1, 0, 0, 1, 0, 0)"
                      filter="url(#Path_217)">
                      <G
                        id="Path_217-2"
                        data-name="Path 217"
                        transform="translate(27.32 4.5) rotate(90)"
                        fill="#858585">
                        <Path
                          d="M 27.53220176696777 15.71776485443115 C 26.13888931274414 15.2262544631958 24.10462951660156 14.50919151306152 22.07958030700684 13.79734325408936 C 14.74783992767334 11.22007274627686 14.70039939880371 11.22007274627686 14.5736198425293 11.22007274627686 C 14.44684028625488 11.22007274627686 14.39939975738525 11.22007274627686 7.067659854888916 13.79734325408936 C 5.042610645294189 14.50919151306152 3.00835108757019 15.2262544631958 1.615038275718689 15.71776485443115 L 14.5736198425293 0.7635064125061035 L 27.53220176696777 15.71776485443115 Z"
                          stroke="none"></Path>
                        <Path
                          d="M 14.5736198425293 1.526998519897461 L 3.229276657104492 14.61841773986816 C 4.349065780639648 14.22377777099609 5.627307891845703 13.77366733551025 6.901840209960938 13.32564258575439 C 14.31408023834229 10.72007274627686 14.33368015289307 10.72007274627686 14.5736198425293 10.72007274627686 C 14.81355953216553 10.72007274627686 14.83315944671631 10.72007274627686 22.24539947509766 13.32564258575439 C 23.51993179321289 13.77366733551025 24.79817390441895 14.22377777099609 25.9179630279541 14.61841773986816 L 14.5736198425293 1.526998519897461 M 14.5736198425293 1.9073486328125e-06 L 29.14723968505859 16.81802368164063 C 29.14723968505859 16.81802368164063 14.71584987640381 11.72007274627686 14.5736198425293 11.72007274627686 C 14.43138980865479 11.72007274627686 0 16.81802368164063 0 16.81802368164063 L 14.5736198425293 1.9073486328125e-06 Z"
                          stroke="none"
                          fill="#858585"></Path>
                      </G>
                    </G>
                  </Svg>
                </TouchableOpacity>
              </View>
              <View style={{top: -20}}>
                {user.paymentMethods && (
                  <CreditCard
                    bank={user?.paymentMethods[currentMethod]?.bank}
                    name={user?.paymentMethods[currentMethod]?.name}
                    type={user?.paymentMethods[currentMethod]?.type}
                  />
                )}
              </View>
              <TouchableOpacity
                onPress={() => setCurrentMethod((prev) => (prev += 1))}
                disabled={currentMethod === [user.paymentMethods.length - 1]}>
                <Image
                  source={require('../assets/nextpayment.png')}
                  style={{width: 21, height: 21}}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.analytics}>Analytics</Text>

            <BarChart
              showValuesOnTopOfBars
              data={chartData ? chartData : data}
              width={400} // from react-native
              height={180}
              yAxisLabel="₹"
              yAxisSuffix="k"
              yAxisInterval={0} // optional, defaults to 1
              withInnerLines={false}
              // withCustomBarColorFromData={true}
              flatColor={true}
              withHorizontalLabels={false}
              showBarTops={false}
              chartConfig={{
                scrollableInfoSize: 10,
                backgroundColor: '#000',
                barPercentage: 0.7,
                horizontalLabelRotation: 20,
                barRadius: 10,
                // width: '100%',
                propsForHorizontalLabels: {
                  fontFamily: 'Poppins-Regular',
                },
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 2, // optional, defaults to 2dp

                color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                fillShadowGradient: '#ACC4FF',
                fillShadowGradientOpacity: 1,
                backgroundGradientFromOpacity: 1,
                backgroundGradientToOpacity: 1,

                style: {
                  borderRadius: 16,
                  borderColor: 'red',
                },

                propsForLabels: {
                  disabled: true,
                },
              }}
              // bezier
              style={{
                paddingRight: 10,
              }}
            />

            {/* Add Money View */}
            <View style={{...styles.moneyView, backgroundColor: '#e7f6fc'}}>
              <Text style={styles.moneyViewHeading}>Add Money</Text>
              <View style={styles.moneyActions}>
                <View style={styles.amountContainer}>
                  <Text style={styles.currencySybmol}>₹</Text>
                  <TextInput
                    value={money}
                    onChangeText={(value) => setMoney(value)}
                    placeholder="Enter Amount"
                    keyboardType={'number-pad'}
                    style={styles.amountInput}
                  />
                </View>
                <TouchableOpacity
                  style={{width: 82}}
                  activeOpacity={0.6}
                  onPress={addMoney}
                  disabled={!money}>
                  <LinearGradient
                    colors={['#0091FF', '#0A425D']}
                    style={styles.moneyProceedButton}>
                    <Text style={styles.proceedText}>Proceed</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            {/* Withdraw View */}
            {/* <View style={[styles.moneyView, {backgroundColor: '#f9eaf4'}]}>
              <Text style={styles.moneyViewHeading}>Withdraw</Text>
              <View style={styles.moneyActions}>
                <View style={styles.amountContainer}>
                  <Text style={styles.currencySybmol}>₹</Text>
                  <TextInput
                    value={withdraw}
                    onChangeText={(text) => setWithdraw(text)}
                    placeholder="Enter Amount"
                    keyboardType={'number-pad'}
                    style={styles.amountInput}
                  />
                </View>
                <TouchableOpacity
                  style={{width: 82}}
                  activeOpacity={0.6}
                  disabled={!withdraw}
                  onPress={handleWithdraw}>
                  <LinearGradient
                    colors={['#336CF9', '#F64BBD']}
                    start={{x: -1, y: 0}}
                    end={{x: 1, y: 3}}
                    style={styles.moneyProceedButton}>
                    <Text style={styles.proceedText}>Proceed</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View> */}
            <TouchableOpacity
              style={styles.transactionView}
              activeOpacity={0.4}
              onPress={() => navigate('wallet/history')}>
              <Text
                style={{
                  fontFamily: 'Poppins Regular',
                  fontSize: 18,
                }}>{`See all transaction history & Rewards `}</Text>
              <Image
                source={require('../assets/nextpayment.png')}
                style={{width: 21, height: 21}}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // paddingBottom: 30,
  },
  bluebackground: {
    // height: '35%',
    flex: 1,
    backgroundColor: Colors.lightBlue,
    paddingTop: 15,
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  whiteBackground: {
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    // borderWidth: 10,
    backgroundColor: 'white',
    top: -20,

    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'flex-start',
  },
  userInfoView: {
    flexDirection: 'row',
  },
  personButton: {
    backgroundColor: '#fff',
    // padding: 10,
    borderRadius: 50,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    elevation: 10,
    width: 47,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userTextContainer: {
    marginLeft: 10,
  },
  userText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  heading: {
    fontFamily: 'Poppins-Light',
    fontSize: 24,
    marginTop: 20,
  },
  balance: {
    fontFamily: 'Poppins-Regular',
    fontSize: 40,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  analytics: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    marginRight: 20,
    alignSelf: 'flex-end',
    marginVertical: 10,
  },
  moneyView: {
    width: '70%',
    height: 165,
    alignSelf: 'center',
    borderRadius: 30,
    padding: 20,

    marginTop: 20,
  },
  moneyViewHeading: {
    fontFamily: 'Poppins-Regular',
    fontSize: 23,
    marginLeft: 30,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySybmol: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  amountInput: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    flexBasis: '60%',
  },
  moneyActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  moneyProceedButton: {
    // paddingVertical: 10,
    height: 35,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedText: {
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    fontSize: 14,
  },
  transactionView: {
    marginTop: 20,
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
})

export default Wallet
