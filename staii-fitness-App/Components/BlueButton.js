import React from 'react'
import {TouchableOpacity, Text, StyleSheet} from 'react-native'
import Colors from '../Constants/Colors'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialIcons'

const BlueButton = (props) => {
  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      onPress={props.onPress}
      disabled={props.disabled}
      activeOpacity={props.activeOpacity}>
      <LinearGradient
        colors={['#0038F5', '#9F03FF']}
        style={[
          styles.gradientView,
          props.icon && {flexDirection: 'row', alignItems: 'center'},
        ]}
        start={{x: 0.1, y: 0.1}}
        end={{x: 1, y: -0.1}}>
        {props.icon && <Icon name="file-upload" size={30} color={'white'} />}
        <Text style={styles.text}>{props.children}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    elevation: 5,
    width: '80%',
    alignSelf: 'center',
  },
  gradientView: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 7,
  },
  text: {
    color: Colors.offWhite,
    fontSize: 20,
    fontFamily: 'Epilogue-VariableFont_wght',
    fontWeight: 'bold',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
})

export default BlueButton
