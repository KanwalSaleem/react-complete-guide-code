import React, {forwardRef} from 'react'
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native'
import {Modal, Portal, Checkbox, ActivityIndicator} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../constants/Colors'
import AuthButton from '../components/AuthButton'

const FeedBack = (props) => {
  return (
    <Portal>
      <Modal
        visible={props.visible}
        onDismiss={() => props.setVisible(false)}
        contentContainerStyle={styles.modalContainer}>
        <TouchableOpacity onPress={() => {}} style={styles.doneView}>
          <Icon name="done" color={Colors.backgroundColor} size={40} />
        </TouchableOpacity>
        <View style={styles.textView}>
          <Text style={styles.text}>{props.text}</Text>
        </View>
        <View style={{width: '80%', marginBottom: 40}}>
          {props.callLoading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <AuthButton onPress={props.onPress}>OK</AuthButton>
          )}
        </View>
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 10,

    alignItems: 'center',
    paddingVertical: 40,
    paddingBottom: 30,
    borderRadius: 20,
    marginTop: 30,
    backgroundColor: 'white',
  },

  doneView: {
    backgroundColor: '#4BAD26',
    width: 60,
    height: 60,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  textView: {
    width: '80%',
    marginVertical: 30,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
  },
})

export default FeedBack
