import React, {useState, useRef, useEffect, useContext} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  FlatList,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../constants/Colors'
import SwipeableRating from 'react-native-swipeable-rating'
import {useNavigation} from '@react-navigation/native'
import {APIURL} from '../constants/url'

const ServiceHistory = (props) => {
  const navigation = useNavigation()

  return (
    <View style={{...styles.historyContainer, ...props.style}}>
      <FlatList
        data={props.data}
        keyExtractor={(item, index) => item.id}
        renderItem={({item}) => {
          const newDate = new Date(item.created_at)
          const date = newDate.toDateString().split(' ').slice(1).join(' ')

          return (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                navigation.navigate('serviceDetails', item.id)
              }}>
              <View style={styles.titleContainer}>
                <Image
                  source={{uri: `${APIURL}/storage/uploads/${item.image}`}}
                  style={styles.image}
                />
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>
                    {item.first_name} {''} {item.last_name}
                  </Text>
                  <View style={styles.descriptionContainer}>
                    <Text
                      style={[
                        styles.description,
                        {
                          color:
                            props.serviceStatus === 'canceled'
                              ? Colors.red
                              : 'black',
                        },
                      ]}>
                      {props.serviceStatus === 'canceled'
                        ? 'Canceled by Patient'
                        : 'See What is Consulted'}
                    </Text>
                    {props.serviceStatus === 'canceled' ? null : (
                      <Icon name="chevron-right" size={20} />
                    )}
                  </View>
                </View>
                <Text style={styles.date}>{date}</Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  historyContainer: {},
  itemContainer: {
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 10,
  },
  image: {
    width: '18%',
    height: 55,
    borderRadius: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  nameContainer: {
    marginLeft: 15,
    width: '60%',
  },
  name: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },

  date: {
    fontFamily: 'Roboto-Regular',
    fontSize: 11,
  },

  description: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },
  descriptionContainer: {
    flexDirection: 'row',
  },
})

export default ServiceHistory
