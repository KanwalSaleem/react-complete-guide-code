import React, {useEffect, useState} from 'react'
import {View, Text, TextInput, StyleSheet} from 'react-native'
import {Modal, Portal, Checkbox, Button} from 'react-native-paper'
import {useForm, Controller} from 'react-hook-form'
import Colors from '../constants/Colors'

const EditDiagnosisModal = (props) => {
  console.log(props.item)
  const {
    control,
    handleSubmit,

    reset,
    formState: {errors},
  } = useForm({
    mode: 'all',
  })
  const [visitStatus, setVisitStatus] = useState(false)

  const onSubmit = (data) => {
    props.onEdit({
      message: data.message,
      status: visitStatus,
    })
    props.onDismiss(null)
  }

  useEffect(() => {
    if (props.item) {
      reset({
        message: props.item.message,
      })
      setVisitStatus(props.item.status)
    }
  }, [props.item, reset])

  return (
    <Portal>
      <Modal
        contentContainerStyle={styles.container}
        visible={!!props.item}
        dismissable={true}
        onDismiss={() => props.onDismiss(null)}>
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
            status={visitStatus == true ? 'checked' : 'unchecked'}
            onPress={() => setVisitStatus((prev) => !prev)}
          />
          <Text style={styles.visitText}>Need to visit a specialist</Text>
        </View>
        <Button
          onPress={handleSubmit(onSubmit)}
          mode="contained"
          color={Colors.primary}
          uppercase={false}
          style={{
            borderRadius: 5,
            paddingHorizontal: 10,
            width: '80%',
            alignSelf: 'center',
            marginTop: 10,
          }}>
          Submit
        </Button>
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    width: '80%',
    borderRadius: 10,
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
})
export default EditDiagnosisModal
