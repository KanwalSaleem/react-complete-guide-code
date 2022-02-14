import React, {useEffect, useState} from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from 'react-native'
import {Button, Checkbox} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../../constants/Colors'
import AuthButton from '../AuthButton'
import ChecklistItem from '../ChecklistItem'
import {Controller, useForm} from 'react-hook-form'
import EditPrescriptionModal from './EditPrescriptionModal'
import {ActivityIndicator} from 'react-native-paper'

const DiagnosticChecklist = (props) => {
  const window = useWindowDimensions()
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: {errors},
  } = useForm({
    mode: 'all',
  })

  const [item, setItem] = useState()

  const onSubmit = (data) => {
    props.addPrescription({
      id: Math.random() * Math.random(),
      message: data.message,
    })
    reset()
  }

  const onEdit = (prescription) => props.editPrescription(item.id, prescription)

  return (
    <>
      <EditPrescriptionModal item={item} onDismiss={setItem} onEdit={onEdit} />
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="message"
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                multiline={true}
                style={[
                  styles.checklistInput,
                  {borderBottomColor: errors.message && Colors.primary},
                ]}
                placeholder="Write Prescriptions"
                placeholderTextColor="black"
              />
            )}
          />

          <View style={styles.buttonsContainer}>
            <Button
              onPress={handleSubmit(onSubmit)}
              mode="contained"
              color={Colors.primary}
              uppercase={false}
              style={{borderRadius: 5, paddingHorizontal: 10}}>
              Submit
            </Button>
            <TouchableOpacity style={styles.addMore} activeOpacity={0.6}>
              <Icon name="add-circle" color={Colors.primary} size={30} />
              <Text>Add more</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          style={{
            maxHeight: window.height < 700 ? 390 : 460,
            backgroundColor: '#fff',
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            paddingHorizontal: 10,
            padding: 10,
          }}
          data={props.prescriptionsList}
          renderItem={({item, index}) => (
            <ChecklistItem
              onRemove={props.removePrescription}
              number={index + 1}
              message={item.message}
              id={item.id}
              onEdit={setItem.bind(this, item)}
            />
          )}
        />
        {props.loading ? (
          <ActivityIndicator color={Colors.primary} style={{marginTop: 30}} />
        ) : (
          <AuthButton
            style={{width: '100%', marginTop: 30}}
            onPress={props.sendChecklist}
            disabled={props.prescriptionsList.length === 0}>
            Submit
          </AuthButton>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
  },
  formContainer: {
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
    backgroundColor: '#f1efef',
    padding: 10,
  },
  checklistInput: {
    alignSelf: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: '95%',
    color: 'black',
    textAlignVertical: 'bottom',
    marginBottom: 5,
    fontFamily: 'Roboto-Regular',
  },
  visitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visitText: {
    fontFamily: 'Roboto-Regular',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default DiagnosticChecklist
