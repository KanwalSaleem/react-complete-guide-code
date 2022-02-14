import React, {useEffect} from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BottomBar from '../../components/BottomBar'

const Dashboard = ({navigation}) => {
  useEffect(() => {
    // const getItem = async () => {
    //   const itemId = await AsyncStorage.getItem('itemId')
    //   if (itemId) {
    //     navigation.navigate('reconnect')
    //   }
    // }
    // getItem()
  }, [navigation])
  return (
    <>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: 'black',
        }}>
        <Image
          style={{
            width: 200,
            height: 150,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            borderRadius: 50,
            borderWidth: 10,
            borderColor: 'black',
          }}
          source={require('../../assets/signUpIcon.jpg')}
        />

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tab}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('serviceRequest')}>
            <Icon name="local-library" color="black" size={40} />

            <Text style={styles.tabText}>Service Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('settingsScreen')}>
            <Icon name="settings" color="black" size={40} />
            <Text style={styles.tabText}>Settings</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tab}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('serviceHistory')}>
            <Icon name="perm-contact-calendar" color="black" size={45} />
            <Text style={styles.tabText}>Completed History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tab} activeOpacity={0.8}>
            <Icon
              style={{}}
              name="account-balance-wallet"
              color="black"
              size={40}
            />
            <Text style={styles.tabText}>Income</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: '100%',

              height: 150,

              borderRadius: 20,
              backgroundColor: 'white',

              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="star" color="black" size={40} />
            <Text style={styles.tabText}>Rating/Review</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  fontSize: 16,
  tabText: {
    fontFamily: 'OpenSans-Bold',
  },
  tab: {
    width: '48%',
    height: 150,
    marginRight: 5,

    borderRadius: 20,
    backgroundColor: 'white',

    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default Dashboard
