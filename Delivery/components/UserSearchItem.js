import React from 'react'
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native'
import {Avatar} from 'react-native-paper'

const UserSearchItem = (props) => {
  return (
    <View style={styles.container}>
      <Avatar.Image
        size={50}
        source={{
          uri: props.image.includes('https')
            ? props.image
            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>
          {props.firstName}
          {` `}
        </Text>
        <Text style={styles.name}>
          {props.lastName}
          {` `}
        </Text>
      </View>
      <TouchableOpacity activeOpacity={0.6} onPress={props.onPress}>
        {props.milestoneType ? (
          <Text style={styles.milestone}>{props.milestoneType} Milestone</Text>
        ) : (
          <Text style={styles.milestone}>{`Show Products & Services`}</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // width: '90%',
    marginTop: 10,
    marginBottom: 5,
    // paddingVertical: 5,
  },
  textContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  image: {
    marginRight: 5,
  },
  name: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    // textAlign: 'justify',
  },
  milestone: {
    color: '#336CF9',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
})

export default UserSearchItem
