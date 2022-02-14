/* eslint-disable no-constant-condition */
import React, {useContext} from 'react'
import {
  Image,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native'
import Svg, {G, Rect, Path, Line} from 'react-native-svg'

import {useRoute, useNavigation} from '@react-navigation/native'

import {AppContext} from '../context/auth'
import colors from '../constants/colors'
import Icon from 'react-native-vector-icons/MaterialIcons'

const BottomBar = (props) => {
  const {userType} = useContext(AppContext)
  const window = useWindowDimensions()
  const navigation = useNavigation()
  const route = useRoute()

  const buttonOnHeight = {
    width: window.height < 700 ? 37 : 47,
    height: window.height < 700 ? 33 : 44,
  }
  return (
    <View
      style={[
        {...styles.container, ...props.style},
        {
          height: window.height < 700 ? 80 : 100,
          // top: window.height < 700 ? window.height - 100 : window.height - 120,
          // bottom: 0,
        },
      ]}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('home/chooseCategory')}
          style={[
            route.name.includes('home')
              ? {
                  ...styles.activeButton,
                  backgroundColor:
                    userType === 'buyer' ? colors.purple : colors.blue,
                }
              : styles.personButton,

            buttonOnHeight,
          ]}
          activeOpacity={0.7}>
          {route.name.includes('home') ? (
            <Svg
              id="Layer_2"
              data-name="Layer 2"
              xmlns="http://www.w3.org/2000/svg"
              width="15.157"
              height="15.266"
              viewBox="0 0 15.157 15.266">
              <G id="Layer_1" data-name="Layer 1">
                <Path
                  id="Path_287"
                  data-name="Path 287"
                  d="M14.976,7.44a.773.773,0,0,0-.057-1.071L8.142.2a.822.822,0,0,0-1.1,0L.242,6.7A.769.769,0,0,0,.209,7.767l.172.183A.724.724,0,0,0,1.4,8.03l.507-.472v6.927a.755.755,0,0,0,.74.769H5.3a.755.755,0,0,0,.74-.769V9.641H9.405v4.845a.744.744,0,0,0,.188.54.687.687,0,0,0,.507.229h2.82a.755.755,0,0,0,.74-.769V7.644l.315.285c.172.157.535.03.817-.285Z"
                  transform="translate(-0.008 0.011)"
                  fill="#f8faff"
                />
              </G>
            </Svg>
          ) : (
            // <Image source={require('../assets/homeactive.png')} />
            <Svg
              id="Layer_2"
              data-name="Layer 2"
              xmlns="http://www.w3.org/2000/svg"
              width="15.157"
              height="15.266"
              viewBox="0 0 15.157 15.266">
              <G id="Layer_1" data-name="Layer 1">
                <Path
                  id="Path_287"
                  data-name="Path 287"
                  d="M14.976,7.44a.773.773,0,0,0-.057-1.071L8.142.2a.822.822,0,0,0-1.1,0L.242,6.7A.769.769,0,0,0,.209,7.767l.172.183A.724.724,0,0,0,1.4,8.03l.507-.472v6.927a.755.755,0,0,0,.74.769H5.3a.755.755,0,0,0,.74-.769V9.641H9.405v4.845a.744.744,0,0,0,.188.54.687.687,0,0,0,.507.229h2.82a.755.755,0,0,0,.74-.769V7.644l.315.285c.172.157.535.03.817-.285Z"
                  transform="translate(-0.008 0.011)"
                  fill="#53aefc"
                />
              </G>
            </Svg>
            // <Image source={require('../assets/homeIcon.png')} />
          )}
        </TouchableOpacity>
        <Text style={styles.iconText}>Home</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('deal')}
          style={[
            route.name === 'deal' || route.name === 'chat'
              ? {
                  ...styles.activeButton,
                  backgroundColor:
                    userType === 'buyer' ? colors.purple : colors.blue,
                }
              : styles.personButton,
            buttonOnHeight,
          ]}
          activeOpacity={0.7}>
          {route.name === 'deal' || route.name === 'chat' ? (
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="17.426"
              height="20.811"
              viewBox="0 0 17.426 20.811">
              <Path
                id="Path_1939"
                data-name="Path 1939"
                d="M-246.666-186.17H-255.2l17.426-8.9-2.791,20.811-3.63-8.778-1.4,3.862v-5.267l5.027-7.549h1.536"
                transform="translate(255.198 195.071)"
                fill="#f8faff"
              />
            </Svg>
          ) : (
            // <Image source={require('../assets/dealActive.png')} />
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="17.426"
              height="20.811"
              viewBox="0 0 17.426 20.811">
              <Path
                id="Path_1939"
                data-name="Path 1939"
                d="M-246.666-186.17H-255.2l17.426-8.9-2.791,20.811-3.63-8.778-1.4,3.862v-5.267l5.027-7.549h1.536"
                transform="translate(255.198 195.071)"
                fill="#2699fb"
              />
            </Svg>

            // <Image source={require('../assets/sendIcon.png')} />
          )}
        </TouchableOpacity>
        <Text style={styles.iconText}>Chats</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('wallet')}
          style={[
            route.name.includes('wallet')
              ? {
                  ...styles.activeButton,
                  backgroundColor:
                    userType === 'buyer' ? colors.purple : colors.blue,
                }
              : styles.personButton,
            buttonOnHeight,
          ]}
          activeOpacity={0.7}>
          {route.name.includes('wallet') ? (
            <Svg
              id="Group_348"
              data-name="Group 348"
              xmlns="http://www.w3.org/2000/svg"
              width="15.678"
              height="15.674"
              viewBox="0 0 15.678 15.674">
              <G
                id="Rectangle_2"
                data-name="Rectangle 2"
                fill="none"
                stroke="#f8faff"
                stroke-width="2">
                <Rect width="15.678" height="10.085" rx="2" stroke="none" />
                <Rect
                  x="1"
                  y="1"
                  width="13.678"
                  height="8.085"
                  rx="1"
                  fill="none"
                />
              </G>
              <G
                id="Rectangle_3"
                data-name="Rectangle 3"
                transform="translate(0 4.662)"
                fill="none"
                stroke="#f8faff"
                stroke-width="2">
                <Rect width="15.678" height="6.962" rx="2" stroke="none" />
                <Rect
                  x="1"
                  y="1"
                  width="13.678"
                  height="4.962"
                  rx="1"
                  fill="none"
                />
              </G>
              <Path
                id="Path_2"
                data-name="Path 2"
                d="M-180.174-182v7.923l4.1-4.653,3.932,4.653V-182Z"
                transform="translate(183.996 189.068)"
                fill="#f8faff"
                stroke="#f8faff"
                stroke-width="0.5"
              />
            </Svg>
          ) : (
            <Svg
              id="Group_348"
              data-name="Group 348"
              xmlns="http://www.w3.org/2000/svg"
              width="15.678"
              height="15.674"
              viewBox="0 0 15.678 15.674">
              <G
                id="Rectangle_2"
                data-name="Rectangle 2"
                fill="none"
                stroke="#2699fb"
                stroke-width="2">
                <Rect width="15.678" height="10.085" rx="2" stroke="none" />
                <Rect
                  x="1"
                  y="1"
                  width="13.678"
                  height="8.085"
                  rx="1"
                  fill="none"
                />
              </G>
              <G
                id="Rectangle_3"
                data-name="Rectangle 3"
                transform="translate(0 4.662)"
                fill="none"
                stroke="#2699fb"
                stroke-width="2">
                <Rect width="15.678" height="6.962" rx="2" stroke="none" />
                <Rect
                  x="1"
                  y="1"
                  width="13.678"
                  height="4.962"
                  rx="1"
                  fill="none"
                />
              </G>
              <Path
                id="Path_2"
                data-name="Path 2"
                d="M-180.174-182v7.923l4.1-4.653,3.932,4.653V-182Z"
                transform="translate(183.996 189.068)"
                fill="#2699fb"
                stroke="#2699fb"
                stroke-width="0.5"
              />
            </Svg>
            // <Image source={require('../assets/walletIcon.png')} />
          )}
        </TouchableOpacity>
        <Text style={styles.iconText}>Account</Text>
      </View>
      <View style={styles.buttonContainer}>
        {userType === 'buyer' ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('orders/myOrders')}
            style={[
              route.name.includes('orders')
                ? {
                    ...styles.activeButton,
                    backgroundColor:
                      userType === 'buyer' ? colors.purple : colors.blue,
                  }
                : styles.personButton,
              buttonOnHeight,
            ]}
            activeOpacity={0.7}>
            {route.name.includes('orders') ? (
              // <Image source={require('../assets/transactionActive.png')} />
              <Svg
                id="Group_14"
                data-name="Group 14"
                xmlns="http://www.w3.org/2000/svg"
                width="23.125"
                height="19.502"
                viewBox="0 0 23.125 19.502">
                <G id="Group_6" data-name="Group 6">
                  <G
                    id="Path_4"
                    data-name="Path 4"
                    transform="translate(3)"
                    fill="none">
                    <Path
                      d="M10.062,0A9.91,9.91,0,0,1,20.125,9.751,9.91,9.91,0,0,1,10.062,19.5,9.91,9.91,0,0,1,0,9.751,9.91,9.91,0,0,1,10.062,0Z"
                      stroke="none"
                    />
                    <Path
                      d="M 10.06241989135742 2.000003814697266 C 5.616789817810059 2.000003814697266 2 5.477024078369141 2 9.750864028930664 C 2 14.02470397949219 5.616789817810059 17.50172424316406 10.06241989135742 17.50172424316406 C 14.50804996490479 17.50172424316406 18.12483978271484 14.02470397949219 18.12483978271484 9.750864028930664 C 18.12483978271484 5.477024078369141 14.50804996490479 2.000003814697266 10.06241989135742 2.000003814697266 M 10.06241989135742 3.814697265625e-06 C 15.6197395324707 3.814697265625e-06 20.12483978271484 4.36561393737793 20.12483978271484 9.750864028930664 C 20.12483978271484 15.1361141204834 15.6197395324707 19.50172424316406 10.06241989135742 19.50172424316406 C 4.505100250244141 19.50172424316406 0 15.1361141204834 0 9.750864028930664 C 0 4.36561393737793 4.505100250244141 3.814697265625e-06 10.06241989135742 3.814697265625e-06 Z"
                      stroke="none"
                      fill="#f8faff"
                    />
                  </G>
                  <G
                    id="Polygon_1"
                    data-name="Polygon 1"
                    transform="translate(6.001 10.744) rotate(-150)"
                    fill="#fff">
                    <Path
                      d="M 4.929044723510742 3.619362831115723 L 2.000004529953003 3.619362831115723 L 3.464524507522583 1.666669487953186 L 4.929044723510742 3.619362831115723 Z"
                      stroke="none"
                    />
                    <Path
                      d="M 3.464524507522583 2.86102294921875e-06 L 6.929044723510742 4.619362831115723 L 4.291534423828125e-06 4.619362831115723 L 3.464524507522583 2.86102294921875e-06 Z"
                      stroke="none"
                      fill="#f8faff"
                    />
                  </G>
                  <G
                    id="Rectangle_4"
                    data-name="Rectangle 4"
                    transform="translate(0 8.907) rotate(-22)"
                    fill="#336cf9"
                    stroke="#f8faff"
                    stroke-width="1">
                    <Rect width="6.929" height="4.619" stroke="none" />
                    <Rect
                      x="0.5"
                      y="0.5"
                      width="5.929"
                      height="3.619"
                      fill="none"
                    />
                  </G>
                  <G
                    id="Group_5"
                    data-name="Group 5"
                    transform="translate(11.842 2.805)">
                    <Line
                      id="Line_3"
                      data-name="Line 3"
                      y2="9.239"
                      transform="translate(0 0)"
                      fill="none"
                      stroke="#f8faff"
                      stroke-width="2"
                    />
                    <Line
                      id="Line_4"
                      data-name="Line 4"
                      x2="6.929"
                      y2="2.31"
                      transform="translate(0 9.239)"
                      fill="none"
                      stroke="#f8faff"
                      stroke-width="2"
                    />
                  </G>
                </G>
              </Svg>
            ) : (
              <Svg
                id="Group_14"
                data-name="Group 14"
                xmlns="http://www.w3.org/2000/svg"
                width="23.125"
                height="19.502"
                viewBox="0 0 23.125 19.502">
                <G id="Group_6" data-name="Group 6">
                  <G
                    id="Path_4"
                    data-name="Path 4"
                    transform="translate(3)"
                    fill="none">
                    <Path
                      d="M10.062,0A9.91,9.91,0,0,1,20.125,9.751,9.91,9.91,0,0,1,10.062,19.5,9.91,9.91,0,0,1,0,9.751,9.91,9.91,0,0,1,10.062,0Z"
                      stroke="none"
                    />
                    <Path
                      d="M 10.06241989135742 2.000003814697266 C 5.616789817810059 2.000003814697266 2 5.477024078369141 2 9.750864028930664 C 2 14.02470397949219 5.616789817810059 17.50172424316406 10.06241989135742 17.50172424316406 C 14.50804996490479 17.50172424316406 18.12483978271484 14.02470397949219 18.12483978271484 9.750864028930664 C 18.12483978271484 5.477024078369141 14.50804996490479 2.000003814697266 10.06241989135742 2.000003814697266 M 10.06241989135742 3.814697265625e-06 C 15.6197395324707 3.814697265625e-06 20.12483978271484 4.36561393737793 20.12483978271484 9.750864028930664 C 20.12483978271484 15.1361141204834 15.6197395324707 19.50172424316406 10.06241989135742 19.50172424316406 C 4.505100250244141 19.50172424316406 0 15.1361141204834 0 9.750864028930664 C 0 4.36561393737793 4.505100250244141 3.814697265625e-06 10.06241989135742 3.814697265625e-06 Z"
                      stroke="none"
                      fill="#2699fb"
                    />
                  </G>
                  <G
                    id="Polygon_1"
                    data-name="Polygon 1"
                    transform="translate(6.001 10.744) rotate(-150)"
                    fill="#fff">
                    <Path
                      d="M 4.929044723510742 3.619362831115723 L 2.000004529953003 3.619362831115723 L 3.464524507522583 1.666669487953186 L 4.929044723510742 3.619362831115723 Z"
                      stroke="none"
                    />
                    <Path
                      d="M 3.464524507522583 2.86102294921875e-06 L 6.929044723510742 4.619362831115723 L 4.291534423828125e-06 4.619362831115723 L 3.464524507522583 2.86102294921875e-06 Z"
                      stroke="none"
                      fill="#2699fb"
                    />
                  </G>
                  <G
                    id="Rectangle_4"
                    data-name="Rectangle 4"
                    transform="translate(0 8.907) rotate(-22)"
                    fill="#336cf9"
                    stroke="#2699fb"
                    stroke-width="1">
                    <Rect width="6.929" height="4.619" stroke="none" />
                    <Rect
                      x="0.5"
                      y="0.5"
                      width="5.929"
                      height="3.619"
                      fill="none"
                    />
                  </G>
                  <G
                    id="Group_5"
                    data-name="Group 5"
                    transform="translate(11.842 2.805)">
                    <Line
                      id="Line_3"
                      data-name="Line 3"
                      y2="9.239"
                      transform="translate(0 0)"
                      fill="none"
                      stroke="#2699fb"
                      stroke-width="2"
                    />
                    <Line
                      id="Line_4"
                      data-name="Line 4"
                      x2="6.929"
                      y2="2.31"
                      transform="translate(0 9.239)"
                      fill="none"
                      stroke="#2699fb"
                      stroke-width="2"
                    />
                  </G>
                </G>
              </Svg>

              // <Image source={require('../assets/transactionIcon.png')} />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('shop/myShop')}
            style={[
              route.name.includes('shop')
                ? {
                    ...styles.activeButton,
                    backgroundColor:
                      userType === 'buyer' ? colors.purple : colors.blue,
                  }
                : styles.personButton,
              buttonOnHeight,
            ]}
            activeOpacity={0.7}>
            {route.name.includes('shop') ? (
              <>
                <Icon name="card-travel" size={20} color="#fff" />
              </>
            ) : (
              <Icon name="card-travel" size={20} color="#2699FB" />
            )}
          </TouchableOpacity>
        )}
        <Text style={styles.iconText}>
          {userType === 'buyer' ? 'My Orders' : 'My Shop'}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('hold')}
          style={[
            route.name === 'hold'
              ? {
                  ...styles.activeButton,
                  backgroundColor:
                    userType === 'buyer' ? colors.purple : colors.blue,
                }
              : styles.personButton,
            buttonOnHeight,
          ]}
          activeOpacity={0.7}>
          {route.name === 'hold' ? (
            // <Image source={require('../assets/holdactive.png')} />

            <Svg
              id="Group_339"
              data-name="Group 339"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="23.473"
              viewBox="0 0 16 23.473">
              <G id="Group_166" data-name="Group 166">
                <G
                  id="Rectangle_1132"
                  data-name="Rectangle 1132"
                  transform="translate(0 8.473)"
                  fill="none"
                  stroke="#f8faff"
                  stroke-width="2">
                  <Rect width="16" height="15" rx="4" stroke="none" />
                  <Rect x="1" y="1" width="14" height="13" rx="3" fill="none" />
                </G>
                <G
                  id="Rectangle_1133"
                  data-name="Rectangle 1133"
                  transform="translate(2.5)"
                  fill="none"
                  stroke="#f8faff"
                  stroke-width="2">
                  <Path
                    d="M5.5,0h0A5.5,5.5,0,0,1,11,5.5V11a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V5.5A5.5,5.5,0,0,1,5.5,0Z"
                    stroke="none"
                  />

                  <Path
                    d="M5.5,1h0A4.5,4.5,0,0,1,10,5.5V9.357A.643.643,0,0,1,9.357,10H1.643A.643.643,0,0,1,1,9.357V5.5A4.5,4.5,0,0,1,5.5,1Z"
                    fill="none"
                  />
                </G>
              </G>
            </Svg>
          ) : (
            <Svg
              id="Group_339"
              data-name="Group 339"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="23.473"
              viewBox="0 0 16 23.473">
              <G id="Group_166" data-name="Group 166">
                <G
                  id="Rectangle_1132"
                  data-name="Rectangle 1132"
                  transform="translate(0 8.473)"
                  fill="none"
                  stroke="#53aefc"
                  stroke-width="2">
                  <Rect width="16" height="15" rx="4" stroke="none" />
                  <Rect x="1" y="1" width="14" height="13" rx="3" fill="none" />
                </G>
                <G
                  id="Rectangle_1133"
                  data-name="Rectangle 1133"
                  transform="translate(2.5)"
                  fill="none"
                  stroke="#53aefc"
                  stroke-width="2">
                  <Path
                    d="M5.5,0h0A5.5,5.5,0,0,1,11,5.5V11a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V5.5A5.5,5.5,0,0,1,5.5,0Z"
                    stroke="none"
                  />
                  <Path
                    d="M5.5,1h0A4.5,4.5,0,0,1,10,5.5V9.357A.643.643,0,0,1,9.357,10H1.643A.643.643,0,0,1,1,9.357V5.5A4.5,4.5,0,0,1,5.5,1Z"
                    fill="none"
                  />
                </G>
              </G>
            </Svg>
            // <Image source={require('../assets/holdIcon.png')} />
          )}
        </TouchableOpacity>
        <Text style={styles.iconText}>Milestones</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#5ab1fc',
    width: '100%',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
    backgroundColor: 'white',
    overflow: 'hidden',
    // position: 'absolute',

    // bottom: 0,
    // zIndex: -1,
  },
  buttonContainer: {
    alignItems: 'center',
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
  activeButton: {
    backgroundColor: '#5ab1fc',

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
  iconText: {fontFamily: 'Poppins-Light', marginTop: 10},
})

export default BottomBar
