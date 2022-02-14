import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const Item = ({title, subtitle, date, time, status, onPress}) => {
  let statusColor = styles.statusblue
  if (status.toLowerCase() === 'completed') {
    statusColor = styles.statusblue
  } else if (status.toLowerCase() === 'started') {
    statusColor = styles.statusgreen
  } else {
    statusColor = styles.statusred
  }
  return (
    <View style={styles.item}>
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.details}>
          <View style={styles.dateview}>
            <Icon name="event" size={15} color="grey" />
            <Text style={styles.date}>{date}</Text>
          </View>
          <View style={styles.timeview}>
            <Icon name="schedule" size={15} color="grey" />
            <Text style={styles.time}>{time}</Text>
          </View>
          <View>
            <Text
              style={
                // status === 'Completed' ? styles.statusblue : styles.statusgreen
                statusColor
              }>
              {status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    padding: 8,
    marginVertical: 12,
    marginHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  title: {
    fontSize: 25,
  },
  subtitle: {
    padding: 5,
    fontSize: 14,
  },
  details: {
    padding: 5,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateview: {
    flexDirection: 'row',
  },
  date: {
    paddingLeft: 3,
    color: 'grey',
    fontSize: 11,
  },
  timeview: {
    paddingLeft: 10,
    flexDirection: 'row',
  },
  time: {
    paddingLeft: 3,
    color: 'grey',
    fontSize: 11,
  },
  statusgreen: {
    paddingLeft: 80,
    color: 'green',
    fontSize: 14,
  },
  statusblue: {
    paddingLeft: 80,
    color: '#03f0fc',
    fontSize: 14,
  },
  statusred: {
    color: 'red',
  },
})
export default Item
