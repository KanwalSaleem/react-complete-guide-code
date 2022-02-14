import Icon from 'react-native-vector-icons/MaterialIcons'
import React, {useEffect} from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native'

import {useSelector} from 'react-redux'
import BottomBar from '../../components/BottomBar'
import Header from '../../components/Header'

const Dashboard = ({navigation}) => {
  const careGiverItem = useSelector((state) => state.careGiver)
  // useEffect(() => {
  //   if (careGiverItem.status === 'tripNotStarted') {
  //     navigation.navigate('serviceDetail', {
  //       id: careGiverItem.id,
  //     })
  //   } else {
  //     navigation.navigate('map', {
  //       id: careGiverItem.id,
  //     })
  //   }
  // }, [careGiverItem.id, careGiverItem.status, navigation])
  return (
    <>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: 'black',
        }}>
        {/* <Header /> */}

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
            onPress={() => navigation.navigate('settingsScreen')}>
            <Icon name="settings" color="black" size={40} />
            <Text style={styles.tabText}>Settings</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate('careGiverServiceHistory')}>
            <Icon name="perm-contact-calendar" color="black" size={45} />
            <Text style={styles.tabText}>Services history</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate('networkGroups')}>
            <Icon style={{}} name="language" color="black" size={40} />
            <Text style={styles.tabText}>Network</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate('reportScreen')}>
            <Icon name="description" color="black" size={45} />
            <Text style={styles.tabText}>Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate('reviews')}>
            <Icon name="star" color="black" size={40} />
            <Text style={styles.tabText}>Rating/Review</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomBar style={{position: 'relative'}} />
    </>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fontSize: 16,
  tabText: {
    fontFamily: 'OpenSans-Bold',
    // margin: 5,
  },
  tab: {
    // flexBasis: '50%',
    width: '49%',
    height: 150,
    marginRight: 5,
    // height: '21%',

    borderRadius: 20,
    backgroundColor: 'white',

    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default Dashboard
