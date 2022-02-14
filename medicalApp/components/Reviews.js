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

const Reviews = (props) => {
  return (
    <View style={{...styles.reviewContainer, ...props.style}}>
      <FlatList
        data={props.data}
        keyExtractor={(item, index) => item.id}
        renderItem={({item}) => {
          return (
            <View style={styles.itemContainer}>
              <View style={styles.titleContainer}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                  <View style={styles.dateContainer}>
                    <View>
                      <SwipeableRating
                        rating={item.rating}
                        size={20}
                        gap={0}
                        xOffset={30}
                        color="#F5DA28"
                        emptyColor="#696969"
                      />
                    </View>
                    <Text style={styles.date}>{item.date}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>{item.review}</Text>
              </View>
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  reviewContainer: {
    marginVertical: 15,
    paddingBottom: 30,
    marginBottom: 70,
  },
  itemContainer: {
    backgroundColor: Colors.backgroundColor,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  image: {
    width: '18%',
    height: 50,
    borderRadius: 10,
  },
  titleContainer: {
    flexDirection: 'row',
  },
  nameContainer: {
    marginLeft: 15,
  },
  name: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
  },
  dateContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  date: {
    marginLeft: 5,
    color: '#9393AA',
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },
  descriptionContainer: {
    marginTop: 10,
  },
  description: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },
})

export default Reviews
