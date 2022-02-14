import React, {useState, useContext, useEffect} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native'

import {useForm, Controller} from 'react-hook-form'
import colors from '../../constants/colors'
import {ActivityIndicator} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {AppContext} from '../../context/auth'
import {useHttpClient} from '../../hooks/http-hook'

const PolicyTerms = () => {
  const {user, login} = useContext(AppContext)
  const [showTermsEdit, setShowTermsEdit] = useState(false)
  const {
    control,
    handleSubmit,

    reset,
    formState: {errors},
  } = useForm({mode: 'all'})

  const {sendRequest, isLoading, error, clearError} = useHttpClient()

  const onSubmit = async (data) => {
    // console.log(image, 'image')
    try {
      const response = await sendRequest(
        'https://deliverypay.in/api/editUserProfile',
        'PATCH',
        JSON.stringify({
          'shopInfo.terms': user.shopInfo.terms,
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
      }
    } catch (e) {
      e
    }
  }
  const addTerm = (data) => {
    login((prev) => ({
      ...prev,
      shopInfo: {...prev.shopInfo, terms: [...prev.shopInfo.terms, data.term]},
    }))
    reset()
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Return Policy Terms</Text>

        {!showTermsEdit && (
          <TouchableOpacity onPress={() => setShowTermsEdit(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.fieldContainer}>
        {user.shopInfo.terms.map((term) => (
          <View
            key={term}
            style={{
              borderWidth: 0.5,
              padding: 5,
              borderRadius: 5,
              marginTop: 5,
              paddingBottom: 10,
              paddingLeft: 10,
              justifyContent: 'space-between',
              //   alignItems: 'center',
              flexDirection: 'column-reverse',
              //   flexWrap: 'nowrap',
            }}>
            <View>
              <Text
                style={{textAlign: 'left', fontSize: showTermsEdit ? 14 : 14}}>
                {term}
              </Text>
            </View>
            {showTermsEdit && (
              <TouchableOpacity style={{alignSelf: 'flex-end'}}>
                <Icon color="red" size={25} name="close" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
      {/* <View style={styles.fieldArea}> */}
      {showTermsEdit && (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 10,
            }}>
            {/* <View style={{borderRadius: 10, borderWidth: 0.5, width: '70%'}}> */}
            <Controller
              name="term"
              control={control}
              shouldUnregister={true}
              // rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  style={[styles.field, errors.amount && styles.redBorder]}
                  placeholder="Add Term"
                />
              )}
            />
            {/* </View> */}

            <TouchableOpacity
              style={[styles.button, {padding: 10}]}
              activeOpacity={0.6}
              onPress={handleSubmit(addTerm)}>
              <Text style={styles.buttonText}>Add Term</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {/* </View> */}
      {showTermsEdit ? (
        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.6}
                onPress={onSubmit}>
                <Text style={styles.buttonText}>Save Changes </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.6}
                onPress={() => setShowTermsEdit(false)}>
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

  fieldContainer: {
    borderRadius: 10,
    borderColor: '#ccc',
    // borderWidth: 2,
    // width: '80%',
    // alignSelf: 'center',
    paddingLeft: 5,
    marginBottom: 20,
    paddingRight: 5,
  },
  fieldArea: {
    flexDirection: 'row',
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
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: 'Poppins-Regulat',
    fontSize: 18,
    color: '#fff',
  },
  field: {
    width: '70%',
    alignSelf: 'center',
    borderBottomWidth: 2,
    fontSize: 16,
    borderBottomColor: '#cccc',
    // marginTop: 10,
  },
})

export default PolicyTerms
