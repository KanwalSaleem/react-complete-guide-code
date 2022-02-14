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

  const [showEditPay, setShowEditPay] = useState(false)
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
          'shopInfo.paymentMethod': {
            accountNumber: data.accountNumber,
            accountType: data.accountType,
            bank: data.bank,
            city: data.city,
            ifsc: data.ifsc,
            name: data.name,
          },
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

        login((prev) => ({...prev, shopInfo: response.user.shopInfo}))
        setShowEditPay(false)
      }
    } catch (e) {
      e
    }
  }

  useEffect(() => {
    reset({
      name: user.shopInfo.paymentMethod.name,
      bank: user.shopInfo.paymentMethod.bank,
      city: user.shopInfo.paymentMethod.city,
      ifsc: user.shopInfo.paymentMethod.ifsc,
      accountType: user.shopInfo.paymentMethod.accountType,
      accountNumber: user.shopInfo.paymentMethod.accountNumber,
    })
  }, [reset])

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Payment Method</Text>

        {!showEditPay && (
          <TouchableOpacity onPress={() => setShowEditPay(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
      <View>
        {showEditPay ? (
          <>
            {user.shopInfo && (
              <Text style={styles.fieldHeading}>
                Name: {user.shopInfo.paymentMethod.name}
              </Text>
            )}
            <View style={styles.fieldContainer}>
              <Controller
                name="name"
                control={control}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    value={value}
                    onChange={onChange}
                    style={[styles.field, errors.amount && styles.redBorder]}
                    placeholder="Name"
                  />
                )}
              />
            </View>
          </>
        ) : (
          <>
            {user.shopInfo && (
              <Text style={styles.fieldHeading}>
                Name: {user.shopInfo.paymentMethod.name}
              </Text>
            )}
          </>
        )}
      </View>
      <View style={styles.fieldArea}>
        {showEditPay ? (
          <>
            <Text style={styles.fieldHeading}>Bank</Text>
            <View style={styles.fieldContainer}>
              <Controller
                name="bank"
                control={control}
                shouldUnregister={true}
                // rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    value={value.toString()}
                    onChangeText={onChange}
                    style={[styles.field, errors.amount && styles.redBorder]}
                    placeholder="Bank"
                  />
                )}
              />
            </View>
          </>
        ) : (
          <>
            {user.shopInfo && (
              <Text style={styles.fieldHeading}>
                Bank: {`${user.shopInfo.paymentMethod.bank}`}
              </Text>
            )}
          </>
        )}
      </View>
      <View style={styles.fieldArea}>
        {showEditPay ? (
          <>
            <Text style={styles.fieldHeading}>City</Text>
            <View style={styles.fieldContainer}>
              <Controller
                name="city"
                control={control}
                shouldUnregister={true}
                // rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    style={[styles.field, errors.amount && styles.redBorder]}
                    placeholder="City"
                  />
                )}
              />
            </View>
          </>
        ) : (
          <>
            {user.shopInfo && (
              <Text style={styles.fieldHeading}>
                City: {`${user.shopInfo.paymentMethod.city}`}
              </Text>
            )}
          </>
        )}
      </View>
      <View style={styles.fieldArea}>
        {showEditPay ? (
          <>
            <Text style={styles.fieldHeading}>Account Type</Text>
            <View style={styles.fieldContainer}>
              <Controller
                name="accountType"
                control={control}
                shouldUnregister={true}
                // rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    value={value.toString()}
                    onChangeText={onChange}
                    style={[styles.field, errors.amount && styles.redBorder]}
                    placeholder="Account Type"
                  />
                )}
              />
            </View>
          </>
        ) : (
          <>
            {user.shopInfo && (
              <Text style={styles.fieldHeading}>
                Account Type: {`${user.shopInfo.paymentMethod.accountType}`}
              </Text>
            )}
          </>
        )}
      </View>
      <View style={styles.fieldArea}>
        {showEditPay ? (
          <>
            <Text style={styles.fieldHeading}>Account Number</Text>
            <View style={styles.fieldContainer}>
              <Controller
                name="accountNumber"
                control={control}
                shouldUnregister={true}
                // rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    value={value.toString()}
                    onChangeText={onChange}
                    style={[styles.field, errors.amount && styles.redBorder]}
                    placeholder="Account Number"
                  />
                )}
              />
            </View>
          </>
        ) : (
          <>
            {user.shopInfo && (
              <Text style={styles.fieldHeading}>
                Account Number: {`${user.shopInfo.paymentMethod.accountNumber}`}
              </Text>
            )}
          </>
        )}
      </View>
      <View style={styles.fieldArea}>
        {showEditPay ? (
          <>
            <Text style={styles.fieldHeading}>IFSC</Text>
            <View style={styles.fieldContainer}>
              <Controller
                name="ifsc"
                control={control}
                shouldUnregister={true}
                // rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    style={[styles.field, errors.amount && styles.redBorder]}
                    placeholder="IFSC"
                  />
                )}
              />
            </View>
          </>
        ) : (
          <>
            {user.shopInfo && (
              <Text style={styles.fieldHeading}>
                IFSC: {`${user.shopInfo.paymentMethod.ifsc}`}
              </Text>
            )}
          </>
        )}
      </View>
      {showEditPay ? (
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
                onPress={() => setShowEditPay(false)}>
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
    fontSize: 18,
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
