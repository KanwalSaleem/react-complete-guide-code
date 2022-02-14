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
import Colors from '../constants/Colors'
import AuthButton from './AuthButton'
import ChecklistItem from './ChecklistItem'
import {Controller, useForm} from 'react-hook-form'
import EditDiagnosisModal from './EditDiagnosisModal'

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
  const [visitStatus, setVisitStatus] = useState(false)
  const [item, setItem] = useState()

  const onSubmit = (data) => {
    props.addDiagnosis({
      id: Math.random() * Math.random(),
      message: data.message,
      status: visitStatus,
    })
    reset()
  }

  const onEdit = (diagnosis) => props.editDiagnosis(item.id, diagnosis)

  return (
    <>
      <EditDiagnosisModal item={item} onDismiss={setItem} onEdit={onEdit} />
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
                placeholder="Write diagnosis check list"
                placeholderTextColor="black"
              />
            )}
          />

          <View style={styles.visitContainer}>
            <Checkbox
              color={Colors.primary}
              status={visitStatus === true ? 'checked' : 'unchecked'}
              onPress={() => setVisitStatus((prev) => !prev)}
            />
            <Text style={styles.visitText}>Need to visit a specialist</Text>
          </View>
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
          data={props.diagnosticList}
          renderItem={({item, index}) => (
            <ChecklistItem
              onRemove={props.removeDiagnosis}
              number={index + 1}
              message={item.message}
              id={item.id}
              onEdit={setItem.bind(this, item)}
            />
          )}
        />
        <AuthButton
          style={{width: '100%'}}
          onPress={props.setStep.bind(this, 'treatment')}
          disabled={props.diagnosticList.length === 0}>
          Continue
        </AuthButton>
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
