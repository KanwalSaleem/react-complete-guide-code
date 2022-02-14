import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {Modal, Portal} from 'react-native-paper'
import {useForm} from 'react-hook-form'
import Input from '../Input'
import AuthButton from '../AuthButton'

const CancelTripModal = (props) => {
  const {
    control,
    formState: {errors},
  } = useForm()

  return (
    <Portal>
      <Modal
        visible={props.cancelOpen}
        contentContainerStyle={{
          backgroundColor: 'white',
          padding: 20,
          width: '80%',
          alignSelf: 'center',
          borderRadius: 20,
        }}
        dismissable={true}
        onDismiss={() => {
          props.setVisible(true)
          props.setCancelVisible(false)
        }}>
        <Text style={styles.heading}>
          Are you sure you want to cancel appointment
        </Text>

        <Input
          control={control}
          name="email"
          rules={{
            required: true,
            pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          }}
          placeholder="Cancellation Reason"
          blurOnSubmit={false}
          returnKeyType="next"
          placeholderTextColor="black"
          style={styles.textInput}
        />
        <AuthButton style={{marginTop: 30, borderRadius: 10}}>
          Submit
        </AuthButton>
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: 'Roboto-Bold',
    fontSize: 21,
    textAlign: 'center',
  },
  textInput: {
    // alignSelf: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    // width: '95%',
    color: 'black',
    textAlignVertical: 'bottom',
    marginBottom: 5,
    fontFamily: 'Roboto-Regular',
    marginTop: 30,
  },
})

export default CancelTripModal
