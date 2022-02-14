import React, {useState, useEffect, useCallback} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useForm, Controller} from 'react-hook-form'
import colors from '../../constants/colors'

const Categories = () => {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: {errors},
  } = useForm({mode: 'all'})

  const onSubmit = async (data) => {
    console.log(data)
    try {
      const response = await fetch('https://deliverypay.in/api/addCategory', {
        method: 'POST',
        body: JSON.stringify({
          category: data.category,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      const resData = await response.json()
      if (!response.ok) {
        throw new Error(resData.message)
      }
      // console.log(response)
      console.log(resData.categories)
      reset()
      setCategories(resData.categories)
      // getCategories()
    } catch (e) {
      //   Alert.alert('Error', e)
      console.log(e)
    }
  }

  const getCategories = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('https://deliverypay.in/api/categories')
      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message)
      }

      setCategories(resData.categories)
    } catch (e) {
      Alert.alert(e)
    }
    setLoading(false)
  }, [])

  const deleteCategory = async (category) => {
    try {
      const response = await fetch('https://deliverypay.in/api/categories', {
        method: 'DELETE',
        body: JSON.stringify({
          category,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      const resData = await response.json()
      if (!response.ok) {
        throw new Error(resData.message)
      }
      console.log(resData)
      setCategories((prev) =>
        prev.filter((category) => category !== resData.category),
      )

      getCategories()
    } catch (e) {
      Alert.alert('Error', e)
    }
  }

  useEffect(() => {
    getCategories()
  }, [getCategories])

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Categories</Text>
      <View style={styles.categoryContainer}>
        {categories.length === 0 ? (
          <View style={styles.category}>
            <Text style={styles.categoryText}>No Categores Found</Text>
          </View>
        ) : (
          categories.map((category) => (
            <View key={category} style={styles.category}>
              <Text style={styles.categoryText}>{category}</Text>
              <TouchableOpacity onPress={deleteCategory.bind(this, category)}>
                <Icon color="red" size={30} name="close" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
      <View style={styles.fieldArea}>
        <View style={styles.fieldContainer}>
          <Controller
            name="category"
            rules={{required: true}}
            control={control}
            render={({field: {value, onChange}}) => (
              <TextInput
                placeholder="New Category"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Add Category</Text>
        </TouchableOpacity>
      )}
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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 20,
    justifyContent: 'center',
    textAlign: 'center',
  },
  category: {
    flexDirection: 'row',
    backgroundColor: '#00000008',
    borderRadius: 10,
    borderWidth: 0.5,
    padding: 10,
    alignItems: 'center',
    marginRight: 5,
    marginTop: 10,
  },
  categoryText: {
    fontSize: 18,
    marginRight: 10,
  },
  fieldArea: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  fieldContainer: {
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 2,
    width: '80%',
    alignSelf: 'center',
    paddingLeft: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 10,
    width: '50%',
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-Regulat',
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
})

export default Categories
