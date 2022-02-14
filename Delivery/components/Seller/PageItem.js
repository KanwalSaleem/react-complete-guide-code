import React from 'react'
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'
import {Avatar, Checkbox} from 'react-native-paper'
import colors from '../../constants/colors'

const PageItem = (props) => {
  return (
    <View style={styles.businessItem}>
      <View style={props.name.length > 0 && styles.itemDetail}>
        <Avatar.Image source={{uri: props.image}} style={styles.profileImage} />

        {props.name.length > 0 ? (
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontFamily: 'Poppins-Regular',
            }}>
            {props.name}
          </Text>
        ) : null}

        <Text>{props.category}</Text>
        {/* <Text>
            Created at:
            {moment(item.created_item).format('DD MMM YYY, HH:mm a')}
          </Text> */}
      </View>
      <Checkbox
        color={colors.primary}
        status={props.selected}
        onPress={props.onPress}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  businessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  itemDetail: {
    alignItems: 'center',
  },
  profileImage: {marginLeft: 20},
})

export default PageItem
