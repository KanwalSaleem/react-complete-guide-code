import React, {
  useContext,
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from 'react'
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
import Colors from '../constants/Colors'
import BottomBar from '../components/BottomBar'
import {AuthContext} from '../context/Auth'
import fonts from '../constants/fonts'

const selectionOptions = [
  {
    name: 'NIN Verification',
    image: require('../assets/verifyNIN.png'),
    route: 'verifynin',
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
    name: 'How it Works',
    image: require('../assets/work.png'),
    route: 'howItWorks',
  },

  {
    name: 'Sign On',
    image: require('../assets/signOn.png'),
    route: 'loginForm',
  },
]

const Profile = ({navigation}) => {
  const {setLoggedIn} = useContext(AuthContext)
  const [selected, setSelectedItem] = useState('')

  useFocusEffect(
    useCallback(() => {
      setSelectedItem('')
    }, []),
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: ({canGoBack}) => {
        return (
          <TouchableOpacity
            onPress={() => {
              canGoBack ? navigation.goBack() : navigation.navigate('verifynin')
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Inter-SemiBold',
                color: Colors.primary,
              }}
              allowFontScaling={false}>
              Back
            </Text>
          </TouchableOpacity>
        )
      },
    })
  }, [navigation])

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={{
          justifyContent: 'center',
          flexGrow: 1,
        }}>
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

    height: '100%',
    paddingVertical: 40,
    // paddingBottom: 100,
    marginBottom: 60,
  },
  infoContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 40,
  },
  optionsContainer: {
    width: '48%',
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,

    backgroundColor: 'white',
    padding: 30,
    // marginLeft: 10,
    // paddingVertical: 30,
    elevation: 5,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 25,
  },
  title: {
    marginTop: 15,
    textAlign: 'center',
  },
})

export default Profile
