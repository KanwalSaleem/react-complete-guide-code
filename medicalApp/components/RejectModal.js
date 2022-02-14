import React from 'react'
import {Text, View, TextInput, StyleSheet} from 'react-native'
import {Modal, Portal} from 'react-native-paper'

import AuthButton from '../components/AuthButton'

const Reject = (props) => {
  return (
    <Portal>
      <Modal
        visible={props.visible}
        onDismiss={props.dismiss}
        dismissable={true}
        contentContainerStyle={styles.modalContainer}>
        <View style={styles.textView}>
          <Text style={styles.modalText}>{props.children}</Text>
        </View>
        {/* <View style={styles.fieldContainer}>
          <TextInput
            name="rejectionReason"
            placeholder="Rejection Reason"
            value={props.value}
            onChangeText={props.onChange}
          />
        </View> */}

        <View style={{width: '80%', marginBottom: 40}}>
          <AuthButton disabled={props.disabled} onPress={props.onPress}>
            Submit
          </AuthButton>
        </View>
      </Modal>
    </Portal>
  )
}
const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 10,
    // paddingBottom: 20,
    // height: 100,
    alignItems: 'center',
    paddingVertical: 40,
    paddingBottom: 30,
    borderRadius: 20,
    marginTop: 30,
    backgroundColor: 'white',
    // marginVertical: 10,
    // paddingHorizontal: 30,
  },

  textView: {
    width: '80%',
    marginVertical: 10,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
  },
  fieldContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: 'grey',
    marginBottom: 20,
  },
})

export default Reject
