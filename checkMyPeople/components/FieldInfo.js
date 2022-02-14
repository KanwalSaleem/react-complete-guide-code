import React, {forwardRef} from 'react'
import {TextInput, StyleSheet, View, Text} from 'react-native'
import {useController} from 'react-hook-form'
import Colors from '../constants/Colors'
import fonts from '../constants/fonts'
import Icon from 'react-native-vector-icons/MaterialIcons'

const FieldInfo = (props) => {
  return (
    <View
      style={[
        styles.fieldContainer,
        props.picker && {flexDirection: 'row', justifyContent: 'space-between'},
        props.style,
      ]}>
      <View>
        <Text style={styles.title} allowFontScaling={false}>
          {props.title}
        </Text>
        <Text style={styles.text} allowFontScaling={false}>
          {props.text}
        </Text>
      </View>
      {props.picker && (
        <Icon
          name="expand-more"
          style={{alignSelf: 'flex-end'}}
          color={Colors.primary}
          size={25}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  fieldContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    marginVertical: 5,
  },
  title: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Bold',
  },
  text: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    marginTop: 5,
  },
})

export default FieldInfo
