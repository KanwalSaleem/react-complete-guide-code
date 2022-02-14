import React from 'react'
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native'

const Item = ({title, subtitle, image}) => (
  <View style={styles.item}>
    <TouchableOpacity activeOpacity={0.7}>
      <Image style={styles.image} source={{uri: image}} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  item: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingBottom: 10,

    marginBottom: 15,
    paddingTop: 10,
    width: '50%',
    marginRight: 10,
  },
  image: {
    width: '80%',
    alignSelf: 'center',
    height: 223,
  },
  title: {
    padding: 8,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: 'grey',
    paddingLeft: 8,
    fontSize: 16,
  },
})

export default Item
