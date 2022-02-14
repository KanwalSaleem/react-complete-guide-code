import React, {useRef, useState, useEffect, useCallback} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native'
import Colors from '../constants/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AuthButton from '../components/AuthButton'
import {useSelector} from 'react-redux'

import {useNavigation} from '@react-navigation/native'

const NotificationsScreen = () => {
  const navigation = useNavigation()
  const token = useSelector((state) => state.auth.token)
  const [isLoading, setLoading] = useState(false)

  const data = [
    {
      id: 1,
      title: 'You have received service Request from jared hopping',
      name: 'jared hopping',
      notificationType: 'service request',
      time: '1h ago',
    },
    {
      id: 2,
      name: 'jared hopping',
      notificationType: 'service request',
      time: '1h ago',
    },
    {
      id: 3,
      time: '08:20 AM today',
      name: 'Marry',
      notificationType: 'miss call',
      timeValue: '1h ago',
    },
    {
      id: 4,
      time: '08:20 AM today',
      name: 'Marry',
      notificationType: 'miss call',
      timeValue: '1h ago',
    },
    {
      id: 5,
      time: '08:20 AM today',
      name: 'Marry',
      notificationType: 'miss call',
      timeValue: '1h ago',
    },
    {
      id: 6,
      time: '08:20 AM today',
      name: 'Marry',
      notificationType: 'miss call',
      timeValue: '1h ago',
    },
    {
      id: 11,
      time: '08:20 AM today',
      name: 'Marry',
      notificationType: 'miss call',
      timeValue: '1h ago',
    },
    {
      id: 7,
      time: '08:20 AM today',
      name: 'Marry',
      notificationType: 'miss call',
      timeValue: '1h ago',
    },
    {
      id: 8,
      time: '08:20 AM today',
      name: 'Marry',
      notificationType: 'miss call',
      timeValue: '1h ago',
    },
    {
      id: 9,
      time: '08:20 AM today',
      name: 'Marry',
      notificationType: 'miss call',
      timeValue: '1h ago',
    },
  ]

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.red} />
    </View>
  ) : (
    <View style={styles.mainScreen}>
      <View style={styles.whiteContainer}>
        <View style={styles.mainContainer}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => item.id}
            renderItem={({item}) => {
              return (
                <View style={styles.itemContainer}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.iconTitle}>C</Text>
                  </View>
                  {item.notificationType === 'service request' ? (
                    <View style={styles.titleContainer}>
                      <View style={styles.titleInnerContainer}>
                        <View style={styles.titleInnerContainer}>
                          <Text style={styles.serviceTitle}>
                            You have received service Request from
                            <Text
                              style={[
                                styles.serviceTitle,
                                {color: Colors.red},
                              ]}>
                              {' '}
                              {item.name}
                            </Text>
                          </Text>
                        </View>
                      </View>
                      <View style={styles.buttonConatiner}>
                        <AuthButton
                          style={{width: '48%', marginHorizontal: 2}}
                          onPress={() => {}}>
                          Accept
                        </AuthButton>

                        <AuthButton
                          style={{
                            backgroundColor: '#444444',
                            width: '48%',
                            marginHorizontal: 2,
                          }}
                          onPress={() => {}}>
                          Reject
                        </AuthButton>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.titleContainer}>
                      <View style={styles.titleInnerContainer}>
                        <Text style={styles.title}>
                          You have been miss call from
                          <Text
                            style={[styles.title, {fontFamily: 'Roboto-Bold'}]}>
                            {' '}
                            {item.name}
                          </Text>{' '}
                          {item.time}
                        </Text>
                      </View>
                      <Text style={styles.time}>{item.timeValue}</Text>
                    </View>
                  )}
                </View>
              )
            }}
          />
        </View>
      </View>
    </View>
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
    width: '100%',
    backgroundColor: 'white',

    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 20,
  },
  mainContainer: {},
  itemContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  titleContainer: {
    marginLeft: 10,
    width: '83%',
  },
  titleInnerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  title: {
    color: '#9393AA',
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    lineHeight: 22,
  },
  serviceTitle: {
    color: '#1E1F20',
    fontSize: 15,
    fontFamily: 'Roboto-Bold',
    lineHeight: 22,
  },
  time: {
    color: '#9393AA',
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    opacity: 0.5,
    lineHeight: 22,
  },
  iconContainer: {
    backgroundColor: Colors.red,
    width: '13%',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconTitle: {
    color: Colors.backgroundColor,
    fontSize: 15,
    fontFamily: 'Roboto-Bold',
  },
  buttonConatiner: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    width: '50%',
  },
})

export default NotificationsScreen
