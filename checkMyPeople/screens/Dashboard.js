import React, {useCallback, useContext, useLayoutEffect, useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import {useFocusEffect} from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AuthButton from '../components/AuthButton'
import Colors from '../constants/Colors'
import BottomBar from '../components/BottomBar'
import {AuthContext} from '../context/Auth'
import fonts from '../constants/fonts'

const selectionOptions = [
  {
    name: 'My Profile',
    image: require('../assets/myProfile.png'),
    route: 'myProfile',
  },
  {
    name: 'NIN Verification',
    image: require('../assets/verifyNIN.png'),
    route: 'verifynin',
  },
  {
    name: 'Load Account Balance',
    image: require('../assets/balance.png'),
    route: 'balance',
  },
  {
    name: 'How-to Videos',
    image: require('../assets/videos.png'),
    route: 'videos',
  },
  {name: 'FAQ', image: require('../assets/faq.png'), route: 'faq'},
  {
    name: 'Verification History',
    image: require('../assets/verifyHistory.png'),
    route: 'verificationHistory',
  },

  {
    name: 'Payment History',
    image: require('../assets/payHistory.png'),
    route: 'paymentHistory',
  },
  {
    name: 'How it Works',
    image: require('../assets/work.png'),
    route: 'howItWorks',
  },
]

const Dashboard = ({navigation}) => {
  const {setLoggedIn, setUser, logout} = useContext(AuthContext)
  const [selected, setSelectedItem] = useState('')

  useFocusEffect(
    useCallback(() => {
      setSelectedItem('')
    }, []),
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <TouchableOpacity onPress={logout}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Inter-SemiBold',
                color: Colors.primary,
              }}
              allowFontScaling={false}>
              Log out
            </Text>
          </TouchableOpacity>
        )
      },
    })
  }, [])
  return (
    <>
      <ScrollView contentContainerStyle={styles.screen}>
        {/* <View style={styles.logo}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logoImage}
          />
        </View> */}
        <View style={styles.infoContainer}>
          {selectionOptions.map((option) => (
            <TouchableOpacity
              key={option.route}
              style={styles.optionsContainer}
              onPress={() => {
                setSelectedItem(option.name)
                navigation.navigate(option.route)
              }}
              activeOpacity={0.8}>
              <Image source={option.image} style={{width: 38, height: 38}} />
              <Text
                style={[
                  fonts.title,
                  styles.title,
                  {color: selected === option.name ? Colors.primary : 'black'},
                ]}
                allowFontScaling={false}>
                {option.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    paddingBottom: 10,
    paddingTop: 10,
    marginBottom: 60,
  },
  logo: {
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 50,
    marginHorizontal: 20,
    alignSelf: 'center',
  },
  logoImage: {
    width: '100%',
    height: 30,
    marginTop: 20,
  },
  infoContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 50,
  },
  optionsContainer: {
    width: '48%',
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,

    backgroundColor: 'white',
    padding: 18,
    paddingVertical: 25,
    // marginLeft: 10,
    // paddingVertical: 30,
    elevation: 5,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    overflow: 'hidden',
  },
  title: {
    marginTop: 15,
    textAlign: 'center',
  },
})

export default Dashboard
