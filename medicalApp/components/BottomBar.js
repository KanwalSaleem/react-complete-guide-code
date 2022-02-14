import React from 'react'
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native'
import {useDispatch} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../constants/Colors'
import {logout} from '../store/actions/auth'

const BottomBar = (props) => {
  const dispatch = useDispatch()
  const userLogout = () =>
    dispatch(logout()).then(() =>
      Alert.alert('Successful', 'User Logged out successfully'),
    )

  return (
    <TouchableOpacity style={[styles.bottomContainer]} onPress={userLogout}>
      <View style={styles.iconView}>
        <Icon name="home" size={40} color={Colors.backgroundColor} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  bottomContainer: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // position: 'absolute',

    bottom: 0,
  },
  iconView: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 7,
    paddingHorizontal: 8,
    justifyContent: 'center',
    top: -15,
  },
})

export default BottomBar
