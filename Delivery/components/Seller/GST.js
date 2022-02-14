import React, {useRef, useState, useContext, useEffect} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import {useForm, Controller} from 'react-hook-form'
import colors from '../../constants/colors'
import {ActivityIndicator} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {AppContext} from '../../context/auth'
import {useHttpClient} from '../../hooks/http-hook'

const GST = () => {
  const {user, login} = useContext(AppContext)

  const {sendRequest, isLoading, error, clearError} = useHttpClient()

  const [showGST, setShowGST] = useState(false)
  const [images, setImages] = useState(user.gst ? user.gst?.detail?.files : [])
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: {errors},
  } = useForm({mode: 'all'})

  const onSubmit = async (data) => {
    // console.log(image, 'image')
    try {
      const response = await sendRequest(
        'https://deliverypay.in/api/editUserProfile',
        'PATCH',
        JSON.stringify({
          'gst.amount': data.amount,
          'gst.detail.files': images,
          'gst.detail.reg': data.reg,
        }),
        {
          'Content-Type': 'application/json',
        },
      )
      if (error) {
        return Alert.alert('Error', error)
      } else {
        Alert.alert('Success', response.message)
        console.log(response)
        // console.log(data)

        login((prev) => ({...prev, gst: response.user.gst}))
        setShowGST(false)
      }
    } catch (e) {
      e
    }
  }
  const filePickerHandler = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [
          // DocumentPicker.types.pdf,
          // DocumentPicker.types.docx,
          // DocumentPicker.types.doc,
          DocumentPicker.types.images,
        ],
        allowMultiSelection: true,
        mode: 'import',
      })

      // images[fileIndex] = {
      //   uri: response.uri,
      //   type: response.type,
      //   fileName: response.name,
      // }
      setValue(
        'files',
        response.map((image) => image.uri),
      )
      setImages(response.map((image) => image.uri))
      console.log(response[0])
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    reset({
      reg: user?.gst?.detail?.reg,
      amount: user?.gst?.amount,
    })
  }, [reset, user?.gst?.amount, user?.gst?.detail?.reg])

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>GST</Text>

        {!showGST && (
          <TouchableOpacity onPress={() => setShowGST(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
      <View>
        <View>
          <Text style={styles.fieldHeading}>
            Status: {`${user?.gst?.verified ? 'Verified' : 'Unverified'}`}
          </Text>
        </View>
        {showGST ? (
          <>
            {user.gst && (
              <Text style={styles.fieldHeading}>
                GST Registration number: {user?.gst?.detail?.reg}
              </Text>
            )}
            <View style={styles.fieldContainer}>
              <Controller
                name="reg"
                control={control}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    value={value}
                    onChange={onChange}
                    style={[styles.field, errors.amount && styles.redBorder]}
                  />
                )}
              />
            </View>
          </>
        ) : (
          <>
            {user.gst && (
              <Text style={styles.fieldHeading}>
                GST Registration number: {user?.gst?.detail?.reg}
              </Text>
            )}
          </>
        )}
      </View>
      <View style={styles.fieldArea}>
        {showGST ? (
          <>
            <Text style={styles.fieldHeading}>GST Percentage %</Text>
            <View style={styles.fieldContainer}>
              <Controller
                name="amount"
                control={control}
                shouldUnregister={true}
                rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    value={value ? value.toString() : ''}
                    onChangeText={onChange}
                    style={[styles.field, errors.amount && styles.redBorder]}
                    placeholder="GST Amount"
                  />
                )}
              />
            </View>
          </>
        ) : (
          <>
            {user.gst && (
              <Text style={styles.fieldHeading}>
                GST Amount: {`${user.gst.amount}%`}
              </Text>
            )}
          </>
        )}
      </View>

      <View style={styles.imageField}>
        <Text style={{fontSize: 16, fontFamily: 'Poppins-SemiBold'}}>
          Upload files for verification
        </Text>
        <TouchableOpacity
          disabled={!showGST}
          activeOpacity={0.6}
          style={styles.imagePickerContainer}
          onPress={filePickerHandler}>
          {images.length > 0 ? (
            <Image source={{uri: images[0]}} style={styles.image} />
          ) : (
            <Icon name="description" size={30} color="#fff" />
          )}
        </TouchableOpacity>
        <Text>{`${images.length} Selected`}</Text>
      </View>
      {showGST ? (
        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.6}
                onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Save Changes </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.6}
                onPress={() => setShowGST(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    elevation: 6,
    paddingVertical: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',

    justifyContent: 'center',
    textAlign: 'center',
  },
  editText: {
    color: colors.purple,
    textDecorationColor: colors.purple,
    textDecorationLine: 'underline',
    fontSize: 16,
    alignSelf: 'flex-end',
  },
  imagePickerContainer: {
    width: 130,
    height: 130,
    backgroundColor: '#ccc',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldArea: {
    paddingHorizontal: 10,
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
  fieldHeading: {
    marginLeft: 10,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    marginBottom: 5,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: 'Poppins-Regulat',
    fontSize: 18,
    color: '#fff',
  },
})

export default GST
