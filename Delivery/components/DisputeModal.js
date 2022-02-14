import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {ActivityIndicator, Modal, Portal} from 'react-native-paper'
import colors from '../constants/colors'
import {Picker} from '@react-native-picker/picker'
import {Controller, useForm} from 'react-hook-form'

const DisputeModal = ({open, setOpen, id, clientId, role}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    setValue,
  } = useForm({
    mode: 'all',
  })
  const [loading, setLoading] = useState(false)

  const raiseDispute = async (data) => {
    console.log(data)
    setLoading(true)
    try {
      const response = await fetch('https://deliverypay.in/api/fileDispute', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issue: data.issue,
          milestoneId: id,
          defendantId: clientId,
          // case: {
          //   description: data.description,
          //   file: [''],
          // },
        }),
      })
      const resData = await response.json()
      console.log(response)
      if (!response.ok) {
        throw new Error(resData.message)
      }
      Alert.alert('Success', resData.message)
    } catch (e) {
      Alert.alert(Error, e.message)
    }
    setLoading(false)
  }

  return (
    <Portal>
      <Modal
        dismissable={true}
        visible={open}
        onDismiss={() => setOpen(false)}
        contentContainerStyle={styles.modalBackground}>
        <View>
          <Text style={[styles.modalHeading, {marginBottom: 10, fontSize: 21}]}>
            Raise Dispute
          </Text>
        </View>
        <View>
          <Text style={styles.modalHeading}>
            You feel like you are getting scammed?
          </Text>
        </View>

        <View>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 10,
              marginVertical: 10,
            }}>
            <Controller
              control={control}
              name="issue"
              // defaultValue="asd"
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Picker
                  dropdownIconColor={'black'}
                  style={{
                    color: 'black',

                    width: 300,
                    shadowColor: 'black',
                    shadowOpacity: 0.26,
                    shadowOffset: {width: 0, height: 2},
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                  selectedValue={value}
                  onValueChange={onChange}
                  mode="dropdown">
                  <Picker.Item enabled={false} label="Issue" value="" />
                  <Picker.Item
                    label={`${
                      role === 'seller' ? 'Seller' : 'Buyer'
                    } not Releasing Payments`}
                    value={`${
                      role === 'seller' ? 'Seller' : 'Buyer'
                    } not Releasing Payments`}
                  />
                </Picker>
              )}
            />
          </View>
          {errors.issue && <Text>{errors?.issue.message}</Text>}
          <Controller
            control={control}
            name="description"
            render={({field: {value, onChange}}) => (
              <TextInput
                style={styles.input}
                placeholder="Description"
                selectedValue={value}
                onChangeText={onChange}
                multiline={true}
              />
            )}
          />
        </View>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <View style={styles.buttonContainer}>
            <LinearGradient
              colors={['#2598b6', '#0b1a45']}
              end={{x: 1, y: 3}}
              style={styles.button}>
              <TouchableOpacity onPress={handleSubmit(raiseDispute)}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </LinearGradient>
            <LinearGradient
              colors={['#2598b6', '#f64bbd']}
              end={{x: 1, y: 2}}
              style={styles.button}>
              <TouchableOpacity onPress={() => setOpen(false)}>
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
    // alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    padding: 10,
    paddingHorizontal: 20,
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
  picker: {
    width: '80%',
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlignVertical: 'top',
    marginVertical: 10,
    marginTop: 20,
    height: 100,
  },
  issueHeading: {
    alignSelf: 'flex-start',
    marginHorizontal: 'auto',
    paddingLeft: 10,
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
})

export default DisputeModal
