import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native'
import {Portal, Modal} from 'react-native-paper'
import colors from '../../constants/colors'

import Icon from 'react-native-vector-icons/MaterialIcons'
import DocumentPicker from 'react-native-document-picker'
import LinearGradient from 'react-native-linear-gradient'

const AddProductService = (props) => {
  const [files, setFiles] = useState('')

  const filePickerHandler = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.csv, DocumentPicker.types.xlsx],
        allowMultiSelection: true,
        mode: 'import',
      })

      setFiles(response[0].uri)
      console.log(response[0])
    } catch (e) {
      console.log(e)
    }
  }

  const onSubmit = () => props.onSubmit(files)

  return (
    <Portal>
      <Modal
        contentContainerStyle={styles.modalContainer}
        onDismiss={() => props.onDismiss(false)}
        visible={props.open}>
        <View style={styles.modalHeadingContainer}>
          <Text style={styles.modalHeading}>Add Product/ Service</Text>
        </View>
        <ScrollView>
          <View style={styles.imageField}>
            <Text style={styles.fieldHeading}>Images of the Product</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.imagePickerContainer}
              onPress={filePickerHandler}>
              <Icon name="description" size={30} color="#fff" />
            </TouchableOpacity>
            {files.length > 0 && <Text>File Selected</Text>}
          </View>

          <TouchableOpacity
            activeOpacity={0.6}
            style={{marginTop: 20}}
            onPress={onSubmit}
            disabled={files.length == 0}>
            <LinearGradient
              start={{x: 0, y: 1}}
              //   end={{x: 1, y: 0}}
              colors={['#2598b6', '#0b1a45']}
              style={{
                borderRadius: 30,
                height: 48,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                width: 120,
                alignSelf: 'center',
              }}>
              <Text style={{color: '#fff'}}>Submit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    // alignItems: 'center',
    width: '80%',
    // paddingVertical: 10,
    alignSelf: 'center',
    borderRadius: 5,
    paddingBottom: 20,
  },
  modalHeadingContainer: {
    backgroundColor: 'white',
    width: '100%',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    // alignItems: 'center',
  },
  modalHeading: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: colors.blue,
  },
  fieldContainer: {
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 2,
    // width: '80%',
    // alignSelf: 'center',
    paddingLeft: 20,
    marginBottom: 20,
  },
  field: {
    width: '90%',
    alignSelf: 'center',
    borderBottomWidth: 2,
    fontSize: 16,
    borderBottomColor: '#cccc',
    color: '#000',
  },
  fieldArea: {
    paddingHorizontal: 10,
  },
  fieldHeading: {
    marginTop: 5,
    marginLeft: 10,
    // fontFamily: 'Poppins-SemiBol\',
    fontSize: 14,
    color: 'grey',
  },
  tagForm: {
    justifyContent: 'space-between',
    padding: 5,
    flexDirection: 'row',
    borderRadius: 30,
    borderColor: 'grey',
    borderWidth: 0.5,
  },
  addTagButton: {
    backgroundColor: colors.blue,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    padding: 10,
    justifyContent: 'center',
  },
  tagInput: {
    flexBasis: '60%',
    color: 'black',
  },
  tagFormText: {
    color: '#fff',
  },
  tagsContainer: {
    flexDirection: 'row',
    borderRadius: 30,
    borderWidth: 0.5,
    padding: 5,
    borderColor: 'grey',
    marginBottom: 10,
    flexWrap: 'wrap',
    minHeight: 50,
  },
  tag: {
    flexDirection: 'row',
    borderRadius: 30,
    borderWidth: 0.5,
    marginRight: 5,
    padding: 5,
    alignItems: 'center',
    marginBottom: 3,
  },
  tagText: {
    fontFamily: 'Poppins-Regular',
    marginRight: 5,
  },
  image: {
    borderWidth: 0.5,
    width: 130,
    height: 130,
    borderRadius: 20,
  },
  imageField: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerContainer: {
    width: 130,
    height: 130,
    backgroundColor: '#ccc',

    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default AddProductService
