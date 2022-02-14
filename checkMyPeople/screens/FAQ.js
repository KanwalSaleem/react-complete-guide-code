import React, {useState, useRef, useEffect, useContext} from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Linking} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import Colors from '../constants/Colors'
import AuthButton from '../components/AuthButton'
import fonts from '../constants/fonts'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {List} from 'react-native-paper'
import Card from '../components/Card'

const FAQ = () => {
  const [downloadVisible, setDownloadVisible] = useState(false)
  const [memberVisible, setMemberVisible] = useState(false)
  const [profileVisible, setProfileVisible] = useState(false)
  const [costVisible, setCostVisible] = useState(false)
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <TouchableOpacity
          style={styles.titleMainContainer}
          activeOpacity={0.8}
          onPress={() => setDownloadVisible(!downloadVisible)}>
          <View style={[styles.titleContainer, {alignItems: 'center'}]}>
            <Text style={[fonts.heading]} allowFontScaling={false}>
              Why Download the APP
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setDownloadVisible(!downloadVisible)}>
              <Icon
                name={downloadVisible ? 'expand-less' : 'expand-more'}
                color={Colors.primary}
                size={25}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          {downloadVisible && (
            <Text
              style={[fonts.title, styles.titleMargin]}
              allowFontScaling={false}>
              This puts the Identity Verification service at your fingertips.
              Whether you are using an Android phone or Apple, the app will work
              seamlessly on both.
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.titleMainContainer}
          activeOpacity={0.8}
          onPress={() => setMemberVisible(!memberVisible)}>
          <View style={styles.titleContainer}>
            <Text style={fonts.heading} allowFontScaling={false}>
              Who can be a member?
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setMemberVisible(!memberVisible)}>
              <Icon
                name={memberVisible ? 'expand-less' : 'expand-more'}
                color={Colors.primary}
                size={25}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          {memberVisible && (
            <Text
              style={[fonts.title, styles.titleMargin]}
              allowFontScaling={false}>
              Anyone can verify identity of any person they wish to employ,
              engage as tenant, do business with or place in a position of
              trust.
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.titleMainContainer}
          activeOpacity={0.8}
          onPress={() => setProfileVisible(!profileVisible)}>
          <View style={styles.titleContainer}>
            <Text style={fonts.heading} allowFontScaling={false}>
              Is this connected to my web profile
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setProfileVisible(!profileVisible)}>
              <Icon
                name={profileVisible ? 'expand-less' : 'expand-more'}
                color={Colors.primary}
                size={25}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          {profileVisible && (
            <Text
              style={[fonts.title, styles.titleMargin]}
              allowFontScaling={false}>
              Yes. You can seamlessly use the app, or the web application
              provided you use the same credentials to log in.
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.titleMainContainer}
          activeOpacity={0.8}
          onPress={() => setCostVisible(!costVisible)}>
          <View style={styles.titleContainer}>
            <Text style={fonts.heading} allowFontScaling={false}>
              How much does verification cost?
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setCostVisible(!costVisible)}>
              <Icon
                name={costVisible ? 'expand-less' : 'expand-more'}
                color={Colors.primary}
                size={25}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          {costVisible && (
            <>
              <Text
                style={[styles.titleMargin, {color: 'black'}]}
                allowFontScaling={false}>
                {'\u25CF'}
                <Text style={fonts.title} allowFontScaling={false}>
                  {' '}
                  N300 for Guests
                </Text>
              </Text>
              <Text
                style={[styles.titleMargin, {color: 'black', marginTop: 0}]}
                allowFontScaling={false}>
                {'\u25CF'}
                <Text style={fonts.title} allowFontScaling={false}>
                  {' '}
                  N200 for Members
                </Text>
              </Text>
              <Text
                style={[fonts.title, styles.titleMargin, {fontSize: 14}]}
                allowFontScaling={false}>
                Register using{' '}
                <Text
                  style={{color: Colors.primary, fontSize: 15}}
                  onPress={() =>
                    Linking.openURL('https://www.checkmypeople.com/register')
                  }
                  allowFontScaling={false}>
                  www.checkmypeople.com/register
                </Text>{' '}
                to take advantage of the discounts
              </Text>
            </>

            // <Text style={[fonts.title, styles.titleMargin]}>
            //   This puts the Identity Verification service at your fingertips.
            //   Whether you are using an Android phone or Apple, the app will work
            //   seamlessly on both.
            // </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#E5E5E5',
    flex: 1,
    // padding: 10,
    justifyContent: 'center',
    paddingTop: 20,
  },

  innerContainer: {
    // margin: 30,
    flexGrow: 1,
    // justifyContent: 'center',
  },
  titleMainContainer: {
    width: '95%',
    alignSelf: 'center',
    marginVertical: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',

    // padding: 10,
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    // alignItems: 'center',
  },
  icon: {
    marginLeft: 5,
  },
  titleMargin: {
    marginTop: 10,
    paddingLeft: 15,
    paddingRight: 12,
  },
})

export default FAQ
