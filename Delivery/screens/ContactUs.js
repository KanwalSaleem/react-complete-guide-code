import React, {useState, useContext} from 'react'
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  useWindowDimensions,
  Linking,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import BottomBar from '../components/BottomBar'
import {AppContext} from '../context/auth'
import {useHttpClient} from '../hooks/http-hook'

const ContactUs = (props) => {
  const {logout, userType} = useContext(AppContext)
  const [queries, setQueries] = useState('')
  const window = useWindowDimensions()
  const {sendRequest, error} = useHttpClient()

  const searchQueries = async (text) => {
    try {
      const response = await sendRequest(
        `https://deliverypay.in/api/faq?audience=${userType}&q=${text}`,
      )
      console.log(response)
    } catch (e) {
      e
    }
  }

  return (
    <>
      <KeyboardAvoidingView keyboardVerticalOffset={1} behavior={'position'}>
        <ScrollView
          style={[styles.screen, {height: window.height < 700 ? 580 : 650}]}>
          <View style={styles.headerContainer}>
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
            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.6}
                onPress={logout}>
                <Image
                  source={require('../assets/logoutIcon.png')}
                  style={{width: 40, height: 30}}
                />
              </TouchableOpacity>
              <Text style={styles.actionText}>Log Out</Text>
            </View>
          </View>

          {/* <ScrollView style={{marginBottom: 10}}> */}
          <View style={styles.contactImage}>
            <Image
              source={require('../assets/contact1.png')}
              style={{width: 90, height: 90}}
            />
            <Text style={styles.contactHeading}>Contact us for Support</Text>
          </View>
          <View style={styles.fieldsContainer}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => Linking.openURL('tel:+123 456 789 234')}>
              <View style={styles.fieldsView}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../assets/Phone.png')}
                    style={{width: 16, height: 16}}
                  />
                  <View style={styles.fieldsTextView}>
                    <Text style={styles.fieldsText}>+123 456 789 234</Text>
                    <Text style={styles.fieldsText}>Call</Text>
                  </View>
                </View>
                <Image
                  source={require('../assets/arrowForward.png')}
                  style={{width: 10, height: 10}}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() =>
                Linking.openURL('mailto:DelieveryPaycustomer@gmail.com')
              }>
              <View style={styles.fieldsView}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../assets/mail.png')}
                    style={{width: 16, height: 16}}
                  />
                  <View style={styles.fieldsTextView}>
                    <Text style={styles.fieldsText}>
                      DelieveryPaycustomer@gmail.com
                    </Text>
                    <Text style={styles.fieldsText}>Mail</Text>
                  </View>
                </View>
                <Image
                  source={require('../assets/arrowForward.png')}
                  style={{width: 10, height: 10}}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => Linking.openURL('sms:+123 456 789 234')}>
              <View style={styles.fieldsView}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../assets/message.png')}
                    style={{width: 16, height: 16}}
                  />
                  <View style={styles.fieldsTextView}>
                    <Text style={styles.fieldsText}>+123 456 789 234</Text>
                    <Text style={styles.fieldsText}>Message</Text>
                  </View>
                </View>
                <Image
                  source={require('../assets/arrowForward.png')}
                  style={{width: 10, height: 10}}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.fieldsView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../assets/direction.png')}
                  style={{width: 16, height: 16}}
                />
                <View style={styles.fieldsTextView}>
                  <Text style={styles.fieldsText}>
                    497 Evergreen Rd. Roseville…
                  </Text>
                  <Text style={styles.fieldsText}>Direction</Text>
                </View>
              </View>
              <Image
                source={require('../assets/arrowForward.png')}
                style={{width: 10, height: 10}}
              />
            </View>
          </View>
          <View style={styles.mapView}>
            <Image
              source={require('../assets/map.png')}
              style={{width: '70%', height: 250}}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="search" color="#707070" size={25} />
            <TextInput
              placeholder={'Search Ur Queries'}
              style={styles.input}
              placeholderTextColor="#707070"
              // value={queries}
              onChangeText={searchQueries}
            />
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.inputButton}
              onPress={() => props.navigation.navigate('tickets')}>
              <Text style={styles.inputButtonText}>My Tickets</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.shareContainer}>
            <View style={styles.iconContainer}>
              <View style={styles.shareIcon}>
                <Icon
                  style={{paddingHorizontal: 15}}
                  name="thumb-up-off-alt"
                  color="red"
                  size={40}
                />
                <Icon
                  style={{paddingHorizontal: 15}}
                  name="share"
                  color="red"
                  size={40}
                />
              </View>
            </View>
            <View style={styles.shareTextContainer}>
              <Text style={styles.shareText}>
                Share to Your Friends and get 50/- Rs. cashback on your wallet
              </Text>
            </View>
          </View>
          {/* </ScrollView> */}
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    // flex: 1,
  },
  headerContainer: {
    backgroundColor: '#F8FAFF',
    // backgroundColor: 'grey',
    paddingHorizontal: 15,
    // paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  actionsContainer: {
    // flexDirection: 'row',
    // marginTop: 10,
    // justifyContent: 'flex-end',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 40,
    paddingBottom: 20,
  },
  actionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#53AEFC',
    paddingTop: 10,
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
  contactImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#0D0E0F',
  },
  fieldsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fieldsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  fieldsTextView: {
    paddingLeft: 10,
  },
  fieldsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#2699FB',
  },
  mapView: {
    alignItems: 'center',
  },
  inputContainer: {
    // width: '90%',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#F8FAFF',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 30,
    paddingVertical: 10,
    justifyContent: 'center',
    alignContent: 'center',
    marginHorizontal: 20,
    backgroundColor: '#F8FAFF',
    // marginBottom: 20,
  },
  input: {
    color: '#707070',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    flexGrow: 1,
  },
  inputButton: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    width: '25%',
    height: '90%',
    alignItems: 'center',
    alignContent: 'center',
  },
  inputButtonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingTop: 15,
    color: '#707070',
    fontFamily: 'Poppins-Bold',
    fontSize: 9,
  },
  shareContainer: {
    paddingVertical: 10,
  },
  iconContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  shareIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  shareTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  shareText: {
    color: '#336CF9',
    fontFamily: 'Poppins-Regular',
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 50,
  },
})

export default ContactUs
