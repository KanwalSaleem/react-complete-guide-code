import React, {useState, useEffect, useCallback} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native'
import Colors from '../../constants/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Input from '../../components/Input'

import {useSelector} from 'react-redux'
import BottomBar from '../../components/BottomBar'
import {useNavigation} from '@react-navigation/native'

const NetworkGroups = () => {
  const navigation = useNavigation()
  const token = useSelector((state) => state.auth.token)
  const [isLoading, setLoading] = useState(false)

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.red} />
    </View>
  ) : (
    <>
      <View style={styles.mainScreen}>
        <View style={styles.whiteContainer}>
          <Icon name="star" color="#F5DA28" size={25} />
          <View style={styles.networkContainer}>
            <Text style={styles.title}>
              Aging and Disability Resource Center
            </Text>
            <View style={styles.membersContainer}>
              <View style={styles.innerContainer}>
                <Text style={styles.mainTitle}>500</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('networkMembers')}>
                  <Text style={styles.mainTitle}>Members</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.innerContainer,
                  {
                    borderLeftWidth: 2,
                    borderLeftColor: '#FCd1F4',
                  },
                ]}>
                <Text sstyle={styles.mainTitle}>10,000</Text>
                <Text style={[styles.mainTitle, {fontFamily: 'Roboto-Bold'}]}>
                  Services done/month
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  activity: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  mainScreen: {
    flexGrow: 1,
    backgroundColor: Colors.black,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  whiteContainer: {
    // height: '90%',
    flexGrow: 1,
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },
  mainTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    marginTop: 5,
  },

  subTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },

  membersContainer: {
    marginVertical: 20,
    backgroundColor: '#FCF1F1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginHorizontal: 10,
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  innerContainer: {
    width: '50%',
    alignItems: 'center',
  },
  networkImage: {
    width: '30%',
    height: '15%',
    marginVertical: 10,
    borderRadius: 20,
  },
})

export default NetworkGroups
