import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

const ServiceItem = (props) => {
  return (
    <View key={props.id} style={styles.itemContainer}>
      <Text style={styles.number}>{props.number}</Text>
      <Text style={styles.text} adjustsFontSizeToFit={true}>
        {props.message}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 10,
    paddingBottom: 5,
    // paddingTop: 10,
  },
  number: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    maxWidth: '80%',
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: 10,
  },
})

export default ServiceItem
