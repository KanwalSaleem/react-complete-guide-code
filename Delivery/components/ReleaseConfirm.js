import React, {useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {ActivityIndicator, Modal, Portal} from 'react-native-paper'
import colors from '../constants/colors'

const ApproveDecline = ({open, setOpen, id}) => {
  const [loading, setLoading] = useState(false)
  const releaseMilestone = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        'https://deliverypay.in/api/releaseMilestone',
        {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _id: id,
          }),
        },
      )

      const resData = await response.json()
      if (!response.ok) {
        throw new Error(resData.message)
      }
      Alert.alert('Succes', resData.message)
    } catch (e) {
      Alert.alert(Error, e.message)
    }
    setLoading(false)
    setOpen(false)
  }

  return (
    <Portal>
      <Modal
        dismissable={true}
        visible={open}
        onDismiss={() => setOpen(false)}
        contentContainerStyle={styles.modalBackground}>
        <View>
          <Text style={styles.modalHeading}>
            You sure want to release this Milestone?
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <View style={styles.buttonContainer}>
            <LinearGradient
              colors={['#2598b6', '#1be6d6']}
              end={{x: 1, y: 2}}
              style={styles.button}>
              <TouchableOpacity onPress={releaseMilestone}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </LinearGradient>
            <LinearGradient
              colors={['#2598b6', '#f64bbd']}
              end={{x: 1, y: 1}}
              style={styles.button}>
              <TouchableOpacity onPress={setOpen.bind(this, false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: 'white',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
  },
  modalHeading: {
    color: '#299ab7',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 30,
    marginBottom: 10,
  },
  button: {
    width: '40%',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
  },
})

export default ApproveDecline
