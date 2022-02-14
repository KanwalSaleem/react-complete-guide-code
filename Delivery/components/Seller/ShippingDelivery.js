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
import {Picker} from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {AppContext} from '../../context/auth'
import {useHttpClient} from '../../hooks/http-hook'
import {ActivityIndicator} from 'react-native-paper'

const ShippingDelivery = () => {
  const {user, login} = useContext(AppContext)
  const {sendRequest, isLoading, error, clearError} = useHttpClient()

  const [shopDetails, setShopDetails] = useState(false)
  const [image, setImage] = useState(
    user.shopInfo.logo ? user.shopInfo.logo : '',
  )
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: {errors},
  } = useForm({mode: 'all'})

  const onSubmit = async (data) => {
    console.log(image, 'image')
    try {
      const response = await sendRequest(
        'https://deliverypay.in/api/editUserProfile',
        'PATCH',
        JSON.stringify({
          'shopInfo.deliveryWithin': data.deliveryWithin,
          'shopInfo.refundable': data.refundable,
          'shopInfo.shippingCost': data.shippingCost,
        }),
        {
          'Content-Type': 'application/json',
        },
      )
      if (error) {
        return Alert.alert('Error', error)
      }
      Alert.alert('Success', response.message)
      console.log(response)
      console.log(data)
      login((prev) => ({...prev, shopInfo: response.user.shopInfo}))
      setShopDetails(false)
    } catch (e) {
      e
    }
  }

  useEffect(() => {
    reset({
      shippingCost: user.shopInfo.shippingCost?.toString(),
      deliveyWithin: user.shopInfo.deliveryWithin?.toString(),
      refundable: user.shopInfo.refundable,
    })
  }, [
    reset,
    user.shopInfo.deliveryWithin,
    user.shopInfo.refundable,
    user.shopInfo.shippingCost,
  ])

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>{`Shipping & Delivery`}</Text>

        {!shopDetails && (
          <TouchableOpacity onPress={() => setShopDetails(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.fieldArea}>
        {shopDetails ? (
          <>
            <Text style={styles.fieldHeading}>Shipping Cost</Text>
            <View style={styles.fieldContainer}>
              <Controller
                name="shippingCost"
                control={control}
                shouldUnregister={true}
                // rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    style={[styles.field, errors.fullName && styles.redBorder]}
                    placeholder="Shippping Cost"
                  />
                )}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.fieldHeading}>
              Shippping Cost: {user.shopInfo.shippingCost}
            </Text>
          </>
        )}
      </View>

      <View style={styles.fieldArea}>
        {shopDetails ? (
          <>
            <Text style={styles.fieldHeading}>Delivery Within</Text>
            <View style={styles.fieldContainer}>
              <Controller
                name="deliveyWithin"
                control={control}
                shouldUnregister={true}
                // rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    style={[styles.field, errors.phone && styles.redBorder]}
                    placeholder="Delivery Within"
                  />
                )}
              />
            </View>
          </>
        ) : (
          <Text style={styles.fieldHeading}>
            Delivery Within (days): {user.shopInfo.deliveryWithin}
          </Text>
        )}
      </View>
      <View>
        {shopDetails ? (
          <>
            <Text style={styles.fieldHeading}>Refundable</Text>
            <View
              style={{
                borderColor: 'grey',
                borderWidth: 0.5,
                borderRadius: 10,
                width: '100%',
                alignSelf: 'center',
                marginBottom: 10,
              }}>
              <Controller
                name="refundable"
                control={control}
                render={({field: {value, onChange}}) => (
                  <Picker
                    mode="dropdown"
                    selectedValue={value}
                    onValueChange={onChange}>
                    <Picker.Item value="no" label="No" />
                    <Picker.Item
                      value="Upto 24 Hours After Delivery"
                      label="Upto 24 Hours After Delivery"
                    />
                    <Picker.Item
                      value="Upto 7 Days After Delivery"
                      label="Upto 7 Days After Delivery"
                    />
                    <Picker.Item
                      value="Upto 15 Days After Delivery"
                      label="Upto 15 Days After Delivery"
                    />
                  </Picker>
                )}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.fieldHeading}>
              {' '}
              Refundable: {user.shopInfo.refundable}
            </Text>
          </>
        )}
      </View>

      {shopDetails ? (
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
                onPress={() => setShopDetails(false)}>
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
    width: 150,
    height: 150,
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

export default ShippingDelivery
