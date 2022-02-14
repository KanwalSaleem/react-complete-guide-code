import React, {useContext} from 'react'
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useNavigation} from '@react-navigation/native'
import Svg, {Path} from 'react-native-svg'
import {AppContext} from '../context/auth'
import colors from '../constants/colors'

const Header = () => {
  const {user, userType, changeUserType, cart} = useContext(AppContext)
  const navigation = useNavigation()

  return (
    <>
      <SafeAreaView style={{backgroundColor: colors.commonBackgroundColor}} />
      <View style={styles.container}>
        <View style={styles.top}>
          <View style={styles.headingContainer}>
            <Image
              source={require('../assets/appHeadingIcon.png')}
              // style={{marginRight: 10}}
              style={{width: 50, height: 50, marginRight: 10}}
            />
            <View>
              <Text style={styles.heading}>Delivery</Text>
              <Text style={[styles.heading, {marginTop: -15}]}>PAY</Text>
            </View>
          </View>
          <View style={styles.userDetailContainer}>
            <View style={{marginRight: 10}}>
              <Text style={styles.name}>{user.firstName}</Text>
              <Text style={[styles.name, {marginTop: -5}]}>
                {user.lastName}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.personButton}
              activeOpacity={0.6}
              disabled={true}>
              <Icon name="person" color="#2699FB" size={30} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <View style={{flexGrow: 1, flexDirection: 'row'}}>
            <View style={styles.choiceContainer}>
              <TouchableOpacity
                onPress={() => changeUserType('buyer')}
                style={[
                  styles.choiceButton,
                  userType === 'buyer' && {
                    borderRadius: 50,
                    borderLeftWidth: 0.5,
                    backgroundColor: colors.purple,
                  },
                ]}>
                <Text
                  style={[
                    styles.inActiveText,
                    userType === 'buyer' && styles.activeText,
                  ]}>
                  Buyer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => changeUserType('seller')}
                style={[
                  styles.choiceButton,
                  userType === 'seller' && {
                    borderRadius: 50,

                    backgroundColor: colors.blue,
                  },
                ]}>
                <Text
                  style={[
                    styles.inActiveText,
                    userType === 'seller' && styles.activeText,
                  ]}>
                  Seller
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {userType === 'buyer' && (
            <TouchableOpacity onPress={() => navigation.navigate('cart')}>
              <Icon name="shopping-cart" color="grey" size={25} />
              {cart.items.length > 0 && (
                <Text
                  style={{
                    top: -15,
                    right: 5,
                    left: 5,
                    fontSize: 16,
                    position: 'absolute',
                    color: '#fff',
                    backgroundColor: colors.purple,
                    textAlign: 'center',
                    borderRadius: 20,
                  }}>
                  {cart.items.length}
                </Text>
              )}
            </TouchableOpacity>
          )}
          {/* <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search"
            placeholderTextColor="black"
            style={styles.input}
          />
          <TouchableOpacity activeOpacity={0.5}>
            <Icon name="settings-voice" color="#707070" size={25} />
          </TouchableOpacity>
        </View> */}
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.6}
            onPress={() => navigation.navigate('settings')}>
            {/* <Image
            source={require('../assets/settingsIcon2.png')}
            style={{width: 25, height: 25, top: 2}}
          /> */}
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              style={{top: 2}}
              viewBox="0 0 15.795 14.752">
              <Path
                id="Icon_ionic-ios-settings"
                data-name="Icon ionic-ios-settings"
                d="M18.991,11.874A1.907,1.907,0,0,1,20.3,10.1a7.257,7.257,0,0,0-.975-2.193,2.185,2.185,0,0,1-.827.165,2.111,2.111,0,0,1-1.436-.553,1.807,1.807,0,0,1-.42-2.112,8.355,8.355,0,0,0-2.345-.91,2.086,2.086,0,0,1-3.793,0,8.381,8.381,0,0,0-2.349.91,1.8,1.8,0,0,1-.42,2.112,2.144,2.144,0,0,1-2.262.388,7.415,7.415,0,0,0-.971,2.2,1.855,1.855,0,0,1,0,3.541,7.257,7.257,0,0,0,.975,2.193A2.176,2.176,0,0,1,6.3,15.68a2.111,2.111,0,0,1,1.436.553,1.808,1.808,0,0,1,.42,2.108,8.43,8.43,0,0,0,2.349.91,2.082,2.082,0,0,1,3.784,0,8.381,8.381,0,0,0,2.349-.91,1.809,1.809,0,0,1,.42-2.108,2.1,2.1,0,0,1,1.436-.553,2.16,2.16,0,0,1,.823.161,7.3,7.3,0,0,0,.975-2.193A1.915,1.915,0,0,1,18.991,11.874Zm-6.557,3.069A3.186,3.186,0,0,1,9.144,11.87,3.186,3.186,0,0,1,12.435,8.8a3.186,3.186,0,0,1,3.291,3.072A3.186,3.186,0,0,1,12.435,14.943Z"
                transform="translate(-4.5 -4.5)"
                fill="#707070"
                opacity="0.58"
              />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('contact')}
            style={styles.actionButton}
            activeOpacity={0.5}>
            <Image
              source={require('../assets/customerServiceIcon2.png')}
              style={{width: 30, height: 30, top: -5}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFF',
    // backgroundColor: 'grey',
    paddingHorizontal: 15,

    paddingBottom: 20,
  },
  top: {
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // textAlignVertical: 'center',
    paddingHorizontal: 10,
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  heading: {
    fontFamily: 'Poppins-BoldItalic',
    fontSize: 22,
    color: '#5ab1fc',
  },
  userDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  name: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#5ab1fc',
    // textAlignVertical: 'bottom',
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
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 10,

    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    // flexGrow: 1,
    width: 281,
    height: 45,
  },
  input: {
    flexGrow: 1,
    fontFamily: 'Poppins-Regular',
    textAlignVertical: 'center',
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 5,

    borderRadius: 50,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    elevation: 10,
    width: 40,
    height: 40,
    alignItems: 'center',

    marginHorizontal: 5,
  },

  choiceContainer: {
    flexDirection: 'row',
    // width: '78%',
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    elevation: 5,

    // flexGrow: 1,
  },
  activeText: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  inActiveText: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  choiceButton: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
})

export default Header
