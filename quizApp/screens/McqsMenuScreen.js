import React, {useCallback, useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import FormData from 'form-data'
import Input from '../components/Input'
import CategoryMcqs from '../components/CategoryMcqs'
import Colors from '../constants/Colors'

const McqsMenuScreen = () => {
  const {handleSubmit, control} = useForm()

  const [MainData, setMainData] = useState([])
  const [SubData, setSubData] = useState([])
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [searchData, setSearchData] = useState([])
  const [searchCategory, setSearchCategory] = useState('')

  const getCategories = useCallback(async () => {
    try {
      let base_url = 'https://www.worldmcqs.org/Admin/API/fetch.php'
      let uploadData = new FormData()
      uploadData.append('request_name', 'fetchCategories')
      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      })

      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(responseData.message)
      }
      const mainData = responseData.Data

      var main_data_aray = []
      mainData.forEach(function (data_main_categories) {
        const category_name = data_main_categories.Category_Name

        const category_id = data_main_categories.category_id

        main_data_aray.push({
          category_name: category_name,
          category_id: category_id,
        })

        const sub_categories = data_main_categories.Sub_Cat
        sub_categories.forEach(function (sub_cat_data) {
          SubData.push(sub_cat_data)
        })
        setSubData(SubData)
      })
      setMainData(mainData)
      setSearchData(mainData)
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getCategories()
  }, [getCategories])

  const setCategory = text => {
    setSearchCategory(text)
    if (text) {
      setMainData(
        MainData.filter(item =>
          item.Category_Name.toLowerCase().includes(text.toLowerCase()),
        ),
      )
    } else {
      setMainData(searchData)
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.banner}>
        <Text style={styles.heading}>World MCQs</Text>
        <View style={styles.inputView}>
          <View style={styles.inputTextView}>
            <TextInput
              placeholder="Search"
              // control={control}
              name="search"
              value={searchCategory}
              style={styles.searchInput}
              onChangeText={setCategory}
            />
          </View>
        </View>
      </View>
      {isLoading ? (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <CategoryMcqs Data={MainData} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  screen: {
    flex: 1,
  },
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    height: 250,
    width: '100%',
    backgroundColor: Colors.primary,
    // position: 'absolute',
    zIndex: -1,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 46,
    color: Colors.secondary,
    marginBottom: 20,
  },
  inputView: {
    flexDirection: 'row',
  },
  inputTextView: {
    width: '70%',
    backgroundColor: 'white',
    height: 50,
    borderRadius: 20,
    padding: 10,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchInput: {
    color: 'white',
    borderBottomColor: 'white',
    height: 50,
    flexBasis: '90%',
  },
  categoriesContainer: {
    marginHorizontal: 10,
    // marginBottom: 10,
    marginTop: 250,
  },
})

export default McqsMenuScreen
