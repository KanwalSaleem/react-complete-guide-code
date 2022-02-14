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

const ShopDetails = () => {
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
          'shopInfo.offerings': data.offerings,
          'shopInfo.name': data.shopName,
          'shopInfo.phone': data.phone,
          'shopInfo.logo': image,
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
      setValue('files', response[0].uri)
      setImage(response[0].uri)
      console.log(response[0])
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    reset({
      shopName: user.shopInfo.name,
      phone: user.shopInfo.phone,
      offerings: user.shopInfo.offerings,
    })
  }, [reset, user.shopInfo.name, user.shopInfo.offerings, user.shopInfo.phone])

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Shop Details</Text>

        {!shopDetails && (
          <TouchableOpacity onPress={() => setShopDetails(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
      <View>
        {shopDetails ? (
          <>
            <Text style={styles.fieldHeading}>We Sell</Text>
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
                name="offerings"
                control={control}
                render={({field: {value, onChange}}) => (
                  <Picker
                    mode="dropdown"
                    selectedValue={value}
                    onValueChange={onChange}>
                    <Picker.Item value="product" label="Product" />
                    <Picker.Item value="service" label="Service" />
                    <Picker.Item value="both" label="Both" />
                  </Picker>
                )}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.fieldHeading}>
              {' '}
              We Sell: {user.shopInfo.offerings}
            </Text>
          </>
        )}
      </View>
      <View style={styles.fieldArea}>
        {shopDetails ? (
          <>
            <Text style={styles.fieldHeading}>Shop Name</Text>
            <View style={styles.fieldContainer}>
              <Controller
                name="shopName"
                control={control}
                shouldUnregister={true}
                // rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    style={[styles.field, errors.fullName && styles.redBorder]}
                    placeholder="ShopName"
                  />
                )}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.fieldHeading}>
              Shop Name: {user.shopInfo.name}
            </Text>
          </>
        )}
      </View>

      <View style={styles.fieldArea}>
        {shopDetails ? (
          <>
            <Text style={styles.fieldHeading}>Phone</Text>
            <View style={styles.fieldContainer}>
              <Controller
                name="phone"
                control={control}
                shouldUnregister={true}
                // rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    style={[styles.field, errors.phone && styles.redBorder]}
                    placeholder="Phone"
                  />
                )}
              />
            </View>
          </>
        ) : (
          <Text style={styles.fieldHeading}>Phone: {user.shopInfo.phone}</Text>
        )}
      </View>
      <View style={styles.imageField}>
        <Text style={[styles.fieldHeading, {marginLeft: 0}]}>Logo</Text>
        <TouchableOpacity
          disabled={!shopDetails}
          activeOpacity={0.6}
          style={styles.imagePickerContainer}
          onPress={filePickerHandler}>
          {image ? (
            <Image source={{uri: image}} style={styles.image} />
          ) : (
            <Icon name="description" size={30} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      {shopDetails ? (
        <View style={styles.buttonContainer}>
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

export default ShopDetails
