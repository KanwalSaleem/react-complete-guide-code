import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native'
import {defineAnimation} from 'react-native-reanimated'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../constants/Colors'
import {useNavigation} from '@react-navigation/native'

const GobackHeader = (props) => {
  const navigation = useNavigation()
  return (
    <View style={{...styles.topBarContainer, ...props.style}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconView}>
        <Icon name="arrow-back-ios" color={Colors.backgroundColor} size={20} />
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
    marginBottom: 20,
  },
  iconView: {
    borderRadius: 100,
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 5,
    textAlign: 'center',
  },
  title: {
    color: Colors.backgroundColor,
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
  },
})

export default GobackHeader
