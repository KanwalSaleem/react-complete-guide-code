import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../constants/Colors'

const Header = (props) => {
  return (
    <View style={styles.topBarContainer}>
      <TouchableOpacity onPress={() => {}} style={styles.imageView}>
        <Image source={require('../assets/review.jpg')} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.title}>{props.title}</Text>
      <Icon name="notifications" color={Colors.backgroundColor} size={30} />
    </View>
  )
}

const styles = StyleSheet.create({
  topBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: 'black',
    // paddingTop: 20,
  },
  imageView: {
    width: '20%',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '80%',
    height: 50,
    borderRadius: 30,
  },
  title: {
    color: Colors.backgroundColor,
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
  },
})

export default Header
